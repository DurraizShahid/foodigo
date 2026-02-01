-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Core auth profile
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  name text,
  avatar_url text,
  role text not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- Catalog
create table if not exists public.categories (
  id text primary key,
  name text not null,
  image_url text not null
);

create table if not exists public.restaurants (
  id text primary key,
  owner_profile_id uuid references public.profiles on delete set null,
  name text not null,
  cuisine text not null,
  rating numeric(3,2) not null,
  delivery_time text not null,
  price_range text not null,
  distance_km numeric(6,2) not null,
  tags text[] not null default '{}',
  image_url text not null,
  description text not null,
  address text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_restaurant_owner(restaurant_id text)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1
    from public.restaurants
    where id = restaurant_id
      and owner_profile_id = auth.uid()
  );
$$;

create table if not exists public.menu_items (
  id text primary key,
  restaurant_id text not null references public.restaurants on delete cascade,
  name text not null,
  price numeric(10,2) not null,
  calories integer not null,
  description text not null,
  image_url text not null
);

create table if not exists public.offers (
  id text primary key,
  image_url text not null,
  title text not null,
  description text not null
);

-- Orders
create table if not exists public.orders (
  id text primary key,
  user_id uuid not null references public.profiles on delete cascade,
  restaurant_id text not null references public.restaurants on delete cascade,
  total numeric(10,2) not null,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id bigserial primary key,
  order_id text not null references public.orders on delete cascade,
  menu_item_id text not null references public.menu_items on delete set null,
  name text not null,
  quantity integer not null,
  price numeric(10,2) not null
);

-- Scheduled orders
create table if not exists public.scheduled_orders (
  id text primary key,
  user_id uuid not null references public.profiles on delete cascade,
  restaurant_id text not null references public.restaurants on delete cascade,
  restaurant_name text not null,
  delivery_time timestamptz not null,
  address text not null,
  status text not null,
  notes text
);

create table if not exists public.scheduled_order_items (
  id bigserial primary key,
  scheduled_order_id text not null references public.scheduled_orders on delete cascade,
  menu_item_id text not null references public.menu_items on delete set null,
  name text not null,
  quantity integer not null,
  price numeric(10,2) not null
);

-- Group ordering
create table if not exists public.group_orders (
  id text primary key,
  host_id uuid not null references public.profiles on delete cascade,
  restaurant_id text not null references public.restaurants on delete cascade,
  restaurant_name text not null,
  invite_code text not null,
  status text not null,
  closes_at timestamptz not null,
  delivery_fee numeric(10,2) not null default 0,
  service_fee numeric(10,2) not null default 0
);

create table if not exists public.group_order_participants (
  id bigserial primary key,
  group_order_id text not null references public.group_orders on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  name text not null,
  total numeric(10,2) not null
);

create table if not exists public.group_order_participant_items (
  id bigserial primary key,
  participant_id bigint not null references public.group_order_participants on delete cascade,
  menu_item_id text not null references public.menu_items on delete set null,
  name text not null,
  quantity integer not null,
  price numeric(10,2) not null
);

-- Subscriptions and loyalty
create table if not exists public.subscriptions (
  id bigserial primary key,
  user_id uuid not null references public.profiles on delete cascade,
  tier text not null,
  perks text[] not null default '{}',
  renewal_date date,
  monthly_fee numeric(10,2) not null,
  active boolean not null default false
);

create table if not exists public.loyalty_rewards (
  id bigserial primary key,
  user_id uuid not null references public.profiles on delete cascade,
  points integer not null,
  next_reward_at integer not null,
  badges text[] not null default '{}'
);

create table if not exists public.loyalty_activity (
  id text primary key,
  loyalty_reward_id bigint not null references public.loyalty_rewards on delete cascade,
  label text not null,
  points integer not null,
  activity_date date not null
);

-- Recommendations
create table if not exists public.recommendation_seeds (
  id text primary key,
  title text not null,
  description text not null
);

create table if not exists public.recommendation_seed_restaurants (
  recommendation_id text not null references public.recommendation_seeds on delete cascade,
  restaurant_id text not null references public.restaurants on delete cascade,
  primary key (recommendation_id, restaurant_id)
);

create table if not exists public.smart_collections (
  id text primary key,
  title text not null,
  subtitle text not null
);

create table if not exists public.smart_collection_items (
  id bigserial primary key,
  collection_id text not null references public.smart_collections on delete cascade,
  restaurant_id text not null references public.restaurants on delete cascade,
  menu_item_id text not null references public.menu_items on delete set null,
  name text not null,
  eta text not null
);

-- Payments
create table if not exists public.payment_methods (
  id text primary key,
  brand text not null,
  last4 text not null,
  exp text not null,
  is_primary boolean not null default false
);

create table if not exists public.payment_providers (
  id text primary key,
  name text not null,
  status text not null,
  last_sync text not null
);

-- Notifications
create table if not exists public.push_event_templates (
  id text primary key,
  channel text not null,
  title text not null,
  body text not null
);

-- Restaurant analytics
create table if not exists public.restaurant_sales_trend (
  id bigserial primary key,
  restaurant_id text not null references public.restaurants on delete cascade,
  label text not null,
  value integer not null
);

create table if not exists public.restaurant_top_items (
  id bigserial primary key,
  restaurant_id text not null references public.restaurants on delete cascade,
  name text not null,
  orders integer not null,
  revenue numeric(10,2) not null
);

create table if not exists public.restaurant_payouts (
  id text primary key,
  restaurant_id text not null references public.restaurants on delete cascade,
  amount numeric(10,2) not null,
  status text not null,
  payout_date date not null
);

create table if not exists public.restaurant_inventory (
  id text primary key,
  restaurant_id text not null references public.restaurants on delete cascade,
  name text not null,
  category text not null default 'Menu Items',
  current_stock integer not null,
  min_stock integer not null,
  unit text not null default 'servings',
  auto_out_of_stock boolean not null default true,
  last_updated timestamptz not null default now(),
  level integer not null,
  status text not null
);

create table if not exists public.restaurant_profile_stats (
  restaurant_id text primary key references public.restaurants on delete cascade,
  restaurant_name text not null,
  phone text not null,
  email text not null,
  hours text not null,
  prep_time text not null
);

create table if not exists public.restaurant_promotions (
  id text primary key,
  restaurant_id text not null references public.restaurants on delete cascade,
  name text not null,
  type text not null,
  status text not null,
  run text not null
);

-- Driver stats
create table if not exists public.driver_stats (
  user_id uuid primary key references public.profiles on delete cascade,
  total numeric(10,2) not null,
  completed_deliveries integer not null,
  avg_rating numeric(4,2) not null
);

create table if not exists public.driver_earnings_week (
  id bigserial primary key,
  user_id uuid not null references public.driver_stats on delete cascade,
  label text not null,
  value numeric(10,2) not null
);

create table if not exists public.driver_hotspots (
  id bigserial primary key,
  user_id uuid not null references public.driver_stats on delete cascade,
  name text not null,
  eta text not null,
  distance text not null
);

create table if not exists public.driver_incentives (
  id text primary key,
  user_id uuid not null references public.driver_stats on delete cascade,
  title text not null,
  requirement text not null,
  reward text not null,
  progress numeric(10,2) not null,
  target numeric(10,2) not null
);

create table if not exists public.driver_chats (
  id text primary key,
  user_id uuid not null references public.driver_stats on delete cascade,
  name text not null,
  snippet text not null,
  time text not null
);

-- Admin insights
create table if not exists public.admin_revenue (
  id bigserial primary key,
  label text not null,
  value integer not null
);

create table if not exists public.admin_city_breakdown (
  id bigserial primary key,
  city text not null,
  restaurants integer not null,
  orders integer not null
);

create table if not exists public.admin_support_tickets (
  id text primary key,
  type text not null,
  status text not null,
  priority text not null
);

create table if not exists public.admin_analytics_summary (
  id text primary key,
  retention_rate numeric(5,2) not null,
  churn_rate numeric(5,2) not null,
  ltv numeric(10,2) not null
);

create table if not exists public.admin_analytics_user_growth (
  id bigserial primary key,
  month text not null,
  users integer not null,
  growth integer not null
);

create table if not exists public.admin_analytics_order_trends (
  id bigserial primary key,
  day text not null,
  orders integer not null,
  revenue integer not null
);

create table if not exists public.admin_analytics_top_restaurants (
  id bigserial primary key,
  name text not null,
  orders integer not null,
  revenue integer not null,
  rating numeric(3,2) not null
);

create table if not exists public.admin_analytics_customer_segments (
  id bigserial primary key,
  segment text not null,
  count integer not null,
  percentage integer not null
);

create table if not exists public.admin_financial_summary (
  id text primary key,
  total_revenue integer not null,
  monthly_revenue integer not null,
  growth numeric(5,2) not null,
  total_orders integer not null,
  average_order_value numeric(10,2) not null,
  commission numeric(5,2) not null,
  platform_fees numeric(5,2) not null,
  payout_restaurants integer not null,
  payout_drivers integer not null,
  payout_total integer not null,
  net_profit integer not null,
  profit_margin numeric(5,2) not null
);

create table if not exists public.admin_financial_revenue_by_city (
  id bigserial primary key,
  city text not null,
  revenue integer not null,
  orders integer not null,
  growth integer not null
);

create table if not exists public.admin_financial_monthly_breakdown (
  id bigserial primary key,
  month text not null,
  revenue integer not null,
  profit integer not null
);

create table if not exists public.experiments (
  id text primary key,
  name text not null,
  description text not null,
  feature text not null,
  variant_a text not null,
  variant_b text not null,
  status text not null,
  traffic_split numeric(5,2) not null,
  participants integer not null,
  variant_a_users integer not null,
  variant_b_users integer not null,
  variant_a_conversion numeric(5,2) not null,
  variant_b_conversion numeric(5,2) not null,
  start_date date,
  end_date date,
  segment text not null
);

create table if not exists public.fraud_alerts (
  id text primary key,
  type text not null,
  risk text not null,
  action text not null,
  city text not null,
  order_id text,
  user_id text,
  description text not null,
  detected_at timestamptz not null,
  status text not null,
  score integer not null
);

create table if not exists public.city_operations (
  id text primary key,
  name text not null,
  country text not null,
  status text not null,
  surge text not null,
  restaurants integer not null,
  drivers integer not null,
  orders integer not null,
  revenue numeric(12,2) not null
);

create table if not exists public.support_tickets (
  id text primary key,
  subject text not null,
  type text not null,
  priority text not null,
  status text not null,
  assigned_to text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  customer text not null,
  description text not null,
  messages jsonb not null default '[]'::jsonb
);

-- Indexes
create index if not exists idx_orders_user_id on public.orders (user_id);
create index if not exists idx_orders_restaurant_id on public.orders (restaurant_id);
create index if not exists idx_menu_items_restaurant_id on public.menu_items (restaurant_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.offers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.scheduled_orders enable row level security;
alter table public.scheduled_order_items enable row level security;
alter table public.group_orders enable row level security;
alter table public.group_order_participants enable row level security;
alter table public.group_order_participant_items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.loyalty_rewards enable row level security;
alter table public.loyalty_activity enable row level security;
alter table public.recommendation_seeds enable row level security;
alter table public.recommendation_seed_restaurants enable row level security;
alter table public.smart_collections enable row level security;
alter table public.smart_collection_items enable row level security;
alter table public.payment_methods enable row level security;
alter table public.payment_providers enable row level security;
alter table public.push_event_templates enable row level security;
alter table public.restaurant_sales_trend enable row level security;
alter table public.restaurant_top_items enable row level security;
alter table public.restaurant_payouts enable row level security;
alter table public.restaurant_inventory enable row level security;
alter table public.restaurant_profile_stats enable row level security;
alter table public.restaurant_promotions enable row level security;
alter table public.driver_stats enable row level security;
alter table public.driver_earnings_week enable row level security;
alter table public.driver_hotspots enable row level security;
alter table public.driver_incentives enable row level security;
alter table public.driver_chats enable row level security;
alter table public.admin_revenue enable row level security;
alter table public.admin_city_breakdown enable row level security;
alter table public.admin_support_tickets enable row level security;
alter table public.admin_analytics_summary enable row level security;
alter table public.admin_analytics_user_growth enable row level security;
alter table public.admin_analytics_order_trends enable row level security;
alter table public.admin_analytics_top_restaurants enable row level security;
alter table public.admin_analytics_customer_segments enable row level security;
alter table public.admin_financial_summary enable row level security;
alter table public.admin_financial_revenue_by_city enable row level security;
alter table public.admin_financial_monthly_breakdown enable row level security;
alter table public.support_tickets enable row level security;
alter table public.experiments enable row level security;
alter table public.fraud_alerts enable row level security;
alter table public.city_operations enable row level security;

-- Policies
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_self"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_self_or_admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

create policy "public_read_categories"
  on public.categories for select
  using (true);

create policy "public_read_restaurants"
  on public.restaurants for select
  using (true);

create policy "public_read_menu_items"
  on public.menu_items for select
  using (true);

create policy "public_read_offers"
  on public.offers for select
  using (true);

create policy "admin_write_catalog"
  on public.categories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_write_restaurants"
  on public.restaurants for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_write_menu_items"
  on public.menu_items for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin_write_offers"
  on public.offers for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "orders_read_own_admin_or_owner"
  on public.orders for select
  using (
    auth.uid() = user_id
    or public.is_admin()
    or public.is_restaurant_owner(restaurant_id)
  );

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "orders_update_own_or_admin"
  on public.orders for update
  using (auth.uid() = user_id or public.is_admin());

create policy "order_items_read_order_scope"
  on public.order_items for select
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_id
        and (
          o.user_id = auth.uid()
          or public.is_admin()
          or public.is_restaurant_owner(o.restaurant_id)
        )
    )
  );

create policy "order_items_insert_order_owner"
  on public.order_items for insert
  with check (
    exists (
      select 1
      from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or public.is_admin() or public.is_restaurant_owner(o.restaurant_id))
    )
  );

create policy "scheduled_orders_read_own_admin"
  on public.scheduled_orders for select
  using (auth.uid() = user_id or public.is_admin());

create policy "scheduled_orders_insert_own"
  on public.scheduled_orders for insert
  with check (auth.uid() = user_id);

create policy "scheduled_orders_update_own_admin"
  on public.scheduled_orders for update
  using (auth.uid() = user_id or public.is_admin());

create policy "scheduled_order_items_read_scope"
  on public.scheduled_order_items for select
  using (
    exists (
      select 1
      from public.scheduled_orders so
      where so.id = scheduled_order_id
        and (so.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "scheduled_order_items_insert_scope"
  on public.scheduled_order_items for insert
  with check (
    exists (
      select 1
      from public.scheduled_orders so
      where so.id = scheduled_order_id
        and (so.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "group_orders_read_own_admin"
  on public.group_orders for select
  using (auth.uid() = host_id or public.is_admin());

create policy "group_orders_insert_own"
  on public.group_orders for insert
  with check (auth.uid() = host_id);

create policy "group_orders_update_own_admin"
  on public.group_orders for update
  using (auth.uid() = host_id or public.is_admin());

create policy "group_order_participants_read_scope"
  on public.group_order_participants for select
  using (
    exists (
      select 1
      from public.group_orders go
      where go.id = group_order_id
        and (go.host_id = auth.uid() or public.is_admin() or user_id = auth.uid())
    )
  );

create policy "group_order_participants_insert_scope"
  on public.group_order_participants for insert
  with check (
    exists (
      select 1
      from public.group_orders go
      where go.id = group_order_id
        and (go.status = 'Collecting')
        and (auth.uid() = user_id or go.host_id = auth.uid() or public.is_admin())
    )
  );

create policy "group_order_participant_items_read_scope"
  on public.group_order_participant_items for select
  using (
    exists (
      select 1
      from public.group_order_participants gp
      join public.group_orders go on go.id = gp.group_order_id
      where gp.id = participant_id
        and (gp.user_id = auth.uid() or go.host_id = auth.uid() or public.is_admin())
    )
  );

create policy "group_order_participant_items_insert_scope"
  on public.group_order_participant_items for insert
  with check (
    exists (
      select 1
      from public.group_order_participants gp
      join public.group_orders go on go.id = gp.group_order_id
      where gp.id = participant_id
        and (gp.user_id = auth.uid() or go.host_id = auth.uid() or public.is_admin())
    )
  );

create policy "subscriptions_read_own_admin"
  on public.subscriptions for select
  using (auth.uid() = user_id or public.is_admin());

create policy "subscriptions_insert_own"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "loyalty_rewards_read_own_admin"
  on public.loyalty_rewards for select
  using (auth.uid() = user_id or public.is_admin());

create policy "loyalty_activity_read_scope"
  on public.loyalty_activity for select
  using (
    exists (
      select 1
      from public.loyalty_rewards lr
      where lr.id = loyalty_reward_id
        and (lr.user_id = auth.uid() or public.is_admin())
    )
  );

create policy "public_read_recommendations"
  on public.recommendation_seeds for select
  using (true);

create policy "public_read_recommendation_restaurants"
  on public.recommendation_seed_restaurants for select
  using (true);

create policy "public_read_collections"
  on public.smart_collections for select
  using (true);

create policy "public_read_collection_items"
  on public.smart_collection_items for select
  using (true);

create policy "public_read_payment_methods"
  on public.payment_methods for select
  using (true);

create policy "public_read_payment_providers"
  on public.payment_providers for select
  using (true);

create policy "public_read_push_templates"
  on public.push_event_templates for select
  using (true);

create policy "restaurant_analytics_read_owner_or_admin"
  on public.restaurant_sales_trend for select
  using (public.is_restaurant_owner(restaurant_id) or public.is_admin());

create policy "restaurant_top_items_read_owner_or_admin"
  on public.restaurant_top_items for select
  using (public.is_restaurant_owner(restaurant_id) or public.is_admin());

create policy "restaurant_payouts_read_owner_or_admin"
  on public.restaurant_payouts for select
  using (public.is_restaurant_owner(restaurant_id) or public.is_admin());

create policy "restaurant_inventory_read_owner_or_admin"
  on public.restaurant_inventory for select
  using (public.is_restaurant_owner(restaurant_id) or public.is_admin());

create policy "restaurant_profile_stats_read_owner_or_admin"
  on public.restaurant_profile_stats for select
  using (public.is_restaurant_owner(restaurant_id) or public.is_admin());

create policy "restaurant_promotions_read_owner_or_admin"
  on public.restaurant_promotions for select
  using (public.is_restaurant_owner(restaurant_id) or public.is_admin());

create policy "driver_stats_read_self_or_admin"
  on public.driver_stats for select
  using (auth.uid() = user_id or public.is_admin());

create policy "driver_stats_children_read_self_or_admin"
  on public.driver_earnings_week for select
  using (auth.uid() = user_id or public.is_admin());

create policy "driver_hotspots_read_self_or_admin"
  on public.driver_hotspots for select
  using (auth.uid() = user_id or public.is_admin());

create policy "driver_incentives_read_self_or_admin"
  on public.driver_incentives for select
  using (auth.uid() = user_id or public.is_admin());

create policy "driver_chats_read_self_or_admin"
  on public.driver_chats for select
  using (auth.uid() = user_id or public.is_admin());

create policy "admin_revenue_read_admin"
  on public.admin_revenue for select
  using (public.is_admin());

create policy "admin_city_breakdown_read_admin"
  on public.admin_city_breakdown for select
  using (public.is_admin());

create policy "admin_support_tickets_read_admin"
  on public.admin_support_tickets for select
  using (public.is_admin());

create policy "admin_analytics_summary_read_admin"
  on public.admin_analytics_summary for select
  using (public.is_admin());

create policy "admin_analytics_user_growth_read_admin"
  on public.admin_analytics_user_growth for select
  using (public.is_admin());

create policy "admin_analytics_order_trends_read_admin"
  on public.admin_analytics_order_trends for select
  using (public.is_admin());

create policy "admin_analytics_top_restaurants_read_admin"
  on public.admin_analytics_top_restaurants for select
  using (public.is_admin());

create policy "admin_analytics_customer_segments_read_admin"
  on public.admin_analytics_customer_segments for select
  using (public.is_admin());

create policy "admin_financial_summary_read_admin"
  on public.admin_financial_summary for select
  using (public.is_admin());

create policy "admin_financial_revenue_by_city_read_admin"
  on public.admin_financial_revenue_by_city for select
  using (public.is_admin());

create policy "admin_financial_monthly_breakdown_read_admin"
  on public.admin_financial_monthly_breakdown for select
  using (public.is_admin());

create policy "support_tickets_read_admin"
  on public.support_tickets for select
  using (public.is_admin());

create policy "experiments_read_admin"
  on public.experiments for select
  using (public.is_admin());

create policy "fraud_alerts_read_admin"
  on public.fraud_alerts for select
  using (public.is_admin());

create policy "city_operations_read_admin"
  on public.city_operations for select
  using (public.is_admin());
