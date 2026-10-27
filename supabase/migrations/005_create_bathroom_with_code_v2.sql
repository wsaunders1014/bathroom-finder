begin;

-- Requires migration 003: bathrooms.address must already allow NULL.
-- Return the saved bathroom and inserted code together in one response.
create or replace function public.create_bathroom_with_code_v2(
  p_name text,
  p_address text,
  p_latitude double precision,
  p_longitude double precision,
  p_access_policy text default 'unknown',
  p_entry_method text default 'unknown',
  p_access_notes text default null,
  p_code text default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_bathroom public.bathrooms;
  normalized_code text := nullif(btrim(p_code), '');
  saved_code public.bathroom_access_codes;
  codes_json jsonb := '[]'::jsonb;
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
    values (saved_bathroom.id, normalized_code)
    returning * into saved_code;

    codes_json := jsonb_build_array(
      jsonb_build_object(
        'id', saved_code.id,
        'code', saved_code.code,
        'created_at', saved_code.created_at
      )
    );
  end if;

  return to_jsonb(saved_bathroom) ||
    jsonb_build_object('bathroom_access_codes', codes_json);
end;
$$;

-- New functions grant execution to PUBLIC by default; keep this RPC server-only.
revoke all on function public.create_bathroom_with_code_v2(
  text, text, double precision, double precision, text, text, text, text
) from public, anon, authenticated;

grant execute on function public.create_bathroom_with_code_v2(
  text, text, double precision, double precision, text, text, text, text
) to service_role;

commit;
