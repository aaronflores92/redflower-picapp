CREATE TABLE IF NOT EXISTS categories (
      id    SERIAL PRIMARY KEY,
      name  TEXT NOT NULL UNIQUE
  );

  INSERT INTO categories (name) VALUES
      ('Family'), ('Dora'), ('Chuy'), ('Aaron'), ('Delia'), ('Guero'), ('Dani'), ('Avey'), ('Alex'), ('Joana'), ('Vacation'), ('Birthday'), ('Party'), ('Holiday'), ('Pets'), ('Other')
  ON CONFLICT (name) DO NOTHING;