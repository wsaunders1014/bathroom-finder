begin;

-- Requires migration 003: bathrooms.address must already allow NULL.
-- Replacing the existing function preserves its signature and permissions.
create or replace function public.create_bathroom_with_code(
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
    btrim(p_name), nullif(btrim(p_address), ''), p_latitude, p_longitude,
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

commit;
