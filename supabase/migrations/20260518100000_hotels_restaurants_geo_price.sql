-- Add geographic coordinates to hotels and restaurants,
-- and price_from to hotels. All columns nullable to avoid
-- breaking existing records.

ALTER TABLE hotels
  ADD COLUMN lat        numeric(10,6),
  ADD COLUMN lng        numeric(10,6),
  ADD COLUMN price_from numeric(15,2);

ALTER TABLE restaurants
  ADD COLUMN lat numeric(10,6),
  ADD COLUMN lng numeric(10,6);
