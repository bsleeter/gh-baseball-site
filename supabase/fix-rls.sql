-- Fix RLS policies to allow INSERT for authenticated users
-- The "for all using(...)" policies need "with check(...)" for inserts

drop policy if exists "Auth manage announcements" on announcements;
drop policy if exists "Auth manage games" on games;
drop policy if exists "Auth manage players" on players;
drop policy if exists "Auth manage donations" on donations;
drop policy if exists "Auth manage fundraising" on fundraising;
drop policy if exists "Auth manage calendar_events" on calendar_events;

create policy "Auth manage announcements" on announcements for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth manage games" on games for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth manage players" on players for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth manage donations" on donations for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth manage fundraising" on fundraising for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Auth manage calendar_events" on calendar_events for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
