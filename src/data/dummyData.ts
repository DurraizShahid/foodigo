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
    priceRange: "$$",
    distanceKm: 2.5,
    tags: ["Family Friendly", "Vegetarian Options"],
    image: "https://images.unsplash.com/photo-1513104882054-482eb1504761?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnR8ZW58MHwwfHx8MTcxOTk0NTYwNXww&ixlib=rb-4.0.3&q=80&w=1080",
    description: "Authentic Italian pizzas, made with fresh ingredients.",
    address: "123 Main St, Cityville",
    menu: [
      { id: "m1", name: "Margherita Pizza", price: 12.99, calories: 850, description: "Classic tomato, mozzarella, and basil.", image: "https://images.unsplash.com/photo-1594007654729-407edc19256f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxtYXJnaGVyaXRhJTIwcGl6emF8ZW58MHwwfHx8MTcxOTk0NTYwNnww&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m2", name: "Pepperoni Pizza", price: 14.99, calories: 980, description: "Pepperoni, mozzarella, and tomato sauce.", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxwZXBwZXJvbmklMjBwaXp6YSUyMHNsaWNlfGVufDB8fHwxNzE5OTQ1NjA3fDA&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m7", name: "Truffle Mushroom Pizza", price: 15.5, calories: 920, description: "Wild mushrooms, truffle oil, mozzarella, arugula.", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856" },
    ],
  },
  {
    id: "res2",
    name: "Burger Joint",
    cuisine: "American",
    rating: 4.2,
    deliveryTime: "20-30 min",
    priceRange: "$",
    distanceKm: 1.8,
    tags: ["Fast Delivery", "Budget Friendly"],
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxidXJnZXIlMjByZXN0YXVyYW50fGVufDB8MHx8fDE3MTk5NDU2MDh8MA&ixlib=rb-4.0.3&q=80&w=1080",
    description: "Juicy burgers and crispy fries, a true American classic.",
    address: "456 Oak Ave, Townsville",
    menu: [
      { id: "m3", name: "Classic Cheeseburger", price: 10.5, calories: 650, description: "Beef patty, cheddar, lettuce, tomato, onion.", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457edf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxjaGVlc2VidXJnZXJ8ZW58MHwwfHx8MTcxOTk0NTYwOXww&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m4", name: "Veggie Burger", price: 9.75, calories: 520, description: "Plant-based patty with fresh toppings.", image: "https://images.unsplash.com/photo-1525059696034-4967a8aa7da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHZlZ2dpZSUyMGJ1cmdlcnxlbnwwfDB8fHwxNzE5OTQ1NjEwfDA&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m8", name: "Smoky BBQ Burger", price: 12, calories: 780, description: "Smoked bacon, cheddar, BBQ sauce, crispy onions.", image: "https://images.unsplash.com/photo-1551782450-17144efb0f26" },
    ],
  },
  {
    id: "res3",
    name: "Sushi Spot",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "40-55 min",
    priceRange: "$$$",
    distanceKm: 4.1,
    tags: ["Premium", "Healthy"],
    image: "https://images.unsplash.com/photo-1582450871420-ad020037202a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHJlc3RhdXJhbnR8ZW58MHwwfHx8MTcxOTk0NTYxMXww&ixlib=rb-4.0.3&q=80&w=1080",
    description: "Freshly prepared sushi and sashimi.",
    address: "789 Pine Ln, Villageton",
    menu: [
      { id: "m5", name: "California Roll", price: 8.0, calories: 320, description: "Crab, avocado, cucumber.", image: "https://images.unsplash.com/photo-1579584425303-d673c21a0ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHxjYWxpZm9ybmlhJTIwcm9sbHxlbnwwfDB8fHwxNzE5OTQ1NjEyfDA&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m6", name: "Spicy Tuna Roll", price: 9.5, calories: 300, description: "Tuna, spicy mayo, cucumber.", image: "https://images.unsplash.com/photo-1579584425303-d673c21a0ad7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNwaWN5JTIwdHVuYSUyMHJvbGx8ZW58MHwwfHx8MTcxOTk0NTYxM3ww&ixlib=rb-4.0.3&q=80&w=1080" },
      { id: "m9", name: "Salmon Nigiri Set", price: 13.25, calories: 280, description: "Fresh salmon nigiri with pickled ginger.", image: "https://images.unsplash.com/photo-1553621042-f6e147245754" },
    ],
  },
  {
    id: "res4",
    name: "Spice Route",
    cuisine: "Indian",
    rating: 4.6,
    deliveryTime: "35-50 min",
    priceRange: "$$",
    distanceKm: 3.2,
    tags: ["Spicy", "Vegetarian Friendly", "Family Meals"],
    image: "https://images.unsplash.com/photo-1589302168068-96472dcd3802",
    description: "North and South Indian classics with bold spices.",
    address: "910 Maple Rd, Midtown",
    menu: [
      { id: "m10", name: "Butter Chicken", price: 13.99, calories: 640, description: "Creamy tomato gravy with tender chicken.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398" },
      { id: "m11", name: "Paneer Tikka Masala", price: 12.5, calories: 580, description: "Grilled paneer in spiced gravy.", image: "https://images.unsplash.com/photo-1543353071-873f17a7a088" },
      { id: "m12", name: "Garlic Naan Basket", price: 5.0, calories: 260, description: "Fresh naan with roasted garlic butter.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19" },
    ],
  },
  {
    id: "res5",
    name: "Green Bowl",
    cuisine: "Healthy",
    rating: 4.4,
    deliveryTime: "25-35 min",
    priceRange: "$$",
    distanceKm: 1.2,
    tags: ["Vegan Options", "Low Calorie"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    description: "Build-your-own bowls, smoothies, and cold-pressed juices.",
    address: "51 River St, Downtown",
    menu: [
      { id: "m13", name: "Mediterranean Bowl", price: 11.0, calories: 420, description: "Falafel, hummus, quinoa, pickled veggies.", image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352" },
      { id: "m14", name: "Acai Power Bowl", price: 9.5, calories: 360, description: "Acai blend, granola, coconut, berries.", image: "https://images.unsplash.com/photo-1506089676908-3592f7389d4d" },
      { id: "m15", name: "Citrus Glow Juice", price: 6.75, calories: 120, description: "Orange, grapefruit, turmeric, ginger.", image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc" },
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
  { id: "user1", name: "Alice Smith", email: "alice@example.com", avatar: "https://i.pravatar.cc/150?img=47" },
  { id: "user2", name: "Bob Johnson", email: "bob@example.com", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "user3", name: "Carlos Rivera", email: "carlos@example.com", avatar: "https://i.pravatar.cc/150?img=23" },
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

export const scheduledOrders = [
  {
    id: "sched1",
    userId: "user1",
    restaurantId: "res4",
    restaurantName: "Spice Route",
    deliveryTime: "2025-01-30T18:30:00Z",
    address: "123 Main St, Cityville",
    items: [
      { menuItemId: "m10", name: "Butter Chicken", quantity: 1, price: 13.99 },
      { menuItemId: "m12", name: "Garlic Naan Basket", quantity: 2, price: 5.0 },
    ],
    status: "Scheduled",
    notes: "Ring the doorbell twice",
  },
  {
    id: "sched2",
    userId: "user2",
    restaurantId: "res3",
    restaurantName: "Sushi Spot",
    deliveryTime: "2025-02-01T12:15:00Z",
    address: "456 Oak Ave, Townsville",
    items: [
      { menuItemId: "m5", name: "California Roll", quantity: 2, price: 8.0 },
      { menuItemId: "m9", name: "Salmon Nigiri Set", quantity: 1, price: 13.25 },
    ],
    status: "Scheduled",
    notes: "Call when arriving",
  },
];

export const groupOrders = [
  {
    id: "group1",
    hostId: "user1",
    restaurantId: "res2",
    restaurantName: "Burger Joint",
    inviteCode: "FOOD-7281",
    status: "Collecting",
    closesAt: "2025-01-27T19:00:00Z",
    participants: [
      {
        userId: "user1",
        name: "Alice Smith",
        items: [
          { menuItemId: "m4", name: "Veggie Burger", quantity: 1, price: 9.75 },
          { menuItemId: "m8", name: "Smoky BBQ Burger", quantity: 1, price: 12.0 },
        ],
        total: 21.75,
      },
      {
        userId: "user2",
        name: "Bob Johnson",
        items: [{ menuItemId: "m3", name: "Classic Cheeseburger", quantity: 2, price: 10.5 }],
        total: 21.0,
      },
    ],
    fees: {
      delivery: 4.5,
      service: 2.0,
    },
  },
];

export const subscriptions = [
  {
    userId: "user1",
    tier: "Gold",
    perks: ["Free delivery", "Priority support", "Exclusive offers"],
    renewalDate: "2025-02-05",
    monthlyFee: 9.99,
    active: true,
  },
  {
    userId: "user2",
    tier: "Free",
    perks: ["Standard delivery"],
    renewalDate: null,
    monthlyFee: 0,
    active: false,
  },
];

export const loyaltyRewards = [
  {
    userId: "user1",
    points: 420,
    nextRewardAt: 500,
    badges: ["Early Bird", "Super Sharer"],
    recentActivity: [
      { id: "lr1", label: "Order #3521", points: 50, date: "2025-01-22" },
      { id: "lr2", label: "Referred a friend", points: 100, date: "2025-01-18" },
    ],
  },
  {
    userId: "user2",
    points: 110,
    nextRewardAt: 200,
    badges: ["Food Explorer"],
    recentActivity: [{ id: "lr3", label: "Order #3510", points: 40, date: "2025-01-12" }],
  },
];

export const recommendationSeeds = [
  {
    id: "rec1",
    title: "Because you loved pizza night",
    description: "Top-rated Italian picks near you",
    restaurantIds: ["res1", "res4"],
  },
  {
    id: "rec2",
    title: "Healthy picks for weekday lunches",
    description: "Low-calorie bowls and wraps",
    restaurantIds: ["res5"],
  },
];

export const smartCollections = [
  {
    id: "col1",
    title: "Continue your order",
    subtitle: "Quick access to your recent favorites",
    items: [
      { restaurantId: "res1", menuItemId: "m7", name: "Truffle Mushroom Pizza", eta: "25-35 min" },
      { restaurantId: "res4", menuItemId: "m10", name: "Butter Chicken", eta: "30-40 min" },
    ],
  },
  {
    id: "col2",
    title: "Power Lunch Loop",
    subtitle: "Balanced meals under 600 calories",
    items: [
      { restaurantId: "res5", menuItemId: "m13", name: "Mediterranean Bowl", eta: "20-25 min" },
      { restaurantId: "res5", menuItemId: "m14", name: "Acai Power Bowl", eta: "15-20 min" },
    ],
  },
];

export const paymentVault = [
  { id: "card1", brand: "Visa", last4: "1234", exp: "08/27", primary: true },
  { id: "card2", brand: "Mastercard", last4: "5678", exp: "03/26", primary: false },
];

export const paymentProviders = [
  { id: "stripe", name: "Stripe", status: "Connected", lastSync: "2 min ago" },
  { id: "paypal", name: "PayPal", status: "Connected", lastSync: "5 min ago" },
  { id: "adyen", name: "Adyen", status: "Sandbox", lastSync: "12 hrs ago" },
];

export const pushEventTemplates = [
  { id: "evt1", channel: "push", title: "Order on the way", body: "Driver Alex just picked up your food." },
  { id: "evt2", channel: "sms", title: "Driver arriving", body: "I'm outside with your order." },
  { id: "evt3", channel: "email", title: "Weekly digest", body: "3 new restaurants joined your city." },
];

export const restaurantAnalytics = {
  salesTrend: [
    { label: "Mon", value: 820 },
    { label: "Tue", value: 910 },
    { label: "Wed", value: 760 },
    { label: "Thu", value: 1040 },
    { label: "Fri", value: 1320 },
    { label: "Sat", value: 1580 },
    { label: "Sun", value: 990 },
  ],
  topItems: [
    { name: "Truffle Mushroom Pizza", orders: 145, revenue: 2247.5 },
    { name: "Margherita Pizza", orders: 120, revenue: 1558.8 },
    { name: "Garlic Naan Basket", orders: 210, revenue: 1050 },
  ],
  payoutHistory: [
    { id: "pay1", amount: 2150.75, status: "Completed", date: "2025-01-22" },
    { id: "pay2", amount: 1985.4, status: "Processing", date: "2025-01-15" },
    { id: "pay3", amount: 1872.1, status: "Completed", date: "2025-01-08" },
  ],
  inventory: [
    { id: "inv1", name: "Fresh Mozzarella", level: 68, status: "healthy" },
    { id: "inv2", name: "Truffle Oil", level: 18, status: "low" },
    { id: "inv3", name: "Gluten-Free Dough", level: 32, status: "medium" },
  ],
  profile: {
    restaurantName: "Pizza Palace",
    phone: "555-123-4567",
    email: "hello@pizzapalace.com",
    hours: "Mon-Sun 10:00 AM - 11:00 PM",
    prepTime: "25 min average",
  },
  promotions: [
    { id: "promo1", name: "Two for Tuesday", type: "BOGO", status: "Active", run: "Jan 10 - Feb 10" },
    { id: "promo2", name: "Lunch Combo", type: "Bundle", status: "Draft", run: "Upcoming" },
  ],
};

export const driverStats = {
  earnings: {
    week: [
      { label: "Mon", value: 84 },
      { label: "Tue", value: 95 },
      { label: "Wed", value: 110 },
      { label: "Thu", value: 102 },
      { label: "Fri", value: 140 },
      { label: "Sat", value: 175 },
      { label: "Sun", value: 120 },
    ],
    total: 826,
    completedDeliveries: 42,
    avgRating: 4.86,
  },
  hotspots: [
    { name: "Downtown Plaza", eta: "High demand", distance: "1.2 mi" },
    { name: "North Market", eta: "Moderate demand", distance: "2.8 mi" },
  ],
  incentives: [
    { id: "inc1", title: "Weekend Hustle", requirement: "Complete 15 deliveries", reward: "$35 bonus", progress: 9, target: 15 },
    { id: "inc2", title: "Lunch Rush", requirement: "Earn 4.8+ rating", reward: "$20 bonus", progress: 4.9, target: 5 },
  ],
  chats: [
    { id: "chat1", name: "Pizza Palace", snippet: "Order ready at counter 2.", time: "2m ago" },
    { id: "chat2", name: "Customer • Olivia", snippet: "Please leave at lobby desk.", time: "8m ago" },
  ],
};

export const adminInsights = {
  revenue: [
    { label: "Week 1", value: 18200 },
    { label: "Week 2", value: 20150 },
    { label: "Week 3", value: 21480 },
    { label: "Week 4", value: 22890 },
  ],
  cityBreakdown: [
    { city: "Cityville", restaurants: 128, orders: 1820 },
    { city: "Townsville", restaurants: 94, orders: 1420 },
    { city: "Villageton", restaurants: 76, orders: 910 },
  ],
  supportTickets: [
    { id: "ticket1", type: "Delivery Issue", status: "Open", priority: "High" },
    { id: "ticket2", type: "Payout Question", status: "Pending", priority: "Medium" },
    { id: "ticket3", type: "App Feedback", status: "Resolved", priority: "Low" },
  ],
};

export const experiments = [
  { id: "exp1", name: "New checkout flow", segment: "10% of users", status: "Running" },
  { id: "exp2", name: "Hero carousel revamp", segment: "25% of users", status: "Draft" },
];

export const fraudAlerts = [
  { id: "fraud1", type: "Multiple cards", risk: "High", action: "Review", city: "Cityville" },
  { id: "fraud2", type: "Chargeback spike", risk: "Medium", action: "Monitor", city: "Townsville" },
];

export const cityOperations = [
  { id: "city1", name: "Cityville", status: "Online", surge: "Low" },
  { id: "city2", name: "Townsville", status: "Online", surge: "Medium" },
  { id: "city3", name: "Villageton", status: "Maintenance", surge: "N/A" },
];