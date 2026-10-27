begin;

-- Record who created each row. Existing rows have no creator, so the column is nullable.
-- The default fills in the caller, so create_bathroom_with_code_v2 needs no changes.
alter table public.bathrooms
  add column created_by uuid default auth.uid() references auth.users (id) on delete set null;

alter table public.bathroom_access_codes
  add column created_by uuid default auth.uid() references auth.users (id) on delete set null;

-- Signed-in users can add bathrooms. Anyone, including visitors, can submit codes.
grant insert on table public.bathrooms to authenticated;
grant insert on table public.bathroom_access_codes to anon, authenticated;

-- Edits are limited to descriptive columns so ownership and timestamps can't be rewritten.
-- updated_at is still maintained by the bathrooms_set_updated_at trigger.
grant update (
  name, address, latitude, longitude, venue_category, access_policy, entry_method, access_notes
) on table public.bathrooms to authenticated;

-- No delete grants or policies: deletes are limited to the dashboard and service_role.

create policy "Signed-in users can add bathrooms as themselves"
on public.bathrooms
for insert
to authenticated
with check ((select auth.uid()) = created_by);

create policy "Signed-in users can edit bathrooms"
on public.bathrooms
for update
to authenticated
using (true)
with check (true);

-- Visitors have no auth.uid(), so their codes must have no creator;
-- signed-in users can only submit codes as themselves.
create policy "Anyone can submit access codes"
on public.bathroom_access_codes
for insert
to anon, authenticated
with check (created_by is not distinct from (select auth.uid()));

-- Invoker permissions keep the grants and policies above in effect inside the RPC.
grant execute on function public.create_bathroom_with_code_v2(
  text, text, double precision, double precision, text, text, text, text
) to authenticated;

commit;
