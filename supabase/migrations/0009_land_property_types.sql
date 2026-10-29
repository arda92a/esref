-- Land listings: add "arsa" (plot) and "tarla" (field) property types plus their
-- zoning fields. Price can also be marked as a starting price ("...'den başlayan").

alter table public.projects
  drop constraint if exists projects_property_type_check,
  add constraint projects_property_type_check
    check (property_type in ('daire', 'villa', 'mustakil-ev', 'ofis', 'depo', 'atolye', 'arsa', 'tarla'));

alter table public.projects
  add column if not exists zoning_status text
    check (zoning_status in ('konut', 'ticari')),
  add column if not exists zoning_ratio numeric
    check (zoning_ratio >= 0),
  add column if not exists floor_permit smallint
    check (floor_permit between 1 and 99),
  add column if not exists price_is_starting boolean not null default false;
