CREATE TABLE location_images (
  key        text PRIMARY KEY,
  image_path text,
  updated_at timestamptz DEFAULT now() NOT NULL
);
