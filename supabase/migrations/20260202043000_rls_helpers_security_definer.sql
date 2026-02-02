create or replace function public.current_profile_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  )
$$;

create or replace function public.is_restaurant()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.profiles
    where id = auth.uid() and role = 'restaurant'
  )
$$;

create or replace function public.is_driver()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.profiles
    where id = auth.uid() and role = 'driver'
  )
$$;

create or replace function public.is_restaurant_owner(restaurant_id text)
returns boolean
language sql
stable
security definer
set search_path = public
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
security definer
set search_path = public
as $$
  select exists(
    select 1
    from public.group_order_participants p
    where p.group_order_id = group_id and p.user_id = auth.uid()
  )
$$;
