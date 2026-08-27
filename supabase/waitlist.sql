-- Run this in the Supabase SQL editor to set up the waitlist table.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Row Level Security: locked down by default.
alter table public.waitlist enable row level security;

-- Allow anyone (anon key) to insert their own row, but not read, update,
-- or delete anything. This is the only permission the public site needs.
create policy "Allow public insert to waitlist"
  on public.waitlist
  for insert
  to anon
  with check (true);
