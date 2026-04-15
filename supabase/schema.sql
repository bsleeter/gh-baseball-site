-- ============================================================
-- GH Baseball Database Schema
-- Run this in Supabase SQL Editor (supabase.com > SQL Editor)
-- ============================================================

-- 1. ANNOUNCEMENTS
create table if not exists announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  message text not null,
  urgency text not null default 'info' check (urgency in ('info', 'warning', 'urgent')),
  active boolean not null default true,
  created_at timestamptz default now()
);

-- 2. GAMES
create table if not exists games (
  id text primary key,
  team text not null check (team in ('varsity', 'jv', 'cteam')),
  date date not null,
  time text not null,
  opponent text not null,
  location text not null check (location in ('home', 'away', 'neutral')),
  venue text not null,
  type text not null default 'game',
  score_us integer,
  score_them integer,
  result text check (result in ('W', 'L', 'T')),
  notes text,
  highlights text,
  created_at timestamptz default now()
);

-- 3. PLAYERS
create table if not exists players (
  id text primary key,
  team text not null check (team in ('varsity', 'jv', 'cteam')),
  first_name text not null,
  last_name text not null,
  number integer not null,
  positions text[] not null default '{}',
  grad_year integer not null,
  height text,
  weight integer,
  bats text check (bats in ('R', 'L', 'S')),
  throws text check (throws in ('R', 'L')),
  college_commitment text,
  created_at timestamptz default now()
);

-- 4. DONATIONS (for tracking, not processing)
create table if not exists donations (
  id uuid default gen_random_uuid() primary key,
  amount numeric(10,2) not null,
  donor_name text,
  message text,
  created_at timestamptz default now()
);

-- 5. FUNDRAISING CONFIG (single row for goal/raised)
create table if not exists fundraising (
  id integer primary key default 1 check (id = 1),
  goal numeric(10,2) not null default 50000,
  raised numeric(10,2) not null default 14750
);
insert into fundraising (goal, raised) values (50000, 14750) on conflict do nothing;

-- ============================================================
-- Row Level Security (RLS)
-- Public read, authenticated write
-- ============================================================

alter table announcements enable row level security;
alter table games enable row level security;
alter table players enable row level security;
alter table donations enable row level security;
alter table fundraising enable row level security;

-- Public can read everything
create policy "Public read announcements" on announcements for select using (true);
create policy "Public read games" on games for select using (true);
create policy "Public read players" on players for select using (true);
create policy "Public read fundraising" on fundraising for select using (true);

-- Authenticated users can do everything
create policy "Auth manage announcements" on announcements for all using (auth.role() = 'authenticated');
create policy "Auth manage games" on games for all using (auth.role() = 'authenticated');
create policy "Auth manage players" on players for all using (auth.role() = 'authenticated');
create policy "Auth manage donations" on donations for all using (auth.role() = 'authenticated');
create policy "Auth manage fundraising" on fundraising for all using (auth.role() = 'authenticated');
