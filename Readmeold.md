# IoT Energy Monitoring System

A complete end-to-end IoT energy monitoring platform with real-time data ingestion, ML-powered anomaly detection, forecasting, and automation capabilities.

## Architecture

\`\`\`
┌─────────────┐
│   Devices   │ ──MQTT──▶ ┌──────────────┐
│ (Simulators)│           │ MQTT Broker  │
└─────────────┘           │ (Mosquitto)  │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │    Ingest    │
                          │    Worker    │
                          └──┬────┬────┬─┘
                             │    │    │
                    ┌────────┘    │    └────────┐
                    ▼             ▼             ▼
            ┌──────────┐   ┌──────────┐  ┌──────────┐
            │TimescaleDB│   │  Redis   │  │Socket.IO │
            └─────┬────┘   └────┬─────┘  └────┬─────┘
                  │             │             │
            ┌─────▼─────────────▼─────────────▼─────┐
            │         Backend API (Next.js)          │
            └───────────────────┬────────────────────┘
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │ML Engine │ │Automation│ │ Frontend │
            │ (Python) │ │  Engine  │ │ (React)  │
            └──────────┘ └──────────┘ └──────────┘
\`\`\`

## Features

- **Real-time Monitoring**: Live power consumption tracking with WebSocket updates
- **ML Anomaly Detection**: Statistical and ML-based anomaly detection
- **Forecasting**: 24-hour power consumption predictions
- **Automation Engine**: Rule-based automation with conditions and actions
- **Device Management**: Comprehensive device tracking and control
- **Analytics Dashboard**: Multi-site analytics with heatmaps and trends
- **Notifications**: Real-time alerts for anomalies and automation triggers

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS v4
- Recharts
- Socket.IO Client

### Backend
- Next.js API Routes
- Socket.IO Server
- PostgreSQL + TimescaleDB
- Redis

### Ingest Worker
- Node.js
- MQTT.js
- PostgreSQL client

### ML Engine
- Python 3.11
- FastAPI
- NumPy
- AsyncPG

### Infrastructure
- Docker & Docker Compose
- Mosquitto MQTT Broker
- TimescaleDB (PostgreSQL extension)
- Redis

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for ML development)

### Running with Docker Compose

1. Clone the repository
\`\`\`bash
git clone <repo-url>
cd iot-energy-monitor
\`\`\`

2. Copy environment file
\`\`\`bash
cp .env.example .env
\`\`\`

3. Start all services
\`\`\`bash
docker-compose up -d
\`\`\`

4. Access the application
- Frontend: http://localhost:3000
- ML API: http://localhost:8000
- MQTT Broker: mqtt://localhost:1883

5. View logs
\`\`\`bash
docker-compose logs -f
\`\`\`

### Local Development

1. Install dependencies
\`\`\`bash
npm install
\`\`\`

2. Start infrastructure services
\`\`\`bash
docker-compose up -d timescaledb redis mqtt
\`\`\`

3. Run database migrations
\`\`\`bash
psql $DATABASE_URL < scripts/db/01-init-schema.sql
psql $DATABASE_URL < scripts/db/02-seed-demo-data.sql
\`\`\`

4. Start development servers

Terminal 1 - Frontend & API:
\`\`\`bash
npm run dev
\`\`\`

Terminal 2 - Ingest Worker:
\`\`\`bash
cd scripts/ingest
npm install
npm run dev
\`\`\`

Terminal 3 - ML Engine:
\`\`\`bash
cd scripts/ml
pip install -r requirements.txt
python main.py
\`\`\`

Terminal 4 - Automation Engine:
\`\`\`bash
cd scripts/automation
npm install
npm run dev
\`\`\`

Terminal 5 - Device Simulator:
\`\`\`bash
cd scripts/simulator
npm install
npm run dev
\`\`\`

## Project Structure

\`\`\`
.
├── app/                    # Next.js app (frontend + API routes)
│   ├── api/               # API endpoints
│   ├── dashboard/         # Dashboard pages
│   ├── devices/           # Device management
│   ├── alerts/            # Alerts & anomalies
│   ├── automations/       # Automation builder
│   └── admin/             # Admin dashboard
├── components/            # React components
│   ├── charts/           # Chart components
│   └── ui/               # UI components (shadcn)
├── lib/                   # Utilities & helpers
├── scripts/               # Backend services
│   ├── db/               # Database migrations
│   ├── ingest/           # MQTT ingest worker
│   ├── ml/               # ML engine (Python)
│   ├── automation/       # Automation engine
│   ├── simulator/        # Device simulator
│   └── mqtt/             # MQTT broker config
└── docker-compose.yml     # Service orchestration
\`\`\`

## API Endpoints

### REST API
- `GET /api/devices` - List devices
- `GET /api/devices/:id` - Get device details
- `GET /api/devices/:id/readings` - Get device readings
- `GET /api/anomalies` - List anomalies
- `POST /api/anomalies/:id/resolve` - Resolve anomaly
- `GET /api/automations` - List automations
- `POST /api/automations` - Create automation
- `GET /api/forecast/:device_id` - Get forecast

### WebSocket Events
- `reading` - Real-time power readings
- `anomaly` - Anomaly detected
- `automation_event` - Automation triggered

### ML Service
- `POST /detect` - Detect anomalies
- `POST /forecast` - Generate forecast
- `GET /health` - Health check

## MQTT Topics

- `site/{site_id}/device/{device_id}/telemetry` - Device telemetry
- `site/{site_id}/device/{device_id}/status` - Device status
- `site/{site_id}/device/{device_id}/command` - Device commands

## Database Schema

See `scripts/db/01-init-schema.sql` for complete schema including:
- Users, Sites, Rooms, Devices
- Readings (TimescaleDB hypertable)
- Anomalies, Automations, Recommendations
- Forecasts, Notifications

## Deployment

### Production Deployment

1. Build Docker images
\`\`\`bash
docker-compose build
\`\`\`

2. Push to registry
\`\`\`bash
docker tag iot-backend:latest your-registry/iot-backend:latest
docker push your-registry/iot-backend:latest
\`\`\`

3. Deploy to Kubernetes/Cloud Run/ECS
\`\`\`bash
kubectl apply -f k8s/
\`\`\`

### Environment Variables

See `.env.example` for all required environment variables.

## Monitoring & Observability

- Database metrics: TimescaleDB built-in monitoring
- Redis metrics: Redis INFO command
- Application logs: Docker logs or stdout
- ML metrics: FastAPI /health endpoint

## Testing

\`\`\`bash
# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Load testing
npm run test:load
\`\`\`

## Security

- TLS for MQTT in production
- JWT authentication for API
- Row-level security for multi-tenant data
- Rate limiting on ingest
- Input validation on all endpoints

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
