# Supabase Guide

This project uses Supabase for Auth, Database, and RLS. All previous UI mock data has been migrated to seeded tables.

## Project config
- Supabase URL and anon key live in `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Supabase CLI is invoked via `npx supabase` in this repo.

## Local workflow
1) Link the project:
```
npx supabase link --project-ref jmiydxzpyrwfkgxphfdf
```

2) Push schema and seed data:
```
npx supabase db push
npx supabase db seed
```

## Schema overview
Core entities:
- `profiles` (auth-linked user profile + role)
- `categories`, `restaurants`, `menu_items`, `offers`
- `orders`, `order_items`
- `scheduled_orders`, `scheduled_order_items`
- `group_orders`, `group_order_participants`, `group_order_participant_items`
- `subscriptions`, `loyalty_rewards`, `loyalty_activity`

Experience and ops:
- `recommendation_seeds`, `recommendation_seed_restaurants`
- `smart_collections`, `smart_collection_items`
- `payment_methods`, `payment_providers`
- `push_event_templates`
- `restaurant_*` analytics tables
- `driver_*` stats tables
- `admin_*` insights + analytics + financial tables
- `support_tickets`, `experiments`, `fraud_alerts`, `city_operations`

## RLS notes
- Public catalog tables (restaurants, categories, menu_items, offers) are readable by all.
- User-owned data (orders, scheduled/group orders, subscriptions, loyalty) is restricted to the owning user.
- Admin data (`admin_*`, fraud, experiments, support tickets, city ops) is restricted to admin role.
- Restaurant analytics are visible to restaurant owners or admins.
- Driver stats are visible to the driver or admin.

Roles are stored in `profiles.role`. Admin checks use the `public.is_admin()` SQL helper.

## Seeds
Seed data lives in `supabase/seed.sql`. It creates:
- Auth users (customer, restaurant, driver, admin)
- Matching `profiles` rows
- All catalog, orders, analytics, and ops data used by the UI

## Data access
Client data access is centralized in `src/context/DataContext.tsx` using the Supabase client from `src/lib/supabaseClient.ts`.
If you add or change schema:
1) Create a new migration in `supabase/migrations/`.
2) Update `supabase/seed.sql`.
3) Update `DataContext` mappings and consuming pages/components.
