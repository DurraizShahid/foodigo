alter table public.scheduled_orders add column if not exists restaurant_name text;
alter table public.group_orders add column if not exists restaurant_name text;
