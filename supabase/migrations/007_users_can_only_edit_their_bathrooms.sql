begin;

drop policy if exists "Signed-in users can edit bathrooms" on public.bathrooms;

create policy "Owners can edit their bathrooms"
on public.bathrooms
for update
to authenticated
using ((select auth.uid()) = created_by)
with check ((select auth.uid()) = created_by);
commit;
