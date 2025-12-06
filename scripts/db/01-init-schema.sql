-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner', -- owner, admin, analyst
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table
CREATE TABLE sites (
  id TEXT PRIMARY KEY,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  address TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  floor INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Devices table
CREATE TABLE devices (
  id TEXT PRIMARY KEY,
  site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
  room_id TEXT REFERENCES rooms(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  device_type TEXT NOT NULL, -- AC, Refrigerator, Heater, Lighting, etc.
  nominal_w INTEGER,
  status TEXT DEFAULT 'active', -- active, inactive, maintenance
  firmware_version TEXT,
  installed_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Readings table (TimescaleDB hypertable)
CREATE TABLE readings (
  time TIMESTAMPTZ NOT NULL,
  site_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  power_w DOUBLE PRECISION,
  energy_wh DOUBLE PRECISION,
  voltage_v DOUBLE PRECISION,
  current_a DOUBLE PRECISION,
  power_factor DOUBLE PRECISION,
  frequency_hz DOUBLE PRECISION,
  raw JSONB
);

-- Convert to hypertable
SELECT create_hypertable('readings', 'time');

-- Create indexes for common queries
CREATE INDEX idx_readings_device_time ON readings (device_id, time DESC);
CREATE INDEX idx_readings_site_time ON readings (site_id, time DESC);

-- Continuous aggregate for 1-minute rollups
CREATE MATERIALIZED VIEW readings_1min
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 minute', time) AS bucket,
  site_id,
  device_id,
  AVG(power_w) AS avg_power_w,
  MAX(power_w) AS max_power_w,
  MIN(power_w) AS min_power_w,
  SUM(energy_wh) AS total_energy_wh,
  COUNT(*) AS reading_count
FROM readings
GROUP BY bucket, site_id, device_id
WITH NO DATA;

-- Continuous aggregate for hourly rollups
CREATE MATERIALIZED VIEW readings_1hour
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', time) AS bucket,
  site_id,
  device_id,
  AVG(power_w) AS avg_power_w,
  MAX(power_w) AS max_power_w,
  MIN(power_w) AS min_power_w,
  SUM(energy_wh) AS total_energy_wh,
  COUNT(*) AS reading_count
FROM readings
GROUP BY bucket, site_id, device_id
WITH NO DATA;

-- Refresh policies
SELECT add_continuous_aggregate_policy('readings_1min',
  start_offset => INTERVAL '1 hour',
  end_offset => INTERVAL '1 minute',
  schedule_interval => INTERVAL '1 minute');

SELECT add_continuous_aggregate_policy('readings_1hour',
  start_offset => INTERVAL '1 day',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour');

-- Anomalies table
CREATE TABLE anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT REFERENCES devices(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
  time TIMESTAMPTZ NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  type TEXT NOT NULL, -- spike, drop, pattern_change, efficiency_loss
  severity TEXT NOT NULL, -- low, medium, high, critical
  confidence DOUBLE PRECISION,
  expected_value DOUBLE PRECISION,
  actual_value DOUBLE PRECISION,
  explanation TEXT,
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  false_positive BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anomalies_device_time ON anomalies (device_id, time DESC);
CREATE INDEX idx_anomalies_site_time ON anomalies (site_id, time DESC);
CREATE INDEX idx_anomalies_resolved ON anomalies (resolved, created_at DESC);

-- Automations table
CREATE TABLE automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  condition JSONB NOT NULL,
  action JSONB NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,
  cooldown_seconds INTEGER DEFAULT 300,
  last_triggered TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_automations_site_enabled ON automations (site_id, enabled);

-- Automation events table
CREATE TABLE automation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  condition_met JSONB,
  action_executed JSONB,
  result TEXT,
  success BOOLEAN,
  error TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_automation_events_automation ON automation_events (automation_id, triggered_at DESC);

-- Recommendations table
CREATE TABLE recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT REFERENCES devices(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- efficiency, schedule, replacement, maintenance
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  estimated_savings_kwh DOUBLE PRECISION,
  estimated_savings_cost DOUBLE PRECISION,
  confidence DOUBLE PRECISION,
  priority TEXT DEFAULT 'medium', -- low, medium, high
  status TEXT DEFAULT 'active', -- active, dismissed, implemented
  dismissed_by UUID REFERENCES users(id),
  dismissed_at TIMESTAMPTZ,
  implemented_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_recommendations_device ON recommendations (device_id, status, created_at DESC);
CREATE INDEX idx_recommendations_site ON recommendations (site_id, status, created_at DESC);

-- Forecasts table
CREATE TABLE forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT REFERENCES devices(id) ON DELETE CASCADE,
  site_id TEXT REFERENCES sites(id) ON DELETE CASCADE,
  forecast_time TIMESTAMPTZ NOT NULL,
  predicted_power_w DOUBLE PRECISION NOT NULL,
  confidence_lower DOUBLE PRECISION,
  confidence_upper DOUBLE PRECISION,
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_forecasts_device_time ON forecasts (device_id, forecast_time);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- anomaly, automation, recommendation, system
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read ON notifications (user_id, read, created_at DESC);

-- Data retention policy (keep raw readings for 90 days)
SELECT add_retention_policy('readings', INTERVAL '90 days');
