# API and Data Access

This app is client-only and uses Supabase directly from the browser.

## Supabase client
- Location: `src/lib/supabaseClient.ts`
- Environment: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Contexts

### `useAuth()`
Source: `src/context/AuthContext.tsx`
- Handles sign up/sign in/out.
- Loads profile data from `profiles`.
- `updateProfile()` updates both auth metadata and `profiles`.

### `useData()`
Source: `src/context/DataContext.tsx`
- Centralized read access for all seeded tables.
- Provides: catalog, orders, recommendations, analytics, admin/ops data, inventory, support tickets, etc.
- `refresh()` refetches all datasets.

### `useOrders()`
Source: `src/context/OrdersContext.tsx`
- Mutations for scheduled and group orders (creates rows and related items).
- Uses Supabase tables: `scheduled_orders`, `scheduled_order_items`, `group_orders`, `group_order_participants`, `group_order_participant_items`.

## Adding a new dataset
1) Add a migration in `supabase/migrations/`.
2) Seed initial rows in `supabase/seed.sql`.
3) Update `DataContext` to read the new table(s).
4) Use `useData()` or create new hooks if needed.

## Admin access
Admin-only tables are protected by RLS using `profiles.role = 'admin'`.
Log in with the seeded admin user to view dashboards:
- `admin@foodigo.com` / `Password123!`
