-- A unit type can span multiple floors, so "floor_no" doesn't make sense per type.
-- Replace it with a total count of that type within the building, plus free-form
-- feature tags (e.g. "Ormana Bakan") the admin can define per unit type.

alter table public.project_units
  drop column if exists floor_no,
  add column if not exists unit_count integer,
  add column if not exists features jsonb not null default '[]'::jsonb;
