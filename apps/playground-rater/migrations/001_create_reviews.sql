CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  place_id VARCHAR(255) NOT NULL,
  overall INTEGER NOT NULL CHECK (overall BETWEEN 1 AND 5),
  equipment INTEGER NOT NULL CHECK (equipment BETWEEN 1 AND 5),
  cleanliness INTEGER NOT NULL CHECK (cleanliness BETWEEN 1 AND 5),
  shade INTEGER NOT NULL CHECK (shade BETWEEN 1 AND 5),
  safety INTEGER NOT NULL CHECK (safety BETWEEN 1 AND 5),
  restrooms INTEGER NOT NULL CHECK (restrooms BETWEEN 1 AND 5),
  parking INTEGER NOT NULL CHECK (parking BETWEEN 1 AND 5),
  age_tags TEXT[] DEFAULT '{}',
  review_text TEXT NOT NULL DEFAULT '',
  reviewer_name VARCHAR(255) NOT NULL DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_place_id ON reviews (place_id);
