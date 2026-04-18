CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('USER', 'STAFF', 'ADMIN');
CREATE TYPE complaint_status AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE complaint_category AS ENUM
  ('HOSTEL','CLASSROOM','INTERNET','SANITATION','ELECTRICAL','PLUMBING','OTHER');

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password        TEXT NOT NULL,
  role            user_role NOT NULL DEFAULT 'USER',
  must_change_pass BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE complaints (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category    complaint_category NOT NULL,
  image_url   TEXT,
  status      complaint_status NOT NULL DEFAULT 'PENDING',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE assignments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID UNIQUE NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  staff_id     UUID NOT NULL REFERENCES users(id),
  assigned_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE progress_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE metrics (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method       VARCHAR(10),
  path         TEXT,
  status_code  INT,
  latency_ms   INT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
