-- Khushi's Store customer platform
-- Supabase Auth owns passwords/sessions. Public tables store only store data.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
grant select, insert, update on public.profiles to authenticated;

create policy "Customers can read own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "Customers can create own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = id);

create policy "Customers can update own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists addresses_one_default_per_user
  on public.addresses(user_id)
  where is_default = true;

alter table public.addresses enable row level security;
grant select, insert, update, delete on public.addresses to authenticated;

create policy "Customers can read own addresses"
on public.addresses for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can create own addresses"
on public.addresses for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Customers can update own addresses"
on public.addresses for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Customers can delete own addresses"
on public.addresses for delete
to authenticated
using ((select auth.uid()) = user_id);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('kurta', 'saree', 'other')),
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2),
  description text not null default '',
  details text[] not null default '{}',
  fabric text,
  color text,
  sizes text[] not null default '{}',
  images text[] not null default '{}',
  in_stock boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
grant select on public.products to anon, authenticated;

create policy "Products are publicly readable"
on public.products for select
to anon, authenticated
using (true);

insert into public.products
  (title, slug, category, price, compare_at_price, description, details, fabric, color, sizes, images, in_stock, featured)
values
  ('Marigold Cotton Kurta', 'marigold-cotton-kurta', 'kurta', 1499, 1999,
   'A breezy hand-block cotton kurta in warm marigold, cut for easy all-day comfort.',
   array['Hand-block printed pure cotton','Relaxed straight fit with side slits','Three-quarter sleeves'],
   '100% Cotton', 'Marigold', array['S','M','L','XL'], array['/samples/marigold-kurta.svg'], true, true),
  ('Ivory Chikankari Kurta', 'ivory-chikankari-kurta', 'kurta', 2299, null,
   'Delicate Lucknowi chikankari embroidery on soft ivory — an heirloom-worthy everyday piece.',
   array['Hand-embroidered chikankari','Soft cotton-blend fabric','Round neck with button placket'],
   'Cotton Blend', 'Ivory', array['S','M','L','XL'], array['/samples/ivory-kurta.svg'], true, true),
  ('Rosewood Silk Saree', 'rosewood-silk-saree', 'saree', 4999, 6499,
   'A lustrous rosewood silk saree with a woven zari border — made for celebrations.',
   array['Art silk with zari border','Includes unstitched blouse piece','Length: 5.5m + 0.8m blouse'],
   'Art Silk', 'Rosewood', array['Free Size'], array['/samples/rosewood-saree.svg'], true, true),
  ('Indigo Handloom Saree', 'indigo-handloom-saree', 'saree', 3799, null,
   'Earthy indigo handloom cotton with a contrast pallu — light, breathable, and effortless.',
   array['Handloom cotton','Natural indigo dye','Includes matching blouse piece'],
   'Handloom Cotton', 'Indigo', array['Free Size'], array['/samples/indigo-saree.svg'], true, false),
  ('Sage Green Anarkali Kurta', 'sage-green-anarkali-kurta', 'kurta', 2799, null,
   'A flowing sage-green anarkali with subtle thread work — graceful movement in every step.',
   array['Georgette with inner lining','Floor-length flared silhouette','Concealed side zip'],
   'Georgette', 'Sage Green', array['S','M','L','XL'], array['/samples/sage-anarkali.svg'], true, false),
  ('Coral Bandhani Saree', 'coral-bandhani-saree', 'saree', 3299, null,
   'Traditional coral bandhani tie-dye on soft chiffon — bright, festive, and feather-light.',
   array['Chiffon with bandhani print','Includes blouse piece','Dry clean recommended'],
   'Chiffon', 'Coral', array['Free Size'], array['/samples/coral-saree.svg'], false, false)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;
