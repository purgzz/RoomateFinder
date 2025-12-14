CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS swipes (
  id SERIAL PRIMARY KEY,
  swiper_user_id INTEGER NOT NULL,
  target_profile_id INTEGER NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('like','pass')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
