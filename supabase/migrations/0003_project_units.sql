-- Multi-unit (apartment building) support: a project can be a single structure
-- ("tekil" — villa/müstakil ev) or contain multiple sellable unit types ("coklu" — apartman).

alter table public.projects
  add column if not exists unit_mode text not null default 'tekil'
    check (unit_mode in ('tekil', 'coklu')),
  add column if not exists site_name text;

create table if not exists public.project_units (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  room_config text
    check (room_config in ('studyo', '1+1', '2+1', '3+1', '4+1', '5+1', '6+1-uzeri')),
  area_m2 numeric,
  bathroom_count smallint,
  floor_no text,
  furnishing text
    check (furnishing in ('esyali', 'esyasiz', 'yari-esyali')),
  price numeric,
  price_currency text
    check (price_currency in ('TRY', 'USD', 'GBP')),
  cover_image text,
  gallery_images jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_units_project_id_idx on public.project_units (project_id);
create index if not exists project_units_sort_order_idx on public.project_units (sort_order);

drop trigger if exists project_units_set_updated_at on public.project_units;
create trigger project_units_set_updated_at
  before update on public.project_units
  for each row execute function public.set_updated_at();

alter table public.project_units enable row level security;

drop policy if exists "Project units are viewable by everyone" on public.project_units;
create policy "Project units are viewable by everyone"
  on public.project_units for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated users can insert project units" on public.project_units;
create policy "Authenticated users can insert project units"
  on public.project_units for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated users can update project units" on public.project_units;
create policy "Authenticated users can update project units"
  on public.project_units for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete project units" on public.project_units;
create policy "Authenticated users can delete project units"
  on public.project_units for delete
  to authenticated
  using (true);
