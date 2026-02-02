# Foodigo

Full-stack food delivery app powered by Supabase (Postgres, Auth, Storage) with a React + TypeScript + Vite frontend.

## Quick start

1. Install dependencies
   - `npm install`
2. Configure env vars (already provided in `.env`)
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Start the app
   - `npm run dev`

## Supabase setup

This repo is linked to a remote Supabase project. Migrations and seed data live in `supabase/migrations/`.

Common commands (run from the repo root):
- Link project: `npx supabase link --project-ref <ref>`
- Push migrations: `npx supabase db push --yes`

### Seed data

Initial seed data is baked into the migration `supabase/migrations/20260202034000_seed_data.sql`.
The same SQL is mirrored in `supabase/seed.sql` for reference and local workflows.

Seeded tables:
- `categories`
- `restaurants`
- `menu_items`
- `offers`

### Storage buckets

Buckets are created in migrations and used by the frontend:
- `restaurants`
- `menu-items`
- `avatars`

The placeholder image is stored at:
- `restaurants/placeholders/default.svg`
- `menu-items/placeholders/default.svg`

## Architecture notes

- All dummy data was removed. The frontend fetches from Supabase directly.
- Auth uses Supabase Auth with `profiles.role` for role-based access.
- RLS policies are defined in `supabase/migrations/20260202033000_init_schema.sql`.
- Image URLs are resolved via `src/lib/supabaseClient.ts`.
