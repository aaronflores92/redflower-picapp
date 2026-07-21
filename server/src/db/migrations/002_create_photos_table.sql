CREATE TABLE IF NOT EXISTS photos (
      id                  BIGSERIAL PRIMARY KEY,
      owner_uid           TEXT NOT NULL,
      owner_display_name  TEXT,
      s3_key              TEXT NOT NULL UNIQUE,
      filename            TEXT NOT NULL,
      content_type        TEXT NOT NULL,
      size_bytes          BIGINT,
      category_id         INTEGER REFERENCES categories(id),
      date_taken          DATE,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
  );

CREATE INDEX IF NOT EXISTS idx_photos_owner_uid ON photos (owner_uid);
CREATE INDEX IF NOT EXISTS idx_photos_category_id ON photos (category_id);
CREATE INDEX IF NOT EXISTS idx_photos_date_taken ON photos (date_taken);