alter table public.profiles add column if not exists role text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists created_at timestamptz default now();
alter table public.profiles add column if not exists updated_at timestamptz default now();

alter table public.categories add column if not exists image_path text;
alter table public.categories add column if not exists image_url text;
alter table public.categories add column if not exists created_at timestamptz default now();

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

alter table public.menu_items add column if not exists restaurant_id text;
alter table public.menu_items add column if not exists price numeric(10, 2) default 0;
alter table public.menu_items add column if not exists calories integer;
alter table public.menu_items add column if not exists description text;
alter table public.menu_items add column if not exists image_path text;
alter table public.menu_items add column if not exists image_url text;
alter table public.menu_items add column if not exists active boolean default true;

alter table public.offers add column if not exists image_path text;
alter table public.offers add column if not exists image_url text;
alter table public.offers add column if not exists description text;
alter table public.offers add column if not exists active boolean default true;
alter table public.offers add column if not exists display_order integer default 0;

alter table public.orders add column if not exists user_id uuid;
alter table public.orders add column if not exists restaurant_id text;
alter table public.orders add column if not exists total numeric(10, 2) default 0;
alter table public.orders add column if not exists status text default 'Pending';
alter table public.orders add column if not exists delivery_address text;
alter table public.orders add column if not exists notes text;
alter table public.orders add column if not exists created_at timestamptz default now();
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in ('Pending', 'Accepted', 'Preparing', 'On the way', 'Delivered', 'Canceled'));

alter table public.scheduled_orders add column if not exists restaurant_name text;
alter table public.group_orders add column if not exists restaurant_name text;

alter table public.restaurant_analytics add column if not exists sales_trend jsonb;
alter table public.restaurant_analytics add column if not exists top_items jsonb;
alter table public.restaurant_analytics add column if not exists payout_history jsonb;
alter table public.restaurant_analytics add column if not exists inventory jsonb;
alter table public.restaurant_analytics add column if not exists profile jsonb;
alter table public.restaurant_analytics add column if not exists promotions jsonb;
alter table public.restaurant_analytics add column if not exists customer_insights jsonb;

alter table public.driver_stats add column if not exists driver_id uuid;
alter table public.driver_stats add column if not exists earnings jsonb;
alter table public.driver_stats add column if not exists hotspots jsonb;
alter table public.driver_stats add column if not exists incentives jsonb;
alter table public.driver_stats add column if not exists chats jsonb;

alter table public.admin_insights add column if not exists revenue jsonb;
alter table public.admin_insights add column if not exists city_breakdown jsonb;
alter table public.admin_insights add column if not exists support_tickets jsonb;
alter table public.admin_insights add column if not exists analytics jsonb;
alter table public.admin_insights add column if not exists financial jsonb;

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

alter table public.fraud_alerts add column if not exists order_id text;
alter table public.fraud_alerts add column if not exists user_id uuid;
alter table public.fraud_alerts add column if not exists description text;
alter table public.fraud_alerts add column if not exists detected_at timestamptz;
alter table public.fraud_alerts add column if not exists status text;
alter table public.fraud_alerts add column if not exists score integer;
alter table public.fraud_alerts add column if not exists action text;
alter table public.fraud_alerts add column if not exists city text;

alter table public.city_operations add column if not exists country text;
alter table public.city_operations add column if not exists status text;
alter table public.city_operations add column if not exists surge text;
alter table public.city_operations add column if not exists restaurants integer default 0;
alter table public.city_operations add column if not exists drivers integer default 0;
alter table public.city_operations add column if not exists orders integer default 0;
alter table public.city_operations add column if not exists revenue numeric(12, 2) default 0;

alter table public.payment_methods add column if not exists user_id uuid;
alter table public.payment_methods add column if not exists brand text;
alter table public.payment_methods add column if not exists last4 text;
alter table public.payment_methods add column if not exists exp text;
alter table public.payment_methods add column if not exists is_primary boolean default false;
