-- Alley Properties — database setup
-- Paste this whole file into Supabase Dashboard -> SQL Editor -> Run.

-- ========== TABLES ==========
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  tagline text,
  kind text not null default 'property' check (kind in ('property','furnishing')),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  price bigint not null default 0,
  price_suffix text,
  location text,
  status text not null default 'available' check (status in ('available','sold')),
  featured boolean not null default false,
  description text,
  specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists listings_category_idx on public.listings(category_id);

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url text not null,
  storage_path text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists listing_images_listing_idx on public.listing_images(listing_id);

-- Admins are kept in their own table
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ========== GRANTS ==========
grant select on public.categories, public.listings, public.listing_images to anon, authenticated;
grant insert, update, delete on public.categories, public.listings, public.listing_images to authenticated;
grant select on public.admins to authenticated;
grant all on public.categories, public.listings, public.listing_images, public.admins to service_role;

-- ========== HELPERS ==========
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists listings_touch on public.listings;
create trigger listings_touch before update on public.listings
for each row execute function public.touch_updated_at();

-- ========== ROW LEVEL SECURITY ==========
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.admins enable row level security;

drop policy if exists "public read categories" on public.categories;
create policy "public read categories" on public.categories for select using (true);
drop policy if exists "admin write categories" on public.categories;
create policy "admin write categories" on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read listings" on public.listings;
create policy "public read listings" on public.listings for select using (true);
drop policy if exists "admin write listings" on public.listings;
create policy "admin write listings" on public.listings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read images" on public.listing_images;
create policy "public read images" on public.listing_images for select using (true);
drop policy if exists "admin write images" on public.listing_images;
create policy "admin write images" on public.listing_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select to authenticated
  using (user_id = auth.uid());

-- ========== STORAGE ==========
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

drop policy if exists "public read listing images" on storage.objects;
create policy "public read listing images" on storage.objects for select
  using (bucket_id = 'listing-images');
drop policy if exists "admin upload listing images" on storage.objects;
create policy "admin upload listing images" on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-images' and public.is_admin());
drop policy if exists "admin delete listing images" on storage.objects;
create policy "admin delete listing images" on storage.objects for delete to authenticated
  using (bucket_id = 'listing-images' and public.is_admin());

-- ========== SAMPLE DATA ==========
insert into public.categories (slug, name, tagline, kind, sort_order) values
  ('houses', 'Houses for Sale', 'Detached homes, terraces and duplexes ready for new owners.', 'property', 1),
  ('serviced-apartments', 'Serviced Apartments', 'Fully serviced short and long stays, move-in ready.', 'property', 2),
  ('furnishings', 'Furnishings', 'Statement furniture and décor for every room.', 'furnishing', 3)
on conflict (slug) do nothing;

with c as (select id, slug from public.categories)
insert into public.listings (slug, title, category_id, price, price_suffix, location, status, featured, description, specs) values
  ('5-bed-detached-duplex-lekki', '5-Bedroom Detached Duplex', (select id from c where slug='houses'), 285000000, null, 'Lekki Phase 1, Lagos', 'available', true,
   'A spacious contemporary duplex with a private garden, boys'' quarters, fitted kitchen and 24/7 estate security.', '{"bedrooms":5,"bathrooms":6,"area":"650 sqm","title":"C of O"}'),
  ('4-bed-terrace-ikoyi', '4-Bedroom Terrace with Pool', (select id from c where slug='houses'), 410000000, null, 'Ikoyi, Lagos', 'available', true,
   'Elegant terrace in a gated Ikoyi enclave with shared pool, gym and backup power.', '{"bedrooms":4,"bathrooms":5,"area":"480 sqm","title":"Governor''s Consent"}'),
  ('3-bed-bungalow-gwarinpa', '3-Bedroom Bungalow', (select id from c where slug='houses'), 95000000, null, 'Gwarinpa, Abuja', 'sold', false,
   'Well-finished family bungalow on a corner plot, close to schools and shops.', '{"bedrooms":3,"bathrooms":3,"area":"600 sqm plot","title":"R of O"}'),
  ('6-bed-mansion-maitama', '6-Bedroom Mansion', (select id from c where slug='houses'), 950000000, null, 'Maitama, Abuja', 'available', false,
   'Grand residence with cinema room, elevator, pool and landscaped gardens.', '{"bedrooms":6,"bathrooms":8,"area":"1,200 sqm","title":"C of O"}'),

  ('2-bed-serviced-vi', '2-Bedroom Serviced Apartment', (select id from c where slug='serviced-apartments'), 180000, '/ night', 'Victoria Island, Lagos', 'available', true,
   'Ocean-view apartment with housekeeping, high-speed Wi-Fi, 24/7 power and concierge.', '{"bedrooms":2,"bathrooms":2,"area":"140 sqm","stay":"Short & long stay"}'),
  ('studio-ikeja-gra', 'Executive Studio', (select id from c where slug='serviced-apartments'), 65000, '/ night', 'Ikeja GRA, Lagos', 'available', false,
   'Compact, stylish studio minutes from the airport — ideal for business travellers.', '{"bedrooms":1,"bathrooms":1,"area":"55 sqm","stay":"Short stay"}'),
  ('3-bed-serviced-wuse', '3-Bedroom Penthouse', (select id from c where slug='serviced-apartments'), 12000000, '/ year', 'Wuse 2, Abuja', 'available', true,
   'Penthouse with rooftop terrace, gym access, cleaning service and dedicated parking.', '{"bedrooms":3,"bathrooms":4,"area":"260 sqm","stay":"Long stay"}'),
  ('1-bed-serviced-lekki', '1-Bedroom Serviced Apartment', (select id from c where slug='serviced-apartments'), 85000, '/ night', 'Lekki, Lagos', 'sold', false,
   'Bright one-bedroom with smart TV, fully equipped kitchen and pool access.', '{"bedrooms":1,"bathrooms":1,"area":"75 sqm","stay":"Short & long stay"}'),

  ('velvet-3-seater-sofa', 'Velvet 3-Seater Sofa', (select id from c where slug='furnishings'), 850000, null, 'Showroom, Lekki', 'available', true,
   'Deep-seat sofa in emerald velvet with solid hardwood frame and brass legs.', '{"material":"Velvet, hardwood","dimensions":"220 × 95 × 85 cm","color":"Emerald"}'),
  ('oak-dining-set-6', 'Oak Dining Set (6 seats)', (select id from c where slug='furnishings'), 1450000, null, 'Showroom, Lekki', 'available', false,
   'Solid oak dining table with six upholstered chairs — built to last generations.', '{"material":"Solid oak, linen","dimensions":"200 × 100 cm table","color":"Natural oak"}'),
  ('accent-lounge-chair', 'Accent Lounge Chair', (select id from c where slug='furnishings'), 320000, null, 'Showroom, Abuja', 'available', true,
   'Sculptural lounge chair in bouclé with a walnut base. Perfect reading corner piece.', '{"material":"Bouclé, walnut","dimensions":"75 × 80 × 78 cm","color":"Ivory"}'),
  ('king-upholstered-bed', 'King Upholstered Bed', (select id from c where slug='furnishings'), 980000, null, 'Showroom, Lekki', 'sold', false,
   'Tall channel-tufted headboard bed frame with slatted base. Mattress not included.', '{"material":"Linen, pine","dimensions":"6 × 6 ft","color":"Sand"}')
on conflict (slug) do nothing;

insert into public.listing_images (listing_id, url, sort_order)
select l.id, 'https://images.unsplash.com/photo-' || v.photo || '?w=1400&q=80', v.ord
from (values
  ('5-bed-detached-duplex-lekki','1600596542815-ffad4c1539a9',0),
  ('5-bed-detached-duplex-lekki','1600210492486-724fe5c67fb0',1),
  ('4-bed-terrace-ikoyi','1600585154340-be6161a56a0c',0),
  ('3-bed-bungalow-gwarinpa','1512917774080-9991f1c4c750',0),
  ('6-bed-mansion-maitama','1613490493576-7fde63acd811',0),
  ('2-bed-serviced-vi','1502672260266-1c1ef2d93688',0),
  ('studio-ikeja-gra','1522708323590-d24dbb6b0267',0),
  ('3-bed-serviced-wuse','1560448204-e02f11c3d0e2',0),
  ('1-bed-serviced-lekki','1493809842364-78817add7ffb',0),
  ('velvet-3-seater-sofa','1555041469-a586c61ea9bc',0),
  ('oak-dining-set-6','1538688525198-9b88f6f53126',0),
  ('accent-lounge-chair','1567538096630-e0c55bd6374c',0),
  ('king-upholstered-bed','1586023492125-27b2c045efd7',0)
) as v(slug, photo, ord)
join public.listings l on l.slug = v.slug
where not exists (select 1 from public.listing_images i where i.listing_id = l.id and i.sort_order = v.ord);
