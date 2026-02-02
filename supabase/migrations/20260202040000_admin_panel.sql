create table if not exists public.marketing_campaigns (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  type text not null,
  status text not null default 'draft',
  target_audience text,
  start_date date,
  end_date date,
  budget numeric(12, 2) not null default 0,
  spent numeric(12, 2) not null default 0,
  impressions integer not null default 0,
  clicks integer not null default 0,
  conversions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketing_campaigns add column if not exists name text;
alter table public.marketing_campaigns add column if not exists type text;
alter table public.marketing_campaigns add column if not exists status text;
alter table public.marketing_campaigns add column if not exists target_audience text;
alter table public.marketing_campaigns add column if not exists start_date date;
alter table public.marketing_campaigns add column if not exists end_date date;
alter table public.marketing_campaigns add column if not exists budget numeric(12, 2) default 0;
alter table public.marketing_campaigns add column if not exists spent numeric(12, 2) default 0;
alter table public.marketing_campaigns add column if not exists impressions integer default 0;
alter table public.marketing_campaigns add column if not exists clicks integer default 0;
alter table public.marketing_campaigns add column if not exists conversions integer default 0;
alter table public.marketing_campaigns add column if not exists created_at timestamptz default now();
alter table public.marketing_campaigns add column if not exists updated_at timestamptz default now();

create table if not exists public.marketing_metrics (
  id text primary key default gen_random_uuid()::text,
  keyword text,
  search_rank integer,
  organic_growth numeric(6, 2),
  backlinks integer,
  updated_at timestamptz not null default now()
);

alter table public.marketing_metrics add column if not exists keyword text;
alter table public.marketing_metrics add column if not exists search_rank integer;
alter table public.marketing_metrics add column if not exists organic_growth numeric(6, 2);
alter table public.marketing_metrics add column if not exists backlinks integer;
alter table public.marketing_metrics add column if not exists updated_at timestamptz default now();

create table if not exists public.fleet_vehicles (
  id text primary key default gen_random_uuid()::text,
  vehicle_type text not null,
  license_plate text not null,
  driver_id uuid references public.profiles(id) on delete set null,
  status text not null default 'available',
  location_lat numeric(9, 6),
  location_lng numeric(9, 6),
  location_address text,
  last_maintenance date,
  next_maintenance date,
  total_deliveries integer not null default 0,
  total_earnings numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.fleet_vehicles add column if not exists vehicle_type text;
alter table public.fleet_vehicles add column if not exists license_plate text;
alter table public.fleet_vehicles add column if not exists driver_id uuid;
alter table public.fleet_vehicles add column if not exists status text;
alter table public.fleet_vehicles add column if not exists location_lat numeric(9, 6);
alter table public.fleet_vehicles add column if not exists location_lng numeric(9, 6);
alter table public.fleet_vehicles add column if not exists location_address text;
alter table public.fleet_vehicles add column if not exists last_maintenance date;
alter table public.fleet_vehicles add column if not exists next_maintenance date;
alter table public.fleet_vehicles add column if not exists total_deliveries integer default 0;
alter table public.fleet_vehicles add column if not exists total_earnings numeric(12, 2) default 0;
alter table public.fleet_vehicles add column if not exists created_at timestamptz default now();
alter table public.fleet_vehicles add column if not exists updated_at timestamptz default now();

alter table public.marketing_campaigns enable row level security;
alter table public.marketing_metrics enable row level security;
alter table public.fleet_vehicles enable row level security;

create policy "Marketing campaigns admin only"
on public.marketing_campaigns for all
using (public.is_admin())
with check (public.is_admin());

create policy "Marketing metrics admin only"
on public.marketing_metrics for all
using (public.is_admin())
with check (public.is_admin());

create policy "Fleet vehicles admin only"
on public.fleet_vehicles for all
using (public.is_admin())
with check (public.is_admin());
