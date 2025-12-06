from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncpg
import redis.asyncio as redis
import numpy as np
from datetime import datetime, timedelta
import json
import os
from collections import deque
import asyncio

app = FastAPI(title="IoT Energy ML Service")

# Environment configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://iot_user:iot_password@localhost:5432/iot_energy")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Global connections
db_pool: Optional[asyncpg.Pool] = None
redis_client: Optional[redis.Redis] = None

# In-memory sliding windows for anomaly detection
device_windows = {}

class Reading(BaseModel):
    device_id: str
    site_id: str
    ts: str
    power_w: float
    voltage_v: Optional[float] = None
    current_a: Optional[float] = None

class AnomalyResult(BaseModel):
    is_anomaly: bool
    score: float
    type: str
    severity: str
    confidence: float
    expected_value: float
    actual_value: float
    explanation: str

class ForecastRequest(BaseModel):
    device_id: str
    horizon_hours: int = 24

class ForecastPoint(BaseModel):
    time: datetime
    predicted_power_w: float
    confidence_lower: float
    confidence_upper: float

@app.on_event("startup")
async def startup():
    global db_pool, redis_client
    
    # Initialize database pool
    db_pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    print("[ML] Database pool created")
    
    # Initialize Redis client
    redis_client = await redis.from_url(REDIS_URL)
    print("[ML] Redis client connected")
    
    # Start background worker for processing readings
    asyncio.create_task(process_readings_stream())

@app.on_event("shutdown")
async def shutdown():
    if db_pool:
        await db_pool.close()
    if redis_client:
        await redis_client.close()

async def process_readings_stream():
    """Background worker that processes readings from Redis stream"""
    print("[ML] Starting readings stream processor...")
    
    while True:
        try:
            # Read from Redis stream
            messages = await redis_client.xread(
                {'ml:readings': '$'},
                count=10,
                block=1000
            )
            
            for stream_name, stream_messages in messages:
                for message_id, message_data in stream_messages:
                    payload = json.loads(message_data[b'payload'])
                    
                    # Detect anomalies
                    anomaly = await detect_anomaly(Reading(**payload))
                    
                    if anomaly.is_anomaly:
                        # Store anomaly in database
                        await store_anomaly(payload, anomaly)
                        
                        # Emit notification via Redis pub/sub
                        await redis_client.publish(
                            'anomalies',
                            json.dumps({
                                'device_id': payload['device_id'],
                                'site_id': payload['site_id'],
                                'anomaly': anomaly.dict()
                            })
                        )
                    
                    # Acknowledge message
                    await redis_client.xdel('ml:readings', message_id)
                    
        except Exception as e:
            print(f"[ML] Error processing stream: {e}")
            await asyncio.sleep(1)

async def detect_anomaly(reading: Reading) -> AnomalyResult:
    """
    Detect anomalies using statistical methods:
    1. Z-score based detection
    2. Rate of change detection
    3. Pattern deviation detection
    """
    device_id = reading.device_id
    power = reading.power_w
    
    # Initialize sliding window for device if not exists
    if device_id not in device_windows:
        device_windows[device_id] = {
            'values': deque(maxlen=100),  # Last 100 readings
            'timestamps': deque(maxlen=100)
        }
    
    window = device_windows[device_id]
    window['values'].append(power)
    window['timestamps'].append(datetime.fromisoformat(reading.ts.replace('Z', '+00:00')))
    
    # Need at least 30 readings for meaningful statistics
    if len(window['values']) < 30:
        return AnomalyResult(
            is_anomaly=False,
            score=0.0,
            type='insufficient_data',
            severity='low',
            confidence=0.0,
            expected_value=power,
            actual_value=power,
            explanation='Insufficient historical data'
        )
    
    values = np.array(window['values'])
    mean = np.mean(values[:-1])  # Exclude current reading
    std = np.std(values[:-1])
    
    # Calculate z-score
    z_score = abs((power - mean) / std) if std > 0 else 0
    
    # Calculate rate of change
    if len(values) >= 2:
        prev_power = values[-2]
        rate_of_change = abs(power - prev_power) / prev_power if prev_power > 0 else 0
    else:
        rate_of_change = 0
    
    # Anomaly detection logic
    is_anomaly = False
    anomaly_type = 'normal'
    severity = 'low'
    confidence = 0.0
    explanation = 'Normal operation'
    
    # Spike detection (z-score > 3)
    if z_score > 3:
        is_anomaly = True
        anomaly_type = 'spike' if power > mean else 'drop'
        severity = 'high' if z_score > 5 else 'medium'
        confidence = min(z_score / 5, 1.0)
        explanation = f'Power {anomaly_type} detected: {power:.1f}W vs expected {mean:.1f}W (z-score: {z_score:.2f})'
    
    # Sudden change detection (>50% change)
    elif rate_of_change > 0.5:
        is_anomaly = True
        anomaly_type = 'sudden_change'
        severity = 'medium'
        confidence = min(rate_of_change, 1.0)
        explanation = f'Sudden power change: {rate_of_change*100:.1f}% increase/decrease'
    
    # Pattern deviation (consistently high/low)
    elif z_score > 2 and len(values) >= 50:
        recent_mean = np.mean(values[-10:])
        if abs(recent_mean - mean) / mean > 0.3:
            is_anomaly = True
            anomaly_type = 'pattern_change'
            severity = 'low'
            confidence = 0.6
            explanation = f'Pattern deviation detected: recent average {recent_mean:.1f}W differs from baseline {mean:.1f}W'
    
    return AnomalyResult(
        is_anomaly=is_anomaly,
        score=z_score,
        type=anomaly_type,
        severity=severity,
        confidence=confidence,
        expected_value=float(mean),
        actual_value=power,
        explanation=explanation
    )

async def store_anomaly(reading: dict, anomaly: AnomalyResult):
    """Store detected anomaly in database"""
    query = """
        INSERT INTO anomalies (device_id, site_id, time, score, type, severity, confidence, 
                               expected_value, actual_value, explanation, metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    """
    
    await db_pool.execute(
        query,
        reading['device_id'],
        reading['site_id'],
        datetime.fromisoformat(reading['ts'].replace('Z', '+00:00')),
        anomaly.score,
        anomaly.type,
        anomaly.severity,
        anomaly.confidence,
        anomaly.expected_value,
        anomaly.actual_value,
        anomaly.explanation,
        json.dumps({'raw_reading': reading})
    )

@app.post("/detect", response_model=AnomalyResult)
async def detect_anomaly_endpoint(reading: Reading):
    """Endpoint for on-demand anomaly detection"""
    return await detect_anomaly(reading)

@app.post("/forecast", response_model=List[ForecastPoint])
async def forecast_endpoint(request: ForecastRequest):
    """
    Generate power consumption forecast using simple moving average + seasonal patterns
    In production, use Prophet, SARIMA, or LightGBM
    """
    device_id = request.device_id
    horizon_hours = request.horizon_hours
    
    # Fetch historical data (last 7 days)
    query = """
        SELECT time_bucket('1 hour', time) as hour, AVG(power_w) as avg_power
        FROM readings
        WHERE device_id = $1 AND time > NOW() - INTERVAL '7 days'
        GROUP BY hour
        ORDER BY hour
    """
    
    rows = await db_pool.fetch(query, device_id)
    
    if len(rows) < 24:
        raise HTTPException(status_code=400, detail="Insufficient historical data for forecasting")
    
    # Extract hourly patterns
    hourly_values = [row['avg_power'] for row in rows]
    
    # Simple forecast: use last week's pattern + trend
    forecast_points = []
    base_time = datetime.now()
    
    for h in range(horizon_hours):
        forecast_time = base_time + timedelta(hours=h)
        hour_of_day = forecast_time.hour
        
        # Get historical values for this hour
        hour_values = [hourly_values[i] for i in range(len(hourly_values)) if i % 24 == hour_of_day]
        
        if hour_values:
            predicted = np.mean(hour_values)
            std = np.std(hour_values) if len(hour_values) > 1 else predicted * 0.1
        else:
            predicted = np.mean(hourly_values)
            std = np.std(hourly_values)
        
        forecast_points.append(ForecastPoint(
            time=forecast_time,
            predicted_power_w=float(predicted),
            confidence_lower=float(max(0, predicted - 1.96 * std)),
            confidence_upper=float(predicted + 1.96 * std)
        ))
    
    # Store forecast in database
    for point in forecast_points:
        await db_pool.execute(
            """
            INSERT INTO forecasts (device_id, site_id, forecast_time, predicted_power_w, 
                                   confidence_lower, confidence_upper, model_version)
            SELECT $1, site_id, $2, $3, $4, $5, 'simple_ma_v1'
            FROM devices WHERE id = $1
            """,
            device_id, point.time, point.predicted_power_w, 
            point.confidence_lower, point.confidence_upper
        )
    
    return forecast_points

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ml"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
