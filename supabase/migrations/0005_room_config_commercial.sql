-- Allow "dukkan" (shop) and "ofis" (office) as room_config options, alongside apartment layouts (1+1 etc.)
alter table public.projects
  drop constraint if exists projects_room_config_check,
  add constraint projects_room_config_check
    check (room_config in ('studyo', '1+1', '2+1', '3+1', '4+1', '5+1', '6+1-uzeri', 'dukkan', 'ofis'));

alter table public.project_units
  drop constraint if exists project_units_room_config_check,
  add constraint project_units_room_config_check
    check (room_config in ('studyo', '1+1', '2+1', '3+1', '4+1', '5+1', '6+1-uzeri', 'dukkan', 'ofis'));
