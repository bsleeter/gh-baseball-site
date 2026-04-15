-- Calendar Events table (practices, tryouts, non-game events)
-- Games are already in the games table
create table if not exists calendar_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  all_day boolean default false,
  team text not null check (team in ('varsity', 'jv', 'cteam', 'all')),
  type text not null check (type in ('practice', 'tryout', 'event')),
  location text,
  notes text,
  created_at timestamptz default now()
);

alter table calendar_events enable row level security;
create policy "Public read calendar_events" on calendar_events for select using (true);
create policy "Auth manage calendar_events" on calendar_events for all using (auth.role() = 'authenticated');

-- Seed practice/tryout data
insert into calendar_events (title, start_time, end_time, team, type, location) values
-- Tryouts (shared)
('Tryouts', '2026-03-02T17:00:00-08:00', '2026-03-02T21:00:00-08:00', 'all', 'tryout', 'Upper Turf'),
('Tryouts', '2026-03-03T14:30:00-08:00', '2026-03-03T17:00:00-08:00', 'all', 'tryout', 'Sehmel #1'),
('Tryouts', '2026-03-04T17:00:00-08:00', '2026-03-04T21:00:00-08:00', 'all', 'tryout', 'Upper Turf'),
-- Varsity practices
('V Practice', '2026-03-05T14:30:00-08:00', '2026-03-05T17:00:00-08:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-03-06T17:00:00-08:00', '2026-03-06T21:00:00-08:00', 'varsity', 'practice', 'Upper Turf'),
('V Practice', '2026-03-09T14:30:00-08:00', '2026-03-09T17:00:00-08:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-03-10T18:30:00-08:00', '2026-03-10T21:00:00-08:00', 'varsity', 'practice', 'Upper Turf'),
('V Practice', '2026-03-12T14:30:00-08:00', '2026-03-12T17:00:00-08:00', 'varsity', 'practice', 'Sehmel #2'),
('V Practice', '2026-03-13T14:30:00-08:00', '2026-03-13T17:00:00-08:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-03-19T14:30:00-08:00', '2026-03-19T17:00:00-08:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-03-23T14:30:00-07:00', '2026-03-23T17:00:00-07:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-03-26T18:30:00-07:00', '2026-03-26T21:00:00-07:00', 'varsity', 'practice', 'Upper Turf'),
('V Practice', '2026-03-27T14:30:00-07:00', '2026-03-27T17:00:00-07:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-03-30T19:00:00-07:00', '2026-03-30T21:00:00-07:00', 'varsity', 'practice', 'Upper Turf'),
('V Practice', '2026-04-02T14:30:00-07:00', '2026-04-02T17:00:00-07:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-04-03T18:30:00-07:00', '2026-04-03T21:00:00-07:00', 'varsity', 'practice', 'Upper Turf'),
('V Practice', '2026-04-08T14:30:00-07:00', '2026-04-08T17:00:00-07:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-04-09T14:30:00-07:00', '2026-04-09T18:30:00-07:00', 'varsity', 'practice', 'GHHS'),
('V Practice', '2026-04-10T14:30:00-07:00', '2026-04-10T18:30:00-07:00', 'varsity', 'practice', 'GHHS'),
('V Practice', '2026-04-15T18:30:00-07:00', '2026-04-15T21:00:00-07:00', 'varsity', 'practice', 'Upper Turf'),
('V Practice', '2026-04-16T14:30:00-07:00', '2026-04-16T17:00:00-07:00', 'varsity', 'practice', 'Sehmel #1'),
('V Practice', '2026-04-17T18:30:00-07:00', '2026-04-17T21:00:00-07:00', 'varsity', 'practice', 'Upper Turf'),
('V Practice', '2026-04-20T14:30:00-07:00', '2026-04-20T17:00:00-07:00', 'varsity', 'practice', 'Sehmel #1'),
-- JV practices
('JV Practice', '2026-03-05T17:00:00-08:00', '2026-03-05T21:00:00-08:00', 'jv', 'practice', 'Upper Turf'),
('JV Practice', '2026-03-06T14:30:00-08:00', '2026-03-06T18:30:00-08:00', 'jv', 'practice', 'GHHS'),
('JV Practice', '2026-03-09T19:00:00-08:00', '2026-03-09T21:00:00-08:00', 'jv', 'practice', 'Upper Turf'),
('JV Practice', '2026-03-10T14:30:00-08:00', '2026-03-10T17:00:00-08:00', 'jv', 'practice', 'Sehmel #2'),
-- C Team practices
('C Practice', '2026-03-05T17:00:00-08:00', '2026-03-05T21:00:00-08:00', 'cteam', 'practice', 'Upper Turf'),
('C Practice', '2026-03-06T14:30:00-08:00', '2026-03-06T18:30:00-08:00', 'cteam', 'practice', 'GHHS');
