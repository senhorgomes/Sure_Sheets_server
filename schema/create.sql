DROP DATABASE IF EXISTS sheet_database;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS sheets;
-- DROP TABLE IF EXISTS resources;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE sheets (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT REFERENCES users(id),
  current_state TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_saved BOOLEAN NOT NULL DEFAULT FALSE
);

-- CREATE TABLE resources (
--   id SERIAL PRIMARY KEY NOT NULL,
--   sheets_id INT REFERENCES sheets(id)
--   image_link VARCHAR(255),
--   current_state TEXT,
--   is_public BOOLEAN NOT NULL DEFAULT FALSE,
--   is_saved BOOLEAN NOT NULL DEFAULT FALSE,
-- );