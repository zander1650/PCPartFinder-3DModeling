-- PCForge schema. Run this in the Supabase SQL editor (Dashboard → SQL Editor),
-- then seed the catalog with: node --env-file=.env.local scripts/seed.mjs

create table public.parts (
  id text primary key,
  category text not null check (
    category in ('cpu', 'cooler', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case')
  ),
  name text not null,
  brand text not null,
  price numeric not null,
  tier int not null default 1,
  specs jsonb not null default '{}'
);

-- Live retailer prices layered on top of the catalog (Best Buy / eBay APIs).
create table public.retailer_prices (
  id bigint generated always as identity primary key,
  part_id text not null references public.parts (id) on delete cascade,
  retailer text not null,
  price numeric not null,
  url text,
  in_stock boolean default true,
  fetched_at timestamptz not null default now()
);

-- Saved user builds (requires Supabase Auth).
create table public.builds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'My Build',
  parts jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.parts enable row level security;
alter table public.retailer_prices enable row level security;
alter table public.builds enable row level security;

create policy "parts are readable by everyone"
  on public.parts for select using (true);

create policy "prices are readable by everyone"
  on public.retailer_prices for select using (true);

create policy "users manage their own builds"
  on public.builds for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
