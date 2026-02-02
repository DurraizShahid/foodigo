create extension if not exists "pgcrypto";

create or replace function public.current_profile_role()
returns text
language sql
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((select role = 'admin' from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_restaurant()
returns boolean
language sql
stable
as $$
  select coalesce((select role = 'restaurant' from public.profiles where id = auth.uid()), false)
$$;

create or replace function public.is_driver()
returns boolean
language sql
stable
as $$
  select coalesce((select role = 'driver' from public.profiles where id = auth.uid()), false)
$$;


create table if not exists public.profiles (
  id uuid primary key,
  role text not null default 'customer' check (role in ('customer', 'restaurant', 'driver', 'admin')),
  full_name text,
  email text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role, email)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.categories (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  image_path text,
  image_url text,
  created_at timestamptz not null default now()
);

alter table public.categories add column if not exists image_path text;
alter table public.categories add column if not exists image_url text;
alter table public.categories add column if not exists created_at timestamptz default now();

create table if not exists public.restaurants (
  id text primary key default gen_random_uuid()::text,
  owner_id uuid,
  name text not null,
  cuisine text,
  rating numeric(3, 2) default 0,
  delivery_time text,
  price_range text,
  distance_km numeric(6, 2),
  tags text[],
  image_path text,
  image_url text,
  description text,
  address text,
  is_featured boolean not null default false,
  featured_order integer,
  created_at timestamptz not null default now()
);

alter table public.restaurants add column if not exists owner_id uuid;
alter table public.restaurants add column if not exists cuisine text;
alter table public.restaurants add column if not exists rating numeric(3, 2) default 0;
alter table public.restaurants add column if not exists delivery_time text;
alter table public.restaurants add column if not exists price_range text;
alter table public.restaurants add column if not exists distance_km numeric(6, 2);
alter table public.restaurants add column if not exists tags text[];
alter table public.restaurants add column if not exists image_path text;
alter table public.restaurants add column if not exists image_url text;
alter table public.restaurants add column if not exists description text;
alter table public.restaurants add column if not exists address text;
alter table public.restaurants add column if not exists is_featured boolean default false;
alter table public.restaurants add column if not exists featured_order integer;
alter table public.restaurants add column if not exists created_at timestamptz default now();

create table if not exists public.restaurant_tags (
  id text primary key default gen_random_uuid()::text,
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  tag text not null
);

create table if not exists public.restaurant_categories (
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  category_id text not null references public.categories(id) on delete cascade,
  primary key (restaurant_id, category_id)
);

create table if not exists public.menu_items (
  id text primary key default gen_random_uuid()::text,
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  name text not null,
  price numeric(10, 2) not null,
  calories integer,
  description text,
  image_path text,
  image_url text,
  active boolean not null default true
);

alter table public.menu_items add column if not exists restaurant_id text;
alter table public.menu_items add column if not exists price numeric(10, 2) default 0;
alter table public.menu_items add column if not exists calories integer;
alter table public.menu_items add column if not exists description text;
alter table public.menu_items add column if not exists image_path text;
alter table public.menu_items add column if not exists image_url text;
alter table public.menu_items add column if not exists active boolean default true;

create table if not exists public.offers (
  id text primary key default gen_random_uuid()::text,
  image_path text,
  image_url text,
  title text not null,
  description text,
  active boolean not null default true,
  display_order integer not null default 0
);

alter table public.offers add column if not exists image_path text;
alter table public.offers add column if not exists image_url text;
alter table public.offers add column if not exists description text;
alter table public.offers add column if not exists active boolean default true;
alter table public.offers add column if not exists display_order integer default 0;

create table if not exists public.recommendation_seeds (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  description text
);

create table if not exists public.recommendation_seed_restaurants (
  seed_id text not null references public.recommendation_seeds(id) on delete cascade,
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  primary key (seed_id, restaurant_id)
);

create table if not exists public.smart_collections (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  subtitle text
);

create table if not exists public.smart_collection_items (
  id text primary key default gen_random_uuid()::text,
  collection_id text not null references public.smart_collections(id) on delete cascade,
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  menu_item_id text references public.menu_items(id) on delete set null,
  name text,
  eta text
);

create table if not exists public.orders (
  id text primary key default gen_random_uuid()::text,
  user_id uuid,
  restaurant_id text references public.restaurants(id) on delete set null,
  total numeric(10, 2) not null default 0,
  status text not null default 'Pending' check (status in ('Pending', 'Accepted', 'Preparing', 'On the way', 'Delivered', 'Canceled')),
  delivery_address text,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists user_id uuid;
alter table public.orders add column if not exists restaurant_id text;
alter table public.orders add column if not exists total numeric(10, 2) default 0;
alter table public.orders add column if not exists status text default 'Pending';
alter table public.orders add column if not exists delivery_address text;
alter table public.orders add column if not exists notes text;
alter table public.orders add column if not exists created_at timestamptz default now();
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in ('Pending', 'Accepted', 'Preparing', 'On the way', 'Delivered', 'Canceled'));

create table if not exists public.order_items (
  id text primary key default gen_random_uuid()::text,
  order_id text not null references public.orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id) on delete set null,
  name text not null,
  quantity integer not null default 1,
  price numeric(10, 2) not null default 0
);

create table if not exists public.scheduled_orders (
  id text primary key default gen_random_uuid()::text,
  user_id uuid,
  restaurant_id text references public.restaurants(id) on delete set null,
  delivery_time timestamptz not null,
  address text,
  status text not null default 'Scheduled' check (status in ('Scheduled', 'Preparing', 'Canceled')),
  notes text
);

create table if not exists public.scheduled_order_items (
  id text primary key default gen_random_uuid()::text,
  scheduled_order_id text not null references public.scheduled_orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id) on delete set null,
  name text not null,
  quantity integer not null default 1,
  price numeric(10, 2) not null default 0
);

create table if not exists public.group_orders (
  id text primary key default gen_random_uuid()::text,
  host_id uuid,
  restaurant_id text references public.restaurants(id) on delete set null,
  invite_code text unique,
  status text not null default 'Collecting' check (status in ('Collecting', 'Submitted', 'Closed')),
  closes_at timestamptz,
  delivery_fee numeric(10, 2) not null default 0,
  service_fee numeric(10, 2) not null default 0
);

create table if not exists public.group_order_participants (
  id bigint generated by default as identity primary key,
  group_order_id text not null references public.group_orders(id) on delete cascade,
  user_id uuid,
  name text,
  total numeric(10, 2) not null default 0
);

create or replace function public.is_restaurant_owner(restaurant_id text)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.restaurants r
    where r.id = restaurant_id and r.owner_id = auth.uid()
  )
$$;

create or replace function public.is_group_participant(group_id text)
returns boolean
language sql
stable
as $$
  select exists(
    select 1
    from public.group_order_participants p
    where p.group_order_id = group_id and p.user_id = auth.uid()
  )
$$;

create table if not exists public.group_order_items (
  id bigint generated by default as identity primary key,
  participant_id bigint not null references public.group_order_participants(id) on delete cascade,
  menu_item_id text references public.menu_items(id) on delete set null,
  name text not null,
  quantity integer not null default 1,
  price numeric(10, 2) not null default 0
);

create table if not exists public.subscriptions (
  id text primary key default gen_random_uuid()::text,
  user_id uuid,
  tier text not null,
  perks text[],
  renewal_date date,
  monthly_fee numeric(10, 2) not null default 0,
  active boolean not null default false
);

create table if not exists public.loyalty_rewards (
  id text primary key default gen_random_uuid()::text,
  user_id uuid,
  points integer not null default 0,
  next_reward_at integer not null default 0,
  badges text[]
);

create table if not exists public.loyalty_activity (
  id text primary key default gen_random_uuid()::text,
  loyalty_reward_id text not null references public.loyalty_rewards(id) on delete cascade,
  label text not null,
  points integer not null default 0,
  activity_date date
);

create table if not exists public.payment_methods (
  id text primary key default gen_random_uuid()::text,
  user_id uuid,
  brand text not null,
  last4 text not null,
  exp text not null,
  is_primary boolean not null default false
);

alter table public.payment_methods add column if not exists user_id uuid;
alter table public.payment_methods add column if not exists brand text;
alter table public.payment_methods add column if not exists last4 text;
alter table public.payment_methods add column if not exists exp text;
alter table public.payment_methods add column if not exists is_primary boolean default false;

create table if not exists public.payment_providers (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  status text not null,
  last_sync text
);

create table if not exists public.push_event_templates (
  id text primary key default gen_random_uuid()::text,
  channel text not null,
  title text not null,
  body text not null
);

create table if not exists public.restaurant_analytics (
  id text primary key default gen_random_uuid()::text,
  restaurant_id text references public.restaurants(id) on delete set null,
  sales_trend jsonb,
  top_items jsonb,
  payout_history jsonb,
  inventory jsonb,
  profile jsonb,
  promotions jsonb,
  customer_insights jsonb
);

alter table public.restaurant_analytics add column if not exists sales_trend jsonb;
alter table public.restaurant_analytics add column if not exists top_items jsonb;
alter table public.restaurant_analytics add column if not exists payout_history jsonb;
alter table public.restaurant_analytics add column if not exists inventory jsonb;
alter table public.restaurant_analytics add column if not exists profile jsonb;
alter table public.restaurant_analytics add column if not exists promotions jsonb;
alter table public.restaurant_analytics add column if not exists customer_insights jsonb;

create table if not exists public.driver_stats (
  id text primary key default gen_random_uuid()::text,
  driver_id uuid,
  earnings jsonb,
  hotspots jsonb,
  incentives jsonb,
  chats jsonb
);

alter table public.driver_stats add column if not exists driver_id uuid;
alter table public.driver_stats add column if not exists earnings jsonb;
alter table public.driver_stats add column if not exists hotspots jsonb;
alter table public.driver_stats add column if not exists incentives jsonb;
alter table public.driver_stats add column if not exists chats jsonb;

create table if not exists public.admin_insights (
  id text primary key default gen_random_uuid()::text,
  revenue jsonb,
  city_breakdown jsonb,
  support_tickets jsonb,
  analytics jsonb,
  financial jsonb
);

alter table public.admin_insights add column if not exists revenue jsonb;
alter table public.admin_insights add column if not exists city_breakdown jsonb;
alter table public.admin_insights add column if not exists support_tickets jsonb;
alter table public.admin_insights add column if not exists analytics jsonb;
alter table public.admin_insights add column if not exists financial jsonb;

create table if not exists public.experiments (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  description text,
  feature text,
  variant_a text,
  variant_b text,
  status text,
  traffic_split integer,
  participants integer,
  variant_a_users integer,
  variant_b_users integer,
  variant_a_conversion numeric(6, 2),
  variant_b_conversion numeric(6, 2),
  start_date date,
  end_date date,
  segment text
);

alter table public.experiments add column if not exists description text;
alter table public.experiments add column if not exists feature text;
alter table public.experiments add column if not exists variant_a text;
alter table public.experiments add column if not exists variant_b text;
alter table public.experiments add column if not exists status text;
alter table public.experiments add column if not exists traffic_split integer;
alter table public.experiments add column if not exists participants integer;
alter table public.experiments add column if not exists variant_a_users integer;
alter table public.experiments add column if not exists variant_b_users integer;
alter table public.experiments add column if not exists variant_a_conversion numeric(6, 2);
alter table public.experiments add column if not exists variant_b_conversion numeric(6, 2);
alter table public.experiments add column if not exists start_date date;
alter table public.experiments add column if not exists end_date date;
alter table public.experiments add column if not exists segment text;

create table if not exists public.fraud_alerts (
  id text primary key default gen_random_uuid()::text,
  type text not null,
  risk text not null,
  order_id text,
  user_id uuid,
  description text,
  detected_at timestamptz,
  status text,
  score integer,
  action text,
  city text
);

alter table public.fraud_alerts add column if not exists order_id text;
alter table public.fraud_alerts add column if not exists user_id uuid;
alter table public.fraud_alerts add column if not exists description text;
alter table public.fraud_alerts add column if not exists detected_at timestamptz;
alter table public.fraud_alerts add column if not exists status text;
alter table public.fraud_alerts add column if not exists score integer;
alter table public.fraud_alerts add column if not exists action text;
alter table public.fraud_alerts add column if not exists city text;

create table if not exists public.city_operations (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  country text,
  status text,
  surge text,
  restaurants integer not null default 0,
  drivers integer not null default 0,
  orders integer not null default 0,
  revenue numeric(12, 2) not null default 0
);

alter table public.city_operations add column if not exists country text;
alter table public.city_operations add column if not exists status text;
alter table public.city_operations add column if not exists surge text;
alter table public.city_operations add column if not exists restaurants integer default 0;
alter table public.city_operations add column if not exists drivers integer default 0;
alter table public.city_operations add column if not exists orders integer default 0;
alter table public.city_operations add column if not exists revenue numeric(12, 2) default 0;

create table if not exists public.inventory_items (
  id text primary key default gen_random_uuid()::text,
  restaurant_id text not null references public.restaurants(id) on delete cascade,
  name text not null,
  category text,
  current_stock integer not null default 0,
  min_stock integer not null default 0,
  unit text,
  auto_out_of_stock boolean not null default true,
  last_updated timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id text primary key default gen_random_uuid()::text,
  subject text not null,
  type text,
  priority text,
  status text,
  assigned_to text,
  customer_email text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_ticket_messages (
  id text primary key default gen_random_uuid()::text,
  ticket_id text not null references public.support_tickets(id) on delete cascade,
  sender text not null,
  message text not null,
  timestamp timestamptz not null default now()
);

create table if not exists public.cart_items (
  id text primary key default gen_random_uuid()::text,
  user_id uuid,
  menu_item_id text references public.menu_items(id) on delete set null,
  name text not null,
  price numeric(10, 2) not null,
  image_path text,
  image_url text,
  description text,
  quantity integer not null default 1
);

create index if not exists idx_restaurants_cuisine on public.restaurants (cuisine);
create index if not exists idx_restaurants_rating on public.restaurants (rating);
create index if not exists idx_menu_items_restaurant on public.menu_items (restaurant_id);
create index if not exists idx_orders_user on public.orders (user_id);
create index if not exists idx_orders_restaurant on public.orders (restaurant_id);
create index if not exists idx_scheduled_orders_user on public.scheduled_orders (user_id);
create index if not exists idx_group_orders_host on public.group_orders (host_id);
create index if not exists idx_group_participants_group on public.group_order_participants (group_order_id);
create index if not exists idx_cart_items_user on public.cart_items (user_id);
create index if not exists idx_inventory_items_restaurant on public.inventory_items (restaurant_id);
create index if not exists idx_support_ticket_messages_ticket on public.support_ticket_messages (ticket_id);

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_tags enable row level security;
alter table public.restaurant_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.offers enable row level security;
alter table public.recommendation_seeds enable row level security;
alter table public.recommendation_seed_restaurants enable row level security;
alter table public.smart_collections enable row level security;
alter table public.smart_collection_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.scheduled_orders enable row level security;
alter table public.scheduled_order_items enable row level security;
alter table public.group_orders enable row level security;
alter table public.group_order_participants enable row level security;
alter table public.group_order_items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.loyalty_rewards enable row level security;
alter table public.loyalty_activity enable row level security;
alter table public.payment_methods enable row level security;
alter table public.payment_providers enable row level security;
alter table public.push_event_templates enable row level security;
alter table public.restaurant_analytics enable row level security;
alter table public.driver_stats enable row level security;
alter table public.admin_insights enable row level security;
alter table public.experiments enable row level security;
alter table public.fraud_alerts enable row level security;
alter table public.city_operations enable row level security;
alter table public.cart_items enable row level security;
alter table public.inventory_items enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;

create policy "Profiles select own or admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

create policy "Profiles insert own"
on public.profiles for insert
with check (id = auth.uid());

create policy "Profiles update own or admin"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

create policy "Public read categories"
on public.categories for select
using (true);

create policy "Admin manage categories"
on public.categories for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public read restaurants"
on public.restaurants for select
using (true);

create policy "Admin or owner manage restaurants"
on public.restaurants for all
using (public.is_admin() or owner_id = auth.uid())
with check (public.is_admin() or owner_id = auth.uid());

create policy "Public read restaurant tags"
on public.restaurant_tags for select
using (true);

create policy "Admin or owner manage restaurant tags"
on public.restaurant_tags for all
using (public.is_admin() or public.is_restaurant_owner(restaurant_id))
with check (public.is_admin() or public.is_restaurant_owner(restaurant_id));

create policy "Public read restaurant categories"
on public.restaurant_categories for select
using (true);

create policy "Admin or owner manage restaurant categories"
on public.restaurant_categories for all
using (public.is_admin() or public.is_restaurant_owner(restaurant_id))
with check (public.is_admin() or public.is_restaurant_owner(restaurant_id));

create policy "Public read menu items"
on public.menu_items for select
using (true);

create policy "Admin or owner manage menu items"
on public.menu_items for all
using (public.is_admin() or public.is_restaurant_owner(restaurant_id))
with check (public.is_admin() or public.is_restaurant_owner(restaurant_id));

create policy "Public read offers"
on public.offers for select
using (true);

create policy "Admin manage offers"
on public.offers for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public read recommendation seeds"
on public.recommendation_seeds for select
using (true);

create policy "Admin manage recommendation seeds"
on public.recommendation_seeds for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public read seed restaurants"
on public.recommendation_seed_restaurants for select
using (true);

create policy "Admin manage seed restaurants"
on public.recommendation_seed_restaurants for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public read smart collections"
on public.smart_collections for select
using (true);

create policy "Admin manage smart collections"
on public.smart_collections for all
using (public.is_admin())
with check (public.is_admin());

create policy "Public read smart collection items"
on public.smart_collection_items for select
using (true);

create policy "Admin manage smart collection items"
on public.smart_collection_items for all
using (public.is_admin())
with check (public.is_admin());

create policy "Orders select owner, restaurant, or admin"
on public.orders for select
using (
  user_id = auth.uid()
  or public.is_admin()
  or public.is_restaurant_owner(restaurant_id)
  or public.is_driver()
);

create policy "Orders insert by owner"
on public.orders for insert
with check (user_id = auth.uid());

create policy "Orders update by owner, restaurant, or admin"
on public.orders for update
using (
  user_id = auth.uid()
  or public.is_admin()
  or public.is_restaurant_owner(restaurant_id)
)
with check (
  user_id = auth.uid()
  or public.is_admin()
  or public.is_restaurant_owner(restaurant_id)
);

create policy "Orders delete by admin"
on public.orders for delete
using (public.is_admin());

create policy "Order items select by order access"
on public.order_items for select
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id
      and (
        o.user_id = auth.uid()
        or public.is_admin()
        or public.is_restaurant_owner(o.restaurant_id)
        or public.is_driver()
      )
  )
);

create policy "Order items insert by order owner"
on public.order_items for insert
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);

create policy "Order items update by order owner or admin"
on public.order_items for update
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  )
);

create policy "Order items delete by admin"
on public.order_items for delete
using (public.is_admin());

create policy "Scheduled orders select owner, restaurant, or admin"
on public.scheduled_orders for select
using (
  user_id = auth.uid()
  or public.is_admin()
  or public.is_restaurant_owner(restaurant_id)
);

create policy "Scheduled orders insert by owner"
on public.scheduled_orders for insert
with check (user_id = auth.uid());

create policy "Scheduled orders update by owner, restaurant, or admin"
on public.scheduled_orders for update
using (
  user_id = auth.uid()
  or public.is_admin()
  or public.is_restaurant_owner(restaurant_id)
)
with check (
  user_id = auth.uid()
  or public.is_admin()
  or public.is_restaurant_owner(restaurant_id)
);

create policy "Scheduled orders delete by admin"
on public.scheduled_orders for delete
using (public.is_admin());

create policy "Scheduled order items select by order access"
on public.scheduled_order_items for select
using (
  exists (
    select 1 from public.scheduled_orders o
    where o.id = scheduled_order_id
      and (
        o.user_id = auth.uid()
        or public.is_admin()
        or public.is_restaurant_owner(o.restaurant_id)
      )
  )
);

create policy "Scheduled order items insert by order owner"
on public.scheduled_order_items for insert
with check (
  exists (
    select 1 from public.scheduled_orders o
    where o.id = scheduled_order_id and o.user_id = auth.uid()
  )
);

create policy "Scheduled order items update by order owner or admin"
on public.scheduled_order_items for update
using (
  exists (
    select 1 from public.scheduled_orders o
    where o.id = scheduled_order_id and (o.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.scheduled_orders o
    where o.id = scheduled_order_id and (o.user_id = auth.uid() or public.is_admin())
  )
);

create policy "Scheduled order items delete by admin"
on public.scheduled_order_items for delete
using (public.is_admin());

create policy "Group orders select host, participant, or admin"
on public.group_orders for select
using (
  host_id = auth.uid()
  or public.is_admin()
  or public.is_group_participant(id)
);

create policy "Group orders insert by host"
on public.group_orders for insert
with check (host_id = auth.uid());

create policy "Group orders update by host or admin"
on public.group_orders for update
using (host_id = auth.uid() or public.is_admin())
with check (host_id = auth.uid() or public.is_admin());

create policy "Group orders delete by admin"
on public.group_orders for delete
using (public.is_admin());

create policy "Group participants select by participant, host, or admin"
on public.group_order_participants for select
using (
  user_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.group_orders g
    where g.id = group_order_id and g.host_id = auth.uid()
  )
);

create policy "Group participants insert by user"
on public.group_order_participants for insert
with check (user_id = auth.uid());

create policy "Group participants update by host or admin"
on public.group_order_participants for update
using (
  public.is_admin()
  or exists (
    select 1 from public.group_orders g
    where g.id = group_order_id and g.host_id = auth.uid()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1 from public.group_orders g
    where g.id = group_order_id and g.host_id = auth.uid()
  )
);

create policy "Group participants delete by admin"
on public.group_order_participants for delete
using (public.is_admin());

create policy "Group order items select by participant, host, or admin"
on public.group_order_items for select
using (
  exists (
    select 1
    from public.group_order_participants p
    where p.id = participant_id and p.user_id = auth.uid()
  )
  or public.is_admin()
  or exists (
    select 1
    from public.group_order_participants p
    join public.group_orders g on g.id = p.group_order_id
    where p.id = participant_id and g.host_id = auth.uid()
  )
);

create policy "Group order items insert by participant"
on public.group_order_items for insert
with check (
  exists (
    select 1
    from public.group_order_participants p
    where p.id = participant_id and p.user_id = auth.uid()
  )
);

create policy "Group order items update by admin"
on public.group_order_items for update
using (public.is_admin())
with check (public.is_admin());

create policy "Group order items delete by admin"
on public.group_order_items for delete
using (public.is_admin());

create policy "Subscriptions select own or admin"
on public.subscriptions for select
using (user_id = auth.uid() or public.is_admin());

create policy "Subscriptions manage own"
on public.subscriptions for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "Loyalty rewards select own or admin"
on public.loyalty_rewards for select
using (user_id = auth.uid() or public.is_admin());

create policy "Loyalty rewards manage own"
on public.loyalty_rewards for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "Loyalty activity select via reward"
on public.loyalty_activity for select
using (
  exists (
    select 1 from public.loyalty_rewards r
    where r.id = loyalty_reward_id and (r.user_id = auth.uid() or public.is_admin())
  )
);

create policy "Loyalty activity manage via reward"
on public.loyalty_activity for all
using (
  exists (
    select 1 from public.loyalty_rewards r
    where r.id = loyalty_reward_id and (r.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.loyalty_rewards r
    where r.id = loyalty_reward_id and (r.user_id = auth.uid() or public.is_admin())
  )
);

create policy "Payment methods select own or admin"
on public.payment_methods for select
using (user_id = auth.uid() or public.is_admin());

create policy "Payment methods manage own"
on public.payment_methods for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "Payment providers admin only"
on public.payment_providers for all
using (public.is_admin())
with check (public.is_admin());

create policy "Payment providers read"
on public.payment_providers for select
using (true);

create policy "Push events read"
on public.push_event_templates for select
using (true);

create policy "Push events admin manage"
on public.push_event_templates for insert
with check (public.is_admin());

create policy "Push events admin update"
on public.push_event_templates for update
using (public.is_admin())
with check (public.is_admin());

create policy "Push events admin delete"
on public.push_event_templates for delete
using (public.is_admin());

create policy "Restaurant analytics select owner or admin"
on public.restaurant_analytics for select
using (public.is_admin() or public.is_restaurant_owner(restaurant_id));

create policy "Restaurant analytics manage admin"
on public.restaurant_analytics for all
using (public.is_admin())
with check (public.is_admin());

create policy "Driver stats select owner or admin"
on public.driver_stats for select
using (public.is_admin() or driver_id = auth.uid());

create policy "Driver stats manage admin"
on public.driver_stats for all
using (public.is_admin())
with check (public.is_admin());

create policy "Admin insights admin only"
on public.admin_insights for all
using (public.is_admin())
with check (public.is_admin());

create policy "Experiments admin only"
on public.experiments for all
using (public.is_admin())
with check (public.is_admin());

create policy "Fraud alerts admin only"
on public.fraud_alerts for all
using (public.is_admin())
with check (public.is_admin());

create policy "City operations admin only"
on public.city_operations for all
using (public.is_admin())
with check (public.is_admin());

create policy "Cart items select own or admin"
on public.cart_items for select
using (user_id = auth.uid() or public.is_admin());

create policy "Cart items manage own"
on public.cart_items for all
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

create policy "Inventory items select owner or admin"
on public.inventory_items for select
using (public.is_admin() or public.is_restaurant_owner(restaurant_id));

create policy "Inventory items manage owner or admin"
on public.inventory_items for all
using (public.is_admin() or public.is_restaurant_owner(restaurant_id))
with check (public.is_admin() or public.is_restaurant_owner(restaurant_id));

create policy "Support tickets admin only"
on public.support_tickets for all
using (public.is_admin())
with check (public.is_admin());

create policy "Support ticket messages admin only"
on public.support_ticket_messages for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('restaurants', 'restaurants', true),
  ('menu-items', 'menu-items', true),
  ('documents', 'documents', true)
on conflict (id) do nothing;

do $$
begin
  alter table storage.objects enable row level security;

  create policy "Public read storage buckets"
  on storage.objects for select
  using (bucket_id in ('avatars', 'restaurants', 'menu-items', 'documents'));

  create policy "Authenticated upload storage objects"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated'
    and bucket_id in ('avatars', 'restaurants', 'menu-items', 'documents')
  );

  create policy "Authenticated update own storage objects"
  on storage.objects for update
  using (
    auth.role() = 'authenticated'
    and owner = auth.uid()
    and bucket_id in ('avatars', 'restaurants', 'menu-items', 'documents')
  )
  with check (
    auth.role() = 'authenticated'
    and owner = auth.uid()
    and bucket_id in ('avatars', 'restaurants', 'menu-items', 'documents')
  );

  create policy "Authenticated delete own storage objects"
  on storage.objects for delete
  using (
    auth.role() = 'authenticated'
    and owner = auth.uid()
    and bucket_id in ('avatars', 'restaurants', 'menu-items', 'documents')
  );
exception
  when insufficient_privilege then
    raise notice 'Skipping storage.objects RLS changes due to permissions.';
end $$;
