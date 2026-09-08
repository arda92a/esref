-- Tekil (single-structure) property types: drop commercial/land options, add depo (warehouse) and atolye (workshop).

-- Clear out any existing rows using the removed values, so the new check constraint doesn't fail.
update public.projects set property_type = null where property_type in ('ticari', 'arsa');

alter table public.projects
  drop constraint if exists projects_property_type_check,
  add constraint projects_property_type_check
    check (property_type in ('daire', 'villa', 'mustakil-ev', 'ofis', 'depo', 'atolye'));
