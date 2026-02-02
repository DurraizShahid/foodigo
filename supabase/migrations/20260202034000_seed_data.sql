insert into public.categories (id, name, image_path, image_url)
values
  ('1', 'Pizza', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1534308983496-f36736c7ad0e'),
  ('2', 'Burgers', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1568901346379-8ce8e1c961ad'),
  ('3', 'Sushi', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1579871128790-92d81577358f'),
  ('4', 'Desserts', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1563729781174-e6922947633d'),
  ('5', 'Indian', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1589302168068-96472dcd3802'),
  ('6', 'Mexican', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1504544750206-2c8888f51841')
on conflict (id) do nothing;

insert into public.restaurants (id, owner_id, name, cuisine, rating, delivery_time, price_range, distance_km, tags, image_path, image_url, description, address, is_featured, featured_order)
values
  ('res1', '44444444-4444-4444-4444-444444444444', 'Pizza Palace', 'Italian', 4.5, '30-45 min', '$$', 2.5, array['Family Friendly','Vegetarian Options'], 'placeholders/default.svg', 'https://images.unsplash.com/photo-1513104882054-482eb1504761', 'Authentic Italian pizzas, made with fresh ingredients.', '123 Main St, Cityville', true, 1),
  ('res2', '44444444-4444-4444-4444-444444444444', 'Burger Joint', 'American', 4.2, '20-30 min', '$', 1.8, array['Fast Delivery','Budget Friendly'], 'placeholders/default.svg', 'https://images.unsplash.com/photo-1550547660-d9450f859349', 'Juicy burgers and crispy fries, a true American classic.', '456 Oak Ave, Townsville', true, 2),
  ('res3', '44444444-4444-4444-4444-444444444444', 'Sushi Spot', 'Japanese', 4.8, '40-55 min', '$$$', 4.1, array['Premium','Healthy'], 'placeholders/default.svg', 'https://images.unsplash.com/photo-1582450871420-ad020037202a', 'Freshly prepared sushi and sashimi.', '789 Pine Ln, Villageton', true, 3),
  ('res4', '44444444-4444-4444-4444-444444444444', 'Spice Route', 'Indian', 4.6, '35-50 min', '$$', 3.2, array['Spicy','Vegetarian Friendly','Family Meals'], 'placeholders/default.svg', 'https://images.unsplash.com/photo-1589302168068-96472dcd3802', 'North and South Indian classics with bold spices.', '910 Maple Rd, Midtown', false, null),
  ('res5', '44444444-4444-4444-4444-444444444444', 'Green Bowl', 'Healthy', 4.4, '25-35 min', '$$', 1.2, array['Vegan Options','Low Calorie'], 'placeholders/default.svg', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', 'Build-your-own bowls, smoothies, and cold-pressed juices.', '51 River St, Downtown', false, null)
on conflict (id) do nothing;

insert into public.menu_items (id, restaurant_id, name, price, calories, description, image_path, image_url)
values
  ('m1', 'res1', 'Margherita Pizza', 12.99, 850, 'Classic tomato, mozzarella, and basil.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1594007654729-407edc19256f'),
  ('m2', 'res1', 'Pepperoni Pizza', 14.99, 980, 'Pepperoni, mozzarella, and tomato sauce.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1628840042765-356cda07504e'),
  ('m7', 'res1', 'Truffle Mushroom Pizza', 15.50, 920, 'Wild mushrooms, truffle oil, mozzarella, arugula.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1473093226795-af9932fe5856'),
  ('m3', 'res2', 'Classic Cheeseburger', 10.50, 650, 'Beef patty, cheddar, lettuce, tomato, onion.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1571091718767-18b5b1457edf'),
  ('m4', 'res2', 'Veggie Burger', 9.75, 520, 'Plant-based patty with fresh toppings.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1525059696034-4967a8aa7da1'),
  ('m8', 'res2', 'Smoky BBQ Burger', 12.00, 780, 'Smoked bacon, cheddar, BBQ sauce, crispy onions.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1551782450-17144efb0f26'),
  ('m5', 'res3', 'California Roll', 8.00, 320, 'Crab, avocado, cucumber.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1579584425303-d673c21a0ad7'),
  ('m6', 'res3', 'Spicy Tuna Roll', 9.50, 300, 'Tuna, spicy mayo, cucumber.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1579584425303-d673c21a0ad7'),
  ('m9', 'res3', 'Salmon Nigiri Set', 13.25, 280, 'Fresh salmon nigiri with pickled ginger.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1553621042-f6e147245754'),
  ('m10', 'res4', 'Butter Chicken', 13.99, 640, 'Creamy tomato gravy with tender chicken.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398'),
  ('m11', 'res4', 'Paneer Tikka Masala', 12.50, 580, 'Grilled paneer in spiced gravy.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1543353071-873f17a7a088'),
  ('m12', 'res4', 'Garlic Naan Basket', 5.00, 260, 'Fresh naan with roasted garlic butter.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1512058564366-18510be2db19'),
  ('m13', 'res5', 'Mediterranean Bowl', 11.00, 420, 'Falafel, hummus, quinoa, pickled veggies.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352'),
  ('m14', 'res5', 'Acai Power Bowl', 9.50, 360, 'Acai blend, granola, coconut, berries.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1506089676908-3592f7389d4d'),
  ('m15', 'res5', 'Citrus Glow Juice', 6.75, 120, 'Orange, grapefruit, turmeric, ginger.', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc')
on conflict (id) do nothing;

insert into public.offers (id, image_path, image_url, title, description, display_order)
values
  ('offer1', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', '20% Off Your First Order!', 'Enjoy a special discount on your initial purchase. Limited time offer!', 1),
  ('offer2', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1504754524776-8f4f69908586', 'Free Delivery All Weekend', 'Get your favorite meals delivered to your door for free!', 2),
  ('offer3', 'placeholders/default.svg', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1', 'Buy One Get One Free on Select Items', 'Double the deliciousness! Available at participating restaurants.', 3)
on conflict (id) do nothing;
