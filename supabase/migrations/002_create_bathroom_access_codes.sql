begin;

create table public.bathroom_access_codes (
  id uuid primary key default gen_random_uuid(),
  bathroom_id uuid not null references public.bathrooms(id) on delete cascade,
  code text not null check (char_length(btrim(code)) between 1 and 100),
  created_at timestamptz not null default now(),
  unique (bathroom_id, code)
);

-- The unique constraint also indexes bathroom_id for per-bathroom lookups.
-- Codes start unverified; confirmations will be stored separately later.
alter table public.bathroom_access_codes enable row level security;
revoke all on table public.bathroom_access_codes from anon, authenticated;
grant select on table public.bathroom_access_codes to anon, authenticated;
grant select, insert, update, delete on table public.bathroom_access_codes to service_role;

create policy "Bathroom access codes are publicly readable"
on public.bathroom_access_codes
for select
to anon, authenticated
using (true);

-- One RPC request inserts both records atomically and returns the saved bathroom.
-- Invoker permissions preserve the caller's grants and RLS behavior.
create function public.create_bathroom_with_code(
  p_name text,
  p_address text,
  p_latitude double precision,
  p_longitude double precision,
  p_access_policy text default 'unknown',
  p_entry_method text default 'unknown',
  p_access_notes text default null,
  p_code text default null
)
returns public.bathrooms
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_bathroom public.bathrooms;
  normalized_code text := nullif(btrim(p_code), '');
begin
  if p_entry_method = 'code' then
    if normalized_code is null then
      raise exception 'A door code is required for code entry.' using errcode = '22023';
    end if;
  elsif normalized_code is not null then
    raise exception 'A door code is only allowed for code entry.' using errcode = '22023';
  end if;

  insert into public.bathrooms (
    name, address, latitude, longitude, access_policy, entry_method, access_notes
  ) values (
    btrim(p_name), btrim(p_address), p_latitude, p_longitude,
    p_access_policy, p_entry_method, nullif(btrim(p_access_notes), '')
  )
  returning * into saved_bathroom;

  if normalized_code is not null then
    insert into public.bathroom_access_codes (bathroom_id, code)
    values (saved_bathroom.id, normalized_code);
  end if;

  return saved_bathroom;
end;
$$;

-- PostgreSQL grants function execution to PUBLIC by default; restrict this RPC
-- to the privileged server client used by our validated save action.
revoke all on function public.create_bathroom_with_code(
  text, text, double precision, double precision, text, text, text, text
) from public, anon, authenticated;
grant execute on function public.create_bathroom_with_code(
  text, text, double precision, double precision, text, text, text, text
) to service_role;

commit;
