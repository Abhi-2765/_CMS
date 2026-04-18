-- Admin user: admin@campus.edu / Admin@123
-- Password uses bcrypt hash for Admin@123
INSERT INTO users (id, name, email, password, role, must_change_pass)
VALUES (
  gen_random_uuid(),
  'System Admin',
  'admin@campus.edu',
  '$2a$10$C8YQXY8B.gT.H.s8pOKmZeXl4nZ5hIfA4K6t6p9c.eS/O/bIu/O/u',
  'ADMIN',
  false
)
ON CONFLICT (email) DO NOTHING;
