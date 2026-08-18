-- Add detailed real-estate attributes to projects

alter table public.projects
  add column if not exists property_type text
    check (property_type in ('daire', 'villa', 'mustakil-ev', 'ticari', 'arsa', 'ofis')),
  add column if not exists price numeric,
  add column if not exists price_currency text
    check (price_currency in ('TRY', 'USD', 'GBP')),
  add column if not exists area_m2 numeric,
  add column if not exists room_config text
    check (room_config in ('studyo', '1+1', '2+1', '3+1', '4+1', '5+1', '6+1-uzeri')),
  add column if not exists bathroom_count smallint,
  add column if not exists building_age smallint,
  add column if not exists floor_count smallint,
  add column if not exists floor_no text,
  add column if not exists furnishing text
    check (furnishing in ('esyali', 'esyasiz', 'yari-esyali')),
  add column if not exists has_parking boolean not null default false,
  add column if not exists has_pool boolean not null default false,
  add column if not exists has_balcony boolean not null default false,
  add column if not exists mortgage_eligible boolean not null default false,
  add column if not exists swap_eligible boolean not null default false;
