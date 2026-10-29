-- Free-form feature tags at the project level (used for arsa / tarla listings),
-- e.g. "Denize Yakın", "Yola Cepheli".
alter table public.projects
  add column if not exists features jsonb not null default '[]'::jsonb;
