-- AngadiBazar Database Schema
-- Run this in Supabase Dashboard → SQL Editor

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  phone text,
  created_at timestamptz default now()
);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS for profiles
alter table public.profiles enable row level security;

create policy "Anyone can view profiles"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- ============================================
-- 2. LISTINGS TABLE
-- ============================================
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  price numeric not null,
  description text,
  category text,
  location text,
  images text[] default '{}',
  status text default 'active',
  created_at timestamptz default now()
);

-- Index for faster queries
create index idx_listings_status on public.listings(status);
create index idx_listings_user_id on public.listings(user_id);
create index idx_listings_created_at on public.listings(created_at desc);

-- RLS for listings
alter table public.listings enable row level security;

create policy "Anyone can view active listings"
  on public.listings for select
  using (status = 'active');

create policy "Authenticated users can create listings"
  on public.listings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own listings"
  on public.listings for update
  using (auth.uid() = user_id);

create policy "Users can delete own listings"
  on public.listings for delete
  using (auth.uid() = user_id);

-- ============================================
-- 3. STORAGE BUCKET FOR LISTING IMAGES
-- ============================================
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true);

-- Anyone can view images
create policy "Public read access"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Authenticated users can upload images to their own folder
create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
  );

-- Users can delete their own images
create policy "Users can delete own images"
  on storage.objects for delete
  using (
    bucket_id = 'listing-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
