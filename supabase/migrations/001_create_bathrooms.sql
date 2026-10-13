begin;

create table public.bathrooms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 200),
  address text not null check (char_length(btrim(address)) between 1 and 500),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  venue_category text not null default 'unknown'
    check (venue_category in ('cafe', 'restaurant', 'store', 'park', 'transit_station', 'other', 'unknown')),
  access_policy text not null default 'unknown'
    check (access_policy in ('public', 'customers_only', 'permission_required', 'unknown')),
  entry_method text not null default 'unknown'
    check (entry_method in ('open', 'code', 'key', 'ask_staff', 'unknown')),
  access_notes text check (char_length(access_notes) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Maintain updated_at whenever a row is edited; a default only covers inserts.
create function public.set_bathroom_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger bathrooms_set_updated_at
before update on public.bathrooms
for each row execute function public.set_bathroom_updated_at();

alter table public.bathrooms enable row level security;

-- Visitors can read locations. Client writes are not enabled in this migration.
revoke all on table public.bathrooms from anon, authenticated;
grant select on table public.bathrooms to anon, authenticated;
grant select, insert, update, delete on table public.bathrooms to service_role;

create policy "Bathroom locations are publicly readable"
on public.bathrooms
for select
to anon, authenticated
using (true);

commit;
