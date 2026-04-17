-- Photos metadata table
create table if not exists photos (
  id uuid default gen_random_uuid() primary key,
  filename text not null,
  caption text,
  category text not null check (category in ('game', 'practice', 'team', 'dinner', 'other')),
  team text check (team in ('varsity', 'jv', 'cteam', 'all')),
  date date,
  storage_path text not null,
  created_at timestamptz default now()
);

alter table photos enable row level security;
create policy "Public read photos" on photos for select using (true);
create policy "Auth manage photos" on photos for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Create storage bucket for photos
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict do nothing;

-- Storage policies: public read, authenticated upload/delete
create policy "Public read photo files" on storage.objects for select using (bucket_id = 'photos');
create policy "Auth upload photo files" on storage.objects for insert with check (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "Auth delete photo files" on storage.objects for delete using (bucket_id = 'photos' and auth.role() = 'authenticated');
