-- Constance tracker: database schema for Supabase (PostgreSQL).
-- Paste this whole file into Supabase → SQL Editor → Run. Safe to re-run.
-- Every table has row-level security: a user only sees the family they belong to.

-- ---------- Tables ----------
create table if not exists public.family (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Family',
  created_at timestamptz not null default now()
);

create table if not exists public.member (
  family_id uuid not null references public.family on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  role text not null check (role in ('owner', 'editor', 'viewer')),
  primary key (family_id, user_id)
);

create table if not exists public.invitation (
  family_id uuid not null references public.family on delete cascade,
  email text not null,
  role text not null check (role in ('editor', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (family_id, email)
);

create table if not exists public.child (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.family on delete cascade,
  first_name text not null,
  birth_date date not null,
  gestational_weeks int,
  home_languages text[] not null default '{}',
  seed_version int not null default 1
);
alter table public.child add column if not exists seed_version int not null default 1;

create table if not exists public.observation (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child on delete cascade,
  skill_id text not null,
  status text not null check (status in ('not_yet', 'emerging', 'achieved', 'lost')),
  observed_on date not null,
  languages text[],
  note text,
  approximate boolean not null default false,
  catalog_version text,
  logged_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists observation_child on public.observation (child_id);

create table if not exists public.journal_entry (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child on delete cascade,
  date date not null,
  text text not null default '',
  photo_path text,
  skill_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.share_link (
  token text primary key default replace(gen_random_uuid()::text, '-', ''),
  child_id uuid not null references public.child on delete cascade,
  expires_at timestamptz not null,
  revoked boolean not null default false,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

-- ---------- Helpers (security definer: run with owner rights, used inside policies) ----------
create or replace function public.is_member(fid uuid, roles text[] default array['owner','editor','viewer'])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from member where family_id = fid and user_id = auth.uid() and role = any(roles));
$$;

create or replace function public.child_family(cid uuid)
returns uuid language sql stable security definer set search_path = public as $$
  select family_id from child where id = cid;
$$;

-- ---------- Row-level security ----------
alter table public.family enable row level security;
alter table public.member enable row level security;
alter table public.invitation enable row level security;
alter table public.child enable row level security;
alter table public.observation enable row level security;
alter table public.journal_entry enable row level security;
alter table public.share_link enable row level security;

drop policy if exists family_read on public.family;
create policy family_read on public.family for select using (is_member(id));
drop policy if exists family_update on public.family;
create policy family_update on public.family for update using (is_member(id, array['owner']));

drop policy if exists member_read on public.member;
create policy member_read on public.member for select using (is_member(family_id));
drop policy if exists member_owner on public.member;
create policy member_owner on public.member for all using (is_member(family_id, array['owner']))
  with check (is_member(family_id, array['owner']));

drop policy if exists invitation_owner on public.invitation;
create policy invitation_owner on public.invitation for all using (is_member(family_id, array['owner']))
  with check (is_member(family_id, array['owner']));

drop policy if exists child_read on public.child;
create policy child_read on public.child for select using (is_member(family_id));
drop policy if exists child_write on public.child;
create policy child_write on public.child for all using (is_member(family_id, array['owner','editor']))
  with check (is_member(family_id, array['owner','editor']));

drop policy if exists observation_read on public.observation;
create policy observation_read on public.observation for select using (is_member(child_family(child_id)));
drop policy if exists observation_write on public.observation;
create policy observation_write on public.observation for all
  using (is_member(child_family(child_id), array['owner','editor']))
  with check (is_member(child_family(child_id), array['owner','editor']));

drop policy if exists journal_read on public.journal_entry;
create policy journal_read on public.journal_entry for select using (is_member(child_family(child_id)));
drop policy if exists journal_write on public.journal_entry;
create policy journal_write on public.journal_entry for all
  using (is_member(child_family(child_id), array['owner','editor']))
  with check (is_member(child_family(child_id), array['owner','editor']));

drop policy if exists share_rw on public.share_link;
create policy share_rw on public.share_link for all
  using (is_member(child_family(child_id), array['owner','editor']))
  with check (is_member(child_family(child_id), array['owner','editor']));

-- ---------- RPC: first login ----------
-- Accepts pending invitations for the user's email; if the user still has no family,
-- creates one with the user as owner. Returns the family id.
create or replace function public.bootstrap()
returns uuid language plpgsql security definer set search_path = public as $$
declare fid uuid;
begin
  insert into member (family_id, user_id, role)
    select i.family_id, auth.uid(), i.role from invitation i
    where lower(i.email) = lower(auth.jwt() ->> 'email')
    on conflict do nothing;
  delete from invitation where lower(email) = lower(auth.jwt() ->> 'email');
  select family_id into fid from member where user_id = auth.uid()
    order by case role when 'owner' then 0 when 'editor' then 1 else 2 end limit 1;
  if fid is null then
    insert into family default values returning id into fid;
    insert into member (family_id, user_id, role) values (fid, auth.uid(), 'owner');
  end if;
  return fid;
end $$;

-- ---------- RPC: read-only share link (callable without login) ----------
create or replace function public.get_shared(p_token text)
returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'child', json_build_object('firstName', c.first_name, 'birthDate', c.birth_date,
                               'homeLanguages', c.home_languages, 'gestationalWeeks', c.gestational_weeks),
    'observations', coalesce((select json_agg(json_build_object(
        'id', o.id, 'skillId', o.skill_id, 'status', o.status, 'observedOn', o.observed_on,
        'approximate', o.approximate, 'createdAt', o.created_at)) from observation o where o.child_id = c.id), '[]'::json))
  from share_link s join child c on c.id = s.child_id
  where s.token = p_token and not s.revoked and s.expires_at > now();
$$;
grant execute on function public.get_shared(text) to anon;

-- ---------- Photos (private storage bucket, one folder per family) ----------
insert into storage.buckets (id, name, public) values ('photos', 'photos', false) on conflict do nothing;
drop policy if exists photos_read on storage.objects;
create policy photos_read on storage.objects for select
  using (bucket_id = 'photos' and public.is_member(((storage.foldername(name))[1])::uuid));
drop policy if exists photos_write on storage.objects;
create policy photos_write on storage.objects for insert
  with check (bucket_id = 'photos' and public.is_member(((storage.foldername(name))[1])::uuid, array['owner','editor']));
drop policy if exists photos_delete on storage.objects;
create policy photos_delete on storage.objects for delete
  using (bucket_id = 'photos' and public.is_member(((storage.foldername(name))[1])::uuid, array['owner','editor']));
