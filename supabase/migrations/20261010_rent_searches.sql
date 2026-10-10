-- Run in the existing shared project after review. No existing tables are changed.
-- The resident app uses only the anon key and the signed-in renter's JWT.
begin;
create table if not exists public.rent_searches (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferences jsonb not null check (jsonb_typeof(preferences) = 'object' and octet_length(preferences::text) <= 10000),
  status text not null default 'active' check (status in ('active','paused','closed')),
  source text not null default 'direct' check (length(source) <= 200),
  confirmed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.rent_searches enable row level security;
revoke all on public.rent_searches from anon, authenticated;
grant select, insert, update on public.rent_searches to authenticated;
create policy "renters read own search" on public.rent_searches for select to authenticated using ((select auth.uid()) = user_id);
create policy "renters create own search" on public.rent_searches for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "renters update own search" on public.rent_searches for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Operator-only audit queue. The public app has no permission to read or send it.
create table if not exists public.rent_match_reviews (
  id uuid primary key default gen_random_uuid(),
  search_user_id uuid not null references public.rent_searches(user_id) on delete cascade,
  property_id uuid not null,
  reviewed_by text not null,
  reviewed_at timestamptz not null default now(),
  decision text not null check (decision in ('approved','rejected')),
  rationale text not null,
  unique(search_user_id, property_id)
);
alter table public.rent_match_reviews enable row level security;
revoke all on public.rent_match_reviews from anon, authenticated;
create table if not exists public.rent_delivery_log (
  id uuid primary key default gen_random_uuid(),
  search_user_id uuid not null references public.rent_searches(user_id) on delete cascade,
  property_id uuid not null,
  review_id uuid not null references public.rent_match_reviews(id),
  sent_at timestamptz,
  provider_id text,
  status text not null check (status in ('pending','sent','failed','cancelled')),
  unique(search_user_id, property_id)
);
alter table public.rent_delivery_log enable row level security;
revoke all on public.rent_delivery_log from anon, authenticated;
commit;
