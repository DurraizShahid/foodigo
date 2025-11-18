export const categories = [
  { id: "1", name: "Pizza", image: "https://images.unsplash.com/photo-1534308983496-f36736c7ad0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxwaXp6YXxlbnwwfDB8fHwxNzE5OTQ1NjAwfDA&ixlib=rb-4.0.3&q=80&w=1080" },
  { id: "2", name: "Burgers", image: "https://images.unsplash.com/photo-1568901346379-8ce8e1c961ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxidXJnZXJzfGVufDB8MHx8fDE3MTk5NDU2MDF8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { id: "3", name: "Sushi", image: "https://images.unsplash.com/photo-1579871128790-92d81577358f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxzdXNoaXxlbnwwfDB8fHwxNzE5OTQ1NjAyfDA&ixlib=rb-4.0.3&q=80&w=1080" },
  { id: "4", name: "Desserts", image: "https://images.unsplash.com/photo-1563729781174-e6922947633d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxkZXNzZXJ0c3xlbnwwfDB8fHwxNzE5OTQ1NjAzfDA&ixlib=rb-4.0.3&q=80&w=1080" },
  { id: "5", name: "Indian", image: "https://images.unsplash.com/photo-1589302168068-96472dcd3802?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxpbmRpYW4lMjBmb29kfGVufDB8MHx8fDE3MTk5NDU2MDN8MA&ixlib=rb-4.0.3&q=80&w=1080" },
  { id: "6", name: "Mexican", image: "https://images.unsplash.com/photo-1504544750206-2c8888f51841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxtZXhpY2FuJTIwZm9vZHxlbnwwfDB8fHwxNzE5OTQ1NjA0fDA&ixlib=rb-4.0.3&q=80&w=1080" },
];

export const restaurants = [
  {
    id: "res1",
    name: "Pizza Palace",
    cuisine: "Italian",
    rating: 4.5,
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1513104882054-482eb1504761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHwwfHx8MTcxOTk0NTYwNXww&ixlib=rb-4.0.3&q=80&w=1080",
    description: "Authentic Italian pizzas, made with fresh ingredients.",
    address: "123 Main St, Cityville",
    menu: [
      { id: "m1", name: "Margherita Pizza", price: 12.99, description: "Classic tomato, mozzarella, and basil.", image: "https://images.unsplash.com/photo-1594007654729-407edc19256f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MHwwfHx8MTcxOTk0NTYwNnww&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m2", name: "Pepperoni Pizza", price: 14.99, description: "Pepperoni, mozzarella, and tomato sauce.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxwZXBwZXJvbmklMjBwaXp6YSUyMHNsaWNlfGVufDB8fHwxNzE5OTQ1NjA3fDA&ixlib=rb-4.0.3&q=80&w=1080" },
    ],
  },
  {
    id: "res2",
    name: "Burger Joint",
    cuisine: "American",
    rating: 4.2,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDB8MHx8fDE3MTk5NDU2MDh8MA&ixlib=rb-4.0.3&q=80&w=1080",
    description: "Juicy burgers and crispy fries, a true American classic.",
    address: "456 Oak Ave, Townsville",
    menu: [
      { id: "m3", name: "Classic Cheeseburger", price: 10.50, description: "Beef patty, cheddar, lettuce, tomato, onion.", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457edf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxjaGVlc2VidXJnZXJ8ZW58MHwwfHx8MTcxOTk0NTYwOXww&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m4", name: "Veggie Burger", price: 9.75, description: "Plant-based patty with fresh toppings.", image: "https://images.unsplash.com/photo-1525059696034-4967a8aa7da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHZlZ2dpZSUyMGJ1cmdlcnxlbnwwfDB8fHwxNzE5OTQ1NjEwfDA&ixlib=rb-4.0.3&q=80&w=1080" },
    ],
  },
  {
    id: "res3",
    name: "Sushi Spot",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "40-55 min",
    image: "https://images.unsplash.com/photo-1582450871420-ad020037202a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJlc3RhdXJhbnR8ZW58MHwwfHx8MTcxOTk0NTYxMXww&ixlib=rb-4.0.3&q=80&w=1080",
    description: "Freshly prepared sushi and sashimi.",
    address: "789 Pine Ln, Villageton",
    menu: [
      { id: "m5", name: "California Roll", price: 8.00, description: "Crab, avocado, cucumber.", image: "https://images.unsplash.com/photo-1579584425303-d673c21a0ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxjYWxpZm9ybmlhJTIwcm9sbHxlbnwwfDB8fHwxNzE5OTQ1NjEyfDA&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m6", name: "Spicy Tuna Roll", price: 9.50, description: "Tuna, spicy mayo, cucumber.", image: "https://images.unsplash.com/photo-1579584425303-d673c21a0ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNwaWN5JTIwdHVuYSUyMHJvbGx8ZW58MHwwfHx8MTcxOTk0NTYxM3ww&ixlib=rb-4.0.3&q=80&w=1080" },
    ],
  },
];

export const orders = [
  {
    id: "ord1",
    userId: "user1",
    restaurantId: "res1",
    items: [
      { menuItemId: "m1", name: "Margherita Pizza", quantity: 1, price: 12.99 },
    ],
    total: 12.99,
    status: "Pending",
    createdAt: "2023-10-26T10:00:00Z",
  },
  {
    id: "ord2",
    userId: "user2",
    restaurantId: "res2",
    items: [
      { menuItemId: "m3", name: "Classic Cheeseburger", quantity: 2, price: 10.50 },
    ],
    total: 21.00,
    status: "Delivered",
    createdAt: "2023-10-25T14:30:00Z",
  },
];

export const users = [
  { id: "user1", name: "Alice Smith", email: "alice@example.com" },
  { id: "user2", name: "Bob Johnson", email: "bob@example.com" },
];

export const offers = [
  {
    id: "offer1",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZGluaW5nJTIwZGVhbHxlbnwwfDB8fHwxNzE5OTQ1NjE1fDA&ixlib=rb-4.0.3&q=80&w=1080",
    title: "20% Off Your First Order!",
    description: "Enjoy a special discount on your initial purchase. Limited time offer!",
  },
  {
    id: "offer2",
    image: "https://images.unsplash.com/photo-1504754524776-8f4f69908586?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxmcmVlJTIwZGVsaXZlcnl8ZW58MHwwfHx8MTcxOTk0NTYxNnww&ixlib=rb-4.0.3&q=80&w=1080",
    title: "Free Delivery All Weekend",
    description: "Get your favorite meals delivered to your door for free!",
  },
  {
    id: "offer3",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMG9mZmVyfGVufDB8MHx8fDE3MTk5NDU2MTd8MA&ixlib=rb-4.0.3&q=80&w=1080",
    title: "Buy One Get One Free on Select Items",
    description: "Double the deliciousness! Available at participating restaurants.",
  },
];