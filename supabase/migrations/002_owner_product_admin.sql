-- Khushi's Store owner product manager
-- Run this once in Supabase SQL Editor before using /admin.
-- The owner UUID below is the current store-owner Supabase account.

-- Product reads remain public; only the owner can write.
grant insert, update, delete on table public.products to authenticated;

drop policy if exists "Owner can create products" on public.products;
create policy "Owner can create products"
on public.products for insert
to authenticated
with check ((select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid);

drop policy if exists "Owner can update products" on public.products;
create policy "Owner can update products"
on public.products for update
to authenticated
using ((select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid)
with check ((select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid);

drop policy if exists "Owner can delete products" on public.products;
create policy "Owner can delete products"
on public.products for delete
to authenticated
using ((select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid);

-- The product-images bucket is public for storefront viewing, but writes are owner-only.
drop policy if exists "Owner can view product image objects" on storage.objects;
create policy "Owner can view product image objects"
on storage.objects for select
to authenticated
using (
  bucket_id = 'product-images'
  and (select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid
);

drop policy if exists "Owner can upload product images" on storage.objects;
create policy "Owner can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid
);

drop policy if exists "Owner can update product images" on storage.objects;
create policy "Owner can update product images"
on storage.objects for update
to authenticated
using (
  bucket_id = 'product-images'
  and (select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid
)
with check (
  bucket_id = 'product-images'
  and (select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid
);

drop policy if exists "Owner can delete product images" on storage.objects;
create policy "Owner can delete product images"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'product-images'
  and (select auth.uid()) = 'af03f4ac-5343-4778-b6fa-fe7a8f41c302'::uuid
);
