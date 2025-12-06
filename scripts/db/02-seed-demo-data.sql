-- Insert demo user
INSERT INTO users (id, email, password_hash, name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'demo@energymonitor.io', '$2b$10$demo_hash', 'Demo User', 'owner');

-- Insert demo site
INSERT INTO sites (id, owner_id, name, timezone, address) VALUES
('site-demo', '00000000-0000-0000-0000-000000000001', 'Demo Home', 'America/New_York', '123 Energy St, San Francisco, CA');

-- Insert rooms
INSERT INTO rooms (id, site_id, name, floor) VALUES
('room-living', 'site-demo', 'Living Room', 1),
('room-kitchen', 'site-demo', 'Kitchen', 1),
('room-bedroom', 'site-demo', 'Bedroom', 2),
('room-office', 'site-demo', 'Office', 2);

-- Insert demo devices
INSERT INTO devices (id, site_id, room_id, name, device_type, nominal_w, firmware_version) VALUES
('dev-ac-001', 'site-demo', 'room-living', 'Living Room AC', 'AC', 1500, 'v1.2.0'),
('dev-fridge-001', 'site-demo', 'room-kitchen', 'Kitchen Refrigerator', 'Refrigerator', 150, 'v1.0.5'),
('dev-heater-001', 'site-demo', 'room-bedroom', 'Bedroom Heater', 'Heater', 1200, 'v1.1.0'),
('dev-light-001', 'site-demo', 'room-living', 'Living Room Lights', 'Lighting', 60, 'v2.0.1'),
('dev-washer-001', 'site-demo', 'room-kitchen', 'Washing Machine', 'Appliance', 500, 'v1.3.2'),
('dev-pc-001', 'site-demo', 'room-office', 'Office Computer', 'Electronics', 300, 'v1.0.0');

-- Insert sample automation
INSERT INTO automations (site_id, owner_id, name, description, condition, action, enabled) VALUES
('site-demo', '00000000-0000-0000-0000-000000000001', 
 'High Power Alert', 
 'Send notification when total power exceeds 3000W',
 '{"type":"power_threshold","operator":">","value":3000,"duration_s":60}',
 '{"type":"notification","message":"High power consumption detected"}',
 true);
