-- Seed auth users (dev-only)
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) values
(
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'alice@example.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Alice Smith","role":"customer","avatar_url":"https://i.pravatar.cc/150?img=47"}',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'authenticated',
  'authenticated',
  'bob@example.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Bob Johnson","role":"customer","avatar_url":"https://i.pravatar.cc/150?img=12"}',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'authenticated',
  'authenticated',
  'carlos@example.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Carlos Rivera","role":"restaurant","avatar_url":"https://i.pravatar.cc/150?img=23"}',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000000',
  '44444444-4444-4444-4444-444444444444',
  'authenticated',
  'authenticated',
  'diana@example.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Diana Driver","role":"driver","avatar_url":"https://i.pravatar.cc/150?img=32"}',
  now(),
  now()
),
(
  '00000000-0000-0000-0000-000000000000',
  '55555555-5555-5555-5555-555555555555',
  'authenticated',
  'authenticated',
  'admin@foodigo.com',
  extensions.crypt('Password123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Ava Admin","role":"admin","avatar_url":"https://i.pravatar.cc/150?img=5"}',
  now(),
  now()
)
on conflict do nothing;

insert into auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) values
(
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  jsonb_build_object('sub','11111111-1111-1111-1111-111111111111','email','alice@example.com'),
  'email',
  '11111111-1111-1111-1111-111111111111',
  now(),
  now(),
  now()
),
(
  gen_random_uuid(),
  '22222222-2222-2222-2222-222222222222',
  jsonb_build_object('sub','22222222-2222-2222-2222-222222222222','email','bob@example.com'),
  'email',
  '22222222-2222-2222-2222-222222222222',
  now(),
  now(),
  now()
),
(
  gen_random_uuid(),
  '33333333-3333-3333-3333-333333333333',
  jsonb_build_object('sub','33333333-3333-3333-3333-333333333333','email','carlos@example.com'),
  'email',
  '33333333-3333-3333-3333-333333333333',
  now(),
  now(),
  now()
),
(
  gen_random_uuid(),
  '44444444-4444-4444-4444-444444444444',
  jsonb_build_object('sub','44444444-4444-4444-4444-444444444444','email','diana@example.com'),
  'email',
  '44444444-4444-4444-4444-444444444444',
  now(),
  now(),
  now()
),
(
  gen_random_uuid(),
  '55555555-5555-5555-5555-555555555555',
  jsonb_build_object('sub','55555555-5555-5555-5555-555555555555','email','admin@foodigo.com'),
  'email',
  '55555555-5555-5555-5555-555555555555',
  now(),
  now(),
  now()
)
on conflict do nothing;

insert into public.profiles (id, email, name, avatar_url, role) values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', 'Alice Smith', 'https://i.pravatar.cc/150?img=47', 'customer'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', 'Bob Johnson', 'https://i.pravatar.cc/150?img=12', 'customer'),
  ('33333333-3333-3333-3333-333333333333', 'carlos@example.com', 'Carlos Rivera', 'https://i.pravatar.cc/150?img=23', 'restaurant'),
  ('44444444-4444-4444-4444-444444444444', 'diana@example.com', 'Diana Driver', 'https://i.pravatar.cc/150?img=32', 'driver'),
  ('55555555-5555-5555-5555-555555555555', 'admin@foodigo.com', 'Ava Admin', 'https://i.pravatar.cc/150?img=5', 'admin')
on conflict do nothing;

-- Categories
insert into public.categories (id, name, image_url) values
  ('1', 'Pizza', 'https://images.unsplash.com/photo-1534308983496-f36736c7ad0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxwaXp6YXxlbnwwfDB8fHwxNzE5OTQ1NjAwfDA&ixlib=rb-4.0.3&q=80&w=1080'),
  ('2', 'Burgers', 'https://images.unsplash.com/photo-1568901346379-8ce8e1c961ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxidXJnZXJzfGVufDB8MHx8fDE3MTk5NDU2MDF8MA&ixlib=rb-4.0.3&q=80&w=1080'),
  ('3', 'Sushi', 'https://images.unsplash.com/photo-1579871128790-92d81577358f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxzdXNoaXxlbnwwfDB8fHwxNzE5OTQ1NjAyfDA&ixlib=rb-4.0.3&q=80&w=1080'),
  ('4', 'Desserts', 'https://images.unsplash.com/photo-1563729781174-e6922947633d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0c3xlbnwwfDB8fHwxNzE5OTQ1NjAzfDA&ixlib=rb-4.0.3&q=80&w=1080'),
  ('5', 'Indian', 'https://images.unsplash.com/photo-1589302168068-96472dcd3802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxpbmRpYW4lMjBmb29kfGVufDB8MHx8fDE3MTk5NDU2MDN8MA&ixlib=rb-4.0.3&q=80&w=1080'),
  ('6', 'Mexican', 'https://images.unsplash.com/photo-1504544750206-2c8888f51841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxtZXhpY2FuJTIwZm9vZHxlbnwwfDB8fHwxNzE5OTQ1NjA0fDA&ixlib=rb-4.0.3&q=80&w=1080');

-- Restaurants
insert into public.restaurants (id, owner_profile_id, name, cuisine, rating, delivery_time, price_range, distance_km, tags, image_url, description, address) values
  ('res1', '33333333-3333-3333-3333-333333333333', 'Pizza Palace', 'Italian', 4.5, '30-45 min', '$$', 2.5, array['Family Friendly','Vegetarian Options'], 'https://images.unsplash.com/photo-1513104882054-482eb1504761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHwwfHx8MTcxOTk0NTYwNXww&ixlib=rb-4.0.3&q=80&w=1080', 'Authentic Italian pizzas, made with fresh ingredients.', '123 Main St, Cityville'),
  ('res2', '33333333-3333-3333-3333-333333333333', 'Burger Joint', 'American', 4.2, '20-30 min', '$', 1.8, array['Fast Delivery','Budget Friendly'], 'https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDB8MHx8fDE3MTk5NDU2MDh8MA&ixlib=rb-4.0.3&q=80&w=1080', 'Juicy burgers and crispy fries, a true American classic.', '456 Oak Ave, Townsville'),
  ('res3', '33333333-3333-3333-3333-333333333333', 'Sushi Spot', 'Japanese', 4.8, '40-55 min', '$$$', 4.1, array['Premium','Healthy'], 'https://images.unsplash.com/photo-1582450871420-ad020037202a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJlc3RhdXJhbnR8ZW58MHwwfHx8MTcxOTk0NTYxMXww&ixlib=rb-4.0.3&q=80&w=1080', 'Freshly prepared sushi and sashimi.', '789 Pine Ln, Villageton'),
  ('res4', '33333333-3333-3333-3333-333333333333', 'Spice Route', 'Indian', 4.6, '35-50 min', '$$', 3.2, array['Spicy','Vegetarian Friendly','Family Meals'], 'https://images.unsplash.com/photo-1589302168068-96472dcd3802', 'North and South Indian classics with bold spices.', '910 Maple Rd, Midtown'),
  ('res5', '33333333-3333-3333-3333-333333333333', 'Green Bowl', 'Healthy', 4.4, '25-35 min', '$$', 1.2, array['Vegan Options','Low Calorie'], 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'Build-your-own bowls, smoothies, and cold-pressed juices.', '51 River St, Downtown');

-- Menu items
insert into public.menu_items (id, restaurant_id, name, price, calories, description, image_url) values
  ('m1', 'res1', 'Margherita Pizza', 12.99, 850, 'Classic tomato, mozzarella, and basil.', 'https://images.unsplash.com/photo-1594007654729-407edc19256f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MHwwfHx8MTcxOTk0NTYwNnww&ixlib=rb-4.0.3&q=80&w=1080'),
  ('m2', 'res1', 'Pepperoni Pizza', 14.99, 980, 'Pepperoni, mozzarella, and tomato sauce.', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxwZXBwZXJvbmklMjBwaXp6YSUyMHNsaWNlfGVufDB8fHwxNzE5OTQ1NjA3fDA&ixlib=rb-4.0.3&q=80&w=1080'),
  ('m7', 'res1', 'Truffle Mushroom Pizza', 15.50, 920, 'Wild mushrooms, truffle oil, mozzarella, arugula.', 'https://images.unsplash.com/photo-1473093226795-af9932fe5856'),
  ('m3', 'res2', 'Classic Cheeseburger', 10.50, 650, 'Beef patty, cheddar, lettuce, tomato, onion.', 'https://images.unsplash.com/photo-1571091718767-18b5b1457edf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxjaGVlc2VidXJnZXJ8ZW58MHwwfHx8MTcxOTk0NTYwOXww&ixlib=rb-4.0.3&q=80&w=1080'),
  ('m4', 'res2', 'Veggie Burger', 9.75, 520, 'Plant-based patty with fresh toppings.', 'https://images.unsplash.com/photo-1525059696034-4967a8aa7da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHZlZ2dpZSUyMGJ1cmdlcnxlbnwwfDB8fHwxNzE5OTQ1NjEwfDA&ixlib=rb-4.0.3&q=80&w=1080'),
  ('m8', 'res2', 'Smoky BBQ Burger', 12.00, 780, 'Smoked bacon, cheddar, BBQ sauce, crispy onions.', 'https://images.unsplash.com/photo-1551782450-17144efb0f26'),
  ('m5', 'res3', 'California Roll', 8.00, 320, 'Crab, avocado, cucumber.', 'https://images.unsplash.com/photo-1579584425303-d673c21a0ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxjYWxpZm9ybmlhJTIwcm9sbHxlbnwwfDB8fHwxNzE5OTQ1NjEyfDA&ixlib=rb-4.0.3&q=80&w=1080'),
  ('m6', 'res3', 'Spicy Tuna Roll', 9.50, 300, 'Tuna, spicy mayo, cucumber.', 'https://images.unsplash.com/photo-1579584425303-d673c21a0ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNwaWN5JTIwdHVuYSUyMHJvbGx8ZW58MHwwfHx8MTcxOTk0NTYxM3ww&ixlib=rb-4.0.3&q=80&w=1080'),
  ('m9', 'res3', 'Salmon Nigiri Set', 13.25, 280, 'Fresh salmon nigiri with pickled ginger.', 'https://images.unsplash.com/photo-1553621042-f6e147245754'),
  ('m10', 'res4', 'Butter Chicken', 13.99, 640, 'Creamy tomato gravy with tender chicken.', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398'),
  ('m11', 'res4', 'Paneer Tikka Masala', 12.50, 580, 'Grilled paneer in spiced gravy.', 'https://images.unsplash.com/photo-1543353071-873f17a7a088'),
  ('m12', 'res4', 'Garlic Naan Basket', 5.00, 260, 'Fresh naan with roasted garlic butter.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19'),
  ('m13', 'res5', 'Mediterranean Bowl', 11.00, 420, 'Falafel, hummus, quinoa, pickled veggies.', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352'),
  ('m14', 'res5', 'Acai Power Bowl', 9.50, 360, 'Acai blend, granola, coconut, berries.', 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d'),
  ('m15', 'res5', 'Citrus Glow Juice', 6.75, 120, 'Orange, grapefruit, turmeric, ginger.', 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc');

-- Offers
insert into public.offers (id, image_url, title, description) values
  ('offer1', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nJTIwZGVhbHxlbnwwfDB8fHwxNzE5OTQ1NjE1fDA&ixlib=rb-4.0.3&q=80&w=1080', '20% Off Your First Order!', 'Enjoy a special discount on your initial purchase. Limited time offer!'),
  ('offer2', 'https://images.unsplash.com/photo-1504754524776-8f4f69908586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxmcmVlJTIwZGVsaXZlcnl8ZW58MHwwfHx8MTcxOTk0NTYxNnww&ixlib=rb-4.0.3&q=80&w=1080', 'Free Delivery All Weekend', 'Get your favorite meals delivered to your door for free!'),
  ('offer3', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxiaXJ0aGRheSUyMG9mZmVyfGVufDB8MHx8fDE3MTk5NDU2MTd8MA&ixlib=rb-4.0.3&q=80&w=1080', 'Buy One Get One Free on Select Items', 'Double the deliciousness! Available at participating restaurants.');

-- Orders
insert into public.orders (id, user_id, restaurant_id, total, status, created_at) values
  ('ord1', '11111111-1111-1111-1111-111111111111', 'res1', 12.99, 'Pending', '2023-10-26T10:00:00Z'),
  ('ord2', '22222222-2222-2222-2222-222222222222', 'res2', 21.00, 'Delivered', '2023-10-25T14:30:00Z');

insert into public.order_items (order_id, menu_item_id, name, quantity, price) values
  ('ord1', 'm1', 'Margherita Pizza', 1, 12.99),
  ('ord2', 'm3', 'Classic Cheeseburger', 2, 10.50);

-- Scheduled orders
insert into public.scheduled_orders (id, user_id, restaurant_id, restaurant_name, delivery_time, address, status, notes) values
  ('sched1', '11111111-1111-1111-1111-111111111111', 'res4', 'Spice Route', '2025-01-30T18:30:00Z', '123 Main St, Cityville', 'Scheduled', 'Ring the doorbell twice'),
  ('sched2', '22222222-2222-2222-2222-222222222222', 'res3', 'Sushi Spot', '2025-02-01T12:15:00Z', '456 Oak Ave, Townsville', 'Scheduled', 'Call when arriving');

insert into public.scheduled_order_items (scheduled_order_id, menu_item_id, name, quantity, price) values
  ('sched1', 'm10', 'Butter Chicken', 1, 13.99),
  ('sched1', 'm12', 'Garlic Naan Basket', 2, 5.00),
  ('sched2', 'm5', 'California Roll', 2, 8.00),
  ('sched2', 'm9', 'Salmon Nigiri Set', 1, 13.25);

-- Group orders
insert into public.group_orders (id, host_id, restaurant_id, restaurant_name, invite_code, status, closes_at, delivery_fee, service_fee) values
  ('group1', '11111111-1111-1111-1111-111111111111', 'res2', 'Burger Joint', 'FOOD-7281', 'Collecting', '2025-01-27T19:00:00Z', 4.50, 2.00);

insert into public.group_order_participants (id, group_order_id, user_id, name, total) values
  (1, 'group1', '11111111-1111-1111-1111-111111111111', 'Alice Smith', 21.75),
  (2, 'group1', '22222222-2222-2222-2222-222222222222', 'Bob Johnson', 21.00);

insert into public.group_order_participant_items (participant_id, menu_item_id, name, quantity, price) values
  (1, 'm4', 'Veggie Burger', 1, 9.75),
  (1, 'm8', 'Smoky BBQ Burger', 1, 12.00),
  (2, 'm3', 'Classic Cheeseburger', 2, 10.50);

-- Subscriptions
insert into public.subscriptions (user_id, tier, perks, renewal_date, monthly_fee, active) values
  ('11111111-1111-1111-1111-111111111111', 'Gold', array['Free delivery','Priority support','Exclusive offers'], '2025-02-05', 9.99, true),
  ('22222222-2222-2222-2222-222222222222', 'Free', array['Standard delivery'], null, 0.00, false);

-- Loyalty
insert into public.loyalty_rewards (id, user_id, points, next_reward_at, badges) values
  (1, '11111111-1111-1111-1111-111111111111', 420, 500, array['Early Bird','Super Sharer']),
  (2, '22222222-2222-2222-2222-222222222222', 110, 200, array['Food Explorer']);

insert into public.loyalty_activity (id, loyalty_reward_id, label, points, activity_date) values
  ('lr1', 1, 'Order #3521', 50, '2025-01-22'),
  ('lr2', 1, 'Referred a friend', 100, '2025-01-18'),
  ('lr3', 2, 'Order #3510', 40, '2025-01-12');

-- Recommendations
insert into public.recommendation_seeds (id, title, description) values
  ('rec1', 'Because you loved pizza night', 'Top-rated Italian picks near you'),
  ('rec2', 'Healthy picks for weekday lunches', 'Low-calorie bowls and wraps');

insert into public.recommendation_seed_restaurants (recommendation_id, restaurant_id) values
  ('rec1', 'res1'),
  ('rec1', 'res4'),
  ('rec2', 'res5');

insert into public.smart_collections (id, title, subtitle) values
  ('col1', 'Continue your order', 'Quick access to your recent favorites'),
  ('col2', 'Power Lunch Loop', 'Balanced meals under 600 calories');

insert into public.smart_collection_items (collection_id, restaurant_id, menu_item_id, name, eta) values
  ('col1', 'res1', 'm7', 'Truffle Mushroom Pizza', '25-35 min'),
  ('col1', 'res4', 'm10', 'Butter Chicken', '30-40 min'),
  ('col2', 'res5', 'm13', 'Mediterranean Bowl', '20-25 min'),
  ('col2', 'res5', 'm14', 'Acai Power Bowl', '15-20 min');

-- Payment data
insert into public.payment_methods (id, brand, last4, exp, is_primary) values
  ('card1', 'Visa', '1234', '08/27', true),
  ('card2', 'Mastercard', '5678', '03/26', false);

insert into public.payment_providers (id, name, status, last_sync) values
  ('stripe', 'Stripe', 'Connected', '2 min ago'),
  ('paypal', 'PayPal', 'Connected', '5 min ago'),
  ('adyen', 'Adyen', 'Sandbox', '12 hrs ago');

-- Push templates
insert into public.push_event_templates (id, channel, title, body) values
  ('evt1', 'push', 'Order on the way', 'Driver Alex just picked up your food.'),
  ('evt2', 'sms', 'Driver arriving', 'I''m outside with your order.'),
  ('evt3', 'email', 'Weekly digest', '3 new restaurants joined your city.');

-- Restaurant analytics for Pizza Palace
insert into public.restaurant_sales_trend (restaurant_id, label, value) values
  ('res1', 'Mon', 820),
  ('res1', 'Tue', 910),
  ('res1', 'Wed', 760),
  ('res1', 'Thu', 1040),
  ('res1', 'Fri', 1320),
  ('res1', 'Sat', 1580),
  ('res1', 'Sun', 990);

insert into public.restaurant_top_items (restaurant_id, name, orders, revenue) values
  ('res1', 'Truffle Mushroom Pizza', 145, 2247.50),
  ('res1', 'Margherita Pizza', 120, 1558.80),
  ('res1', 'Garlic Naan Basket', 210, 1050.00);

insert into public.restaurant_payouts (id, restaurant_id, amount, status, payout_date) values
  ('pay1', 'res1', 2150.75, 'Completed', '2025-01-22'),
  ('pay2', 'res1', 1985.40, 'Processing', '2025-01-15'),
  ('pay3', 'res1', 1872.10, 'Completed', '2025-01-08');

insert into public.restaurant_inventory (
  id,
  restaurant_id,
  name,
  category,
  current_stock,
  min_stock,
  unit,
  auto_out_of_stock,
  last_updated,
  level,
  status
) values
  ('inv1', 'res1', 'Fresh Mozzarella', 'Ingredients', 68, 20, 'kg', false, '2025-01-28T10:00:00Z', 68, 'healthy'),
  ('inv2', 'res1', 'Truffle Oil', 'Ingredients', 18, 25, 'bottles', true, '2025-01-28T10:00:00Z', 18, 'low'),
  ('inv3', 'res1', 'Gluten-Free Dough', 'Ingredients', 32, 20, 'bags', true, '2025-01-27T15:00:00Z', 32, 'medium');

insert into public.restaurant_profile_stats (restaurant_id, restaurant_name, phone, email, hours, prep_time) values
  ('res1', 'Pizza Palace', '555-123-4567', 'hello@pizzapalace.com', 'Mon-Sun 10:00 AM - 11:00 PM', '25 min average');

insert into public.restaurant_promotions (id, restaurant_id, name, type, status, run) values
  ('promo1', 'res1', 'Two for Tuesday', 'BOGO', 'Active', 'Jan 10 - Feb 10'),
  ('promo2', 'res1', 'Lunch Combo', 'Bundle', 'Draft', 'Upcoming');

-- Driver stats for Diana
insert into public.driver_stats (user_id, total, completed_deliveries, avg_rating) values
  ('44444444-4444-4444-4444-444444444444', 826.00, 42, 4.86);

insert into public.driver_earnings_week (user_id, label, value) values
  ('44444444-4444-4444-4444-444444444444', 'Mon', 84),
  ('44444444-4444-4444-4444-444444444444', 'Tue', 95),
  ('44444444-4444-4444-4444-444444444444', 'Wed', 110),
  ('44444444-4444-4444-4444-444444444444', 'Thu', 102),
  ('44444444-4444-4444-4444-444444444444', 'Fri', 140),
  ('44444444-4444-4444-4444-444444444444', 'Sat', 175),
  ('44444444-4444-4444-4444-444444444444', 'Sun', 120);

insert into public.driver_hotspots (user_id, name, eta, distance) values
  ('44444444-4444-4444-4444-444444444444', 'Downtown Plaza', 'High demand', '1.2 mi'),
  ('44444444-4444-4444-4444-444444444444', 'North Market', 'Moderate demand', '2.8 mi');

insert into public.driver_incentives (id, user_id, title, requirement, reward, progress, target) values
  ('inc1', '44444444-4444-4444-4444-444444444444', 'Weekend Hustle', 'Complete 15 deliveries', '$35 bonus', 9, 15),
  ('inc2', '44444444-4444-4444-4444-444444444444', 'Lunch Rush', 'Earn 4.8+ rating', '$20 bonus', 4.9, 5);

insert into public.driver_chats (id, user_id, name, snippet, time) values
  ('chat1', '44444444-4444-4444-4444-444444444444', 'Pizza Palace', 'Order ready at counter 2.', '2m ago'),
  ('chat2', '44444444-4444-4444-4444-444444444444', 'Customer • Olivia', 'Please leave at lobby desk.', '8m ago');

-- Admin insights
insert into public.admin_revenue (label, value) values
  ('Week 1', 18200),
  ('Week 2', 20150),
  ('Week 3', 21480),
  ('Week 4', 22890);

insert into public.admin_city_breakdown (city, restaurants, orders) values
  ('Cityville', 128, 1820),
  ('Townsville', 94, 1420),
  ('Villageton', 76, 910);

insert into public.admin_support_tickets (id, type, status, priority) values
  ('ticket1', 'Delivery Issue', 'Open', 'High'),
  ('ticket2', 'Payout Question', 'Pending', 'Medium'),
  ('ticket3', 'App Feedback', 'Resolved', 'Low');

insert into public.admin_analytics_summary (id, retention_rate, churn_rate, ltv) values
  ('summary', 68, 12, 125.50);

insert into public.admin_analytics_user_growth (month, users, growth) values
  ('Jan', 5000, 0),
  ('Feb', 6500, 30),
  ('Mar', 8200, 26),
  ('Apr', 10000, 22),
  ('May', 12500, 25);

insert into public.admin_analytics_order_trends (day, orders, revenue) values
  ('Mon', 1200, 33000),
  ('Tue', 1350, 37500),
  ('Wed', 1420, 39500),
  ('Thu', 1480, 41000),
  ('Fri', 1850, 51500),
  ('Sat', 1650, 45800),
  ('Sun', 1400, 38900);

insert into public.admin_analytics_top_restaurants (name, orders, revenue, rating) values
  ('Pizza Palace', 2450, 68000, 4.8),
  ('Burger Joint', 1890, 47250, 4.6),
  ('Sushi House', 1650, 49500, 4.9),
  ('Taco Fiesta', 1420, 28400, 4.5);

insert into public.admin_analytics_customer_segments (segment, count, percentage) values
  ('New Customers', 2500, 20),
  ('Regular (1-5 orders)', 5000, 40),
  ('Frequent (6-15 orders)', 3500, 28),
  ('VIP (15+ orders)', 1500, 12);

insert into public.admin_financial_summary (
  id,
  total_revenue,
  monthly_revenue,
  growth,
  total_orders,
  average_order_value,
  commission,
  platform_fees,
  payout_restaurants,
  payout_drivers,
  payout_total,
  net_profit,
  profit_margin
) values
  ('summary', 1250000, 125000, 12.5, 45000, 27.78, 15, 3.5, 950000, 200000, 1150000, 100000, 8);

insert into public.admin_financial_revenue_by_city (city, revenue, orders, growth) values
  ('Cityville', 500000, 18000, 15),
  ('Townsville', 450000, 16000, 10),
  ('Villageton', 300000, 11000, 8);

insert into public.admin_financial_monthly_breakdown (month, revenue, profit) values
  ('Jan', 100000, 8000),
  ('Feb', 110000, 8800),
  ('Mar', 115000, 9200),
  ('Apr', 120000, 9600),
  ('May', 125000, 10000);

insert into public.experiments (
  id,
  name,
  description,
  feature,
  variant_a,
  variant_b,
  status,
  traffic_split,
  participants,
  variant_a_users,
  variant_b_users,
  variant_a_conversion,
  variant_b_conversion,
  start_date,
  end_date,
  segment
) values
  ('EXP-001', 'New Homepage Layout', 'Testing new homepage design vs current', 'Homepage', 'Control (Current)', 'New Design', 'running', 50, 5000, 2500, 2500, 12.5, 15.8, '2025-01-15', null, '50% of users'),
  ('EXP-002', 'Checkout Button Color', 'Testing green vs orange checkout button', 'Checkout', 'Green Button', 'Orange Button', 'paused', 50, 3000, 1500, 1500, 18.2, 16.5, '2025-01-10', null, '50% of users'),
  ('EXP-003', 'Restaurant Card Layout', 'Testing card vs list view for restaurants', 'Restaurant Listings', 'Card View', 'List View', 'draft', 50, 0, 0, 0, 0, 0, null, null, '50% of users');

insert into public.fraud_alerts (
  id,
  type,
  risk,
  action,
  city,
  order_id,
  user_id,
  description,
  detected_at,
  status,
  score
) values
  ('FRAUD-001', 'Multiple Cards', 'high', 'Review', 'Cityville', 'ORD-123', 'user-456', 'User attempted to use 5 different payment cards in 1 hour', '2025-01-28T10:30:00Z', 'new', 85),
  ('FRAUD-002', 'Chargeback Spike', 'medium', 'Monitor', 'Townsville', 'ORD-124', 'user-789', 'Unusual pattern of chargebacks detected', '2025-01-28T09:15:00Z', 'investigating', 65),
  ('FRAUD-003', 'Suspicious Location', 'critical', 'Review', 'Cityville', 'ORD-125', 'user-321', 'Order placed from location inconsistent with user history', '2025-01-28T11:00:00Z', 'new', 95),
  ('FRAUD-004', 'Rapid Orders', 'medium', 'Review', 'Townsville', 'ORD-126', 'user-654', 'User placed 10 orders in 30 minutes', '2025-01-27T15:45:00Z', 'resolved', 55);

insert into public.city_operations (id, name, country, status, surge, restaurants, drivers, orders, revenue) values
  ('city1', 'Cityville', 'USA', 'online', 'low', 45, 120, 1200, 33000),
  ('city2', 'Townsville', 'USA', 'online', 'medium', 38, 95, 980, 27200),
  ('city3', 'Villageton', 'USA', 'maintenance', 'N/A', 25, 60, 0, 0);

insert into public.support_tickets (
  id,
  subject,
  type,
  priority,
  status,
  assigned_to,
  created_at,
  updated_at,
  customer,
  description,
  messages
) values
  (
    'TICK-001',
    'Order #ORD123 Issue',
    'Order Problem',
    'high',
    'open',
    'Agent A',
    '2025-01-28T10:00:00Z',
    '2025-01-28T10:00:00Z',
    'user1@example.com',
    'Order was delivered to wrong address',
    '[{"sender":"Customer","message":"My order was delivered to the wrong address","timestamp":"2025-01-28T10:00:00Z"}]'::jsonb
  ),
  (
    'TICK-002',
    'Refund Request',
    'Refund',
    'medium',
    'in_progress',
    'Agent B',
    '2025-01-27T14:30:00Z',
    '2025-01-28T09:00:00Z',
    'user2@example.com',
    'Requesting refund for cancelled order',
    '[
      {"sender":"Customer","message":"I need a refund for order #ORD456","timestamp":"2025-01-27T14:30:00Z"},
      {"sender":"Agent B","message":"We''re processing your refund request","timestamp":"2025-01-28T09:00:00Z"}
    ]'::jsonb
  ),
  (
    'TICK-003',
    'Payment Issue',
    'Payment',
    'urgent',
    'open',
    'Unassigned',
    '2025-01-28T11:00:00Z',
    '2025-01-28T11:00:00Z',
    'user3@example.com',
    'Payment was charged twice',
    '[{"sender":"Customer","message":"I was charged twice for the same order","timestamp":"2025-01-28T11:00:00Z"}]'::jsonb
  );
