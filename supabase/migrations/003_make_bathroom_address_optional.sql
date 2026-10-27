begin;

alter table public.bathrooms
  alter column address drop not null;

commit;