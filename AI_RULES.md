# AI Rules for Foodigo

This codebase is fully Supabase-backed. Do not introduce local mock or dummy datasets.

## Data and Supabase
- Use `src/lib/supabaseClient.ts` for all Supabase access.
- Centralized reads live in `src/context/DataContext.tsx`.
- Order mutations live in `src/context/OrdersContext.tsx`.
- Auth/profile logic lives in `src/context/AuthContext.tsx`.

## Schema and migrations
- Add schema changes in `supabase/migrations/` (new file per change).
- Keep `supabase/seed.sql` up to date with any new fields or tables.
- Update RLS when adding tables or changing ownership rules.

## RLS expectations
- Public catalog data can be anonymous readable.
- User-owned data should be scoped to `auth.uid()`.
- Admin-only data should be protected by `profiles.role = 'admin'`.

## Working agreements
- Avoid reintroducing `src/data/dummyData.ts` or inline mock arrays.
- When adding new UI features, fetch data via `useData()` or a Supabase query.
- Update `docs/supabase.md` and `docs/api.md` if you change the data model.
