// seed-atlas.js
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

// Load from .env
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const collectionName = process.env.MONGODB_COLLECTION;

if (!uri || !dbName || !collectionName) {
  console.error('Missing required env vars: MONGODB_URI, MONGODB_DB, MONGODB_COLLECTION');
  process.exit(1);
}

async function runMigration() {
  const client = new MongoClient(uri);

  try {
    console.log('Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('Connected!');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Optional: Drop to start fresh
    await collection.drop().catch(err => console.log('Drop skipped (may not exist):', err.message));

    // === 7 FOOD TRUCKS ===
    const trucks = [
      // 1. Sticky Nickies – SALT LAKE CITY, UT
      {
        _id: new ObjectId('6870817751b91c6e4f017ccb'),
        truck_id: 'ft_sticky_nickies_001',
        name: 'Sticky Nickies',
        cuisine: ['American', 'Comfort Food'],
        status: 'Open',
        hours: '11 AM - 9 PM',
        mainLocation: { lat: 40.7608, lng: -111.8910, address: '350 S State St, Salt Lake City, UT 84111' },
        eventLocation: null,
        isAtEvent: false,
        menu: [
          { item: 'Sticky Burger', price: 12, dietary: [], description: 'Double patty, caramelized onions, cheddar, special sauce' },
          { item: 'Loaded Fries', price: 8, dietary: ['Vegetarian'], description: 'Cheese, bacon, ranch, scallions' },
          { item: 'Milkshake', price: 6, dietary: ['Vegetarian'], description: 'Vanilla, chocolate, or strawberry' }
        ],
        phone: '(801) 555-0101',
        email: 'info@stickynickies.com',
        socials: {
          facebook: 'https://facebook.com/stickynickies',
          twitter: 'https://twitter.com/StickyNickies',
          instagram: 'https://instagram.com/stickynickies'
        },
        attending_events: [new ObjectId('6870817751b91c6e4f017ccc')],
        images: [{ url: 'https://yourdomain.com/images/sticky-nickies-slc.jpg', alt: 'Sticky Nickies' }],
        last_updated: new Date().toISOString()
      },

      // 2. Taco King – DENVER, CO
      {
        _id: new ObjectId('6870884bba170373b72d320d'),
        truck_id: 'ft_taco_king_001',
        name: 'Taco King',
        cuisine: ['Mexican', 'Gluten-Free'],
        status: 'Open',
        hours: '10 AM - 8 PM',
        mainLocation: { lat: 39.7618, lng: -105.0205, address: '2900 W 25th Ave, Denver, CO 80211' },
        eventLocation: { lat: 39.7555, lng: -105.0000, address: 'Civic Center Park, Denver Food Truck Festival' },
        isAtEvent: true,
        menu: [
          { item: 'King Trio', price: 9, dietary: [], description: 'Three tacos: carne, pollo, al pastor' },
          { item: 'Shrimp Diablo Taco', price: 4, dietary: [], description: 'Spicy blackened shrimp' },
          { item: 'Veggie King', price: 8, dietary: ['Vegetarian'], description: 'Portobello, beans, avocado' },
          { item: 'Horchata', price: 3, dietary: ['Vegetarian'], description: 'Cinnamon rice drink' }
        ],
        phone: '(720) 555-0102',
        email: 'tacos@tacokingdenver.com',
        socials: { instagram: 'https://instagram.com/tacokingdenver' },
        attending_events: [new ObjectId('6870884bba170373b72d320e')],
        images: [{ url: 'https://yourdomain.com/images/taco-king-denver.jpg', alt: 'Taco King' }],
        last_updated: new Date().toISOString()
      },

      // 3. BBQ Smokehouse – VERNAL, UT
      {
        _id: new ObjectId(),
        truck_id: 'ft_bbq_smokehouse_001',
        name: 'BBQ Smokehouse',
        cuisine: ['BBQ', 'Southern'],
        status: 'Open',
        hours: '11 AM - 10 PM',
        mainLocation: { lat: 40.4555, lng: -109.5287, address: '456 Main St, Vernal, UT 84078' },
        eventLocation: null,
        isAtEvent: false,
        menu: [
          { item: 'Brisket Sandwich', price: 13, dietary: [], description: 'Slow-smoked brisket, pickles, onion' },
          { item: 'Ribs (Full Rack)', price: 28, dietary: [], description: 'St. Louis style, dry rub' },
          { item: 'Cornbread', price: 4, dietary: ['Vegetarian'], description: 'Honey butter' }
        ],
        phone: '(435) 555-0103',
        email: 'smoke@bbqvernal.com',
        socials: { facebook: 'https://facebook.com/bbqsmokehava' },
        attending_events: [],
        images: [{ url: 'https://yourdomain.com/images/bbq-vernal.jpg', alt: 'BBQ Smokehouse' }],
        last_updated: new Date().toISOString()
      },

      // 4. Sushi Wave – LAKE HAVASU CITY, AZ
      {
        _id: new ObjectId(),
        truck_id: 'ft_sushi_wave_001',
        name: 'Sushi Wave',
        cuisine: ['Japanese', 'Sushi'],
        status: 'Open',
        hours: '12 PM - 9 PM',
        mainLocation: { lat: 34.4799, lng: -114.3320, address: '1641 McCulloch Blvd S, Lake Havasu City, AZ 86406' },
        eventLocation: { lat: 34.4750, lng: -114.3400, address: 'London Bridge Beach, Havasu Food Fest' },
        isAtEvent: true,
        menu: [
          { item: 'Dragon Roll', price: 14, dietary: [], description: 'Eel, avocado, tobiko' },
          { item: 'Spicy Tuna Roll', price: 9, dietary: [], description: 'Tuna, sriracha, cucumber' },
          { item: 'Edamame', price: 5, dietary: ['Vegan'], description: 'Steamed & salted' }
        ],
        phone: '(928) 555-0104',
        email: 'roll@sushiwave.com',
        socials: { twitter: 'https://twitter.com/sushiwaveaz', instagram: 'https://instagram.com/sushiwave' },
        attending_events: [new ObjectId()],
        images: [{ url: 'https://yourdomain.com/images/sushi-havasu.jpg', alt: 'Sushi Wave' }],
        last_updated: new Date().toISOString()
      },

      // 5. Boise Burrito Co – BOISE, ID
      {
        _id: new ObjectId(),
        truck_id: 'ft_boise_burrito_001',
        name: 'Boise Burrito Co',
        cuisine: ['Mexican', 'Fusion'],
        status: 'Open',
        hours: '11 AM - 7 PM',
        mainLocation: { lat: 43.6150, lng: -116.2023, address: '800 W Idaho St, Boise, ID 83702' },
        eventLocation: null,
        isAtEvent: false,
        menu: [
          { item: 'Idaho Potato Burrito', price: 10, dietary: ['Vegetarian'], description: 'Crispy potatoes, beans, cheese, salsa verde' },
          { item: 'Carnitas Burrito', price: 11, dietary: [], description: 'Slow-cooked pork, rice, pico' },
          { item: 'Chips & Queso', price: 6, dietary: ['Vegetarian'], description: 'House queso, tortilla chips' }
        ],
        phone: '(208) 555-0105',
        email: 'eat@boiseburrito.com',
        socials: { facebook: 'https://facebook.com/boiseburrito', instagram: 'https://instagram.com/boiseburrito' },
        attending_events: [],
        images: [{ url: 'https://yourdomain.com/images/boise-burrito.jpg', alt: 'Boise Burrito Co' }],
        last_updated: new Date().toISOString()
      },

      // 6. Rocky Mountain Pizza – DENVER, CO
      {
        _id: new ObjectId(),
        truck_id: 'ft_rocky_pizza_001',
        name: 'Rocky Mountain Pizza',
        cuisine: ['Italian', 'Pizza'],
        status: 'Open',
        hours: '4 PM - 11 PM',
        mainLocation: { lat: 39.6767, lng: -104.9617, address: '1234 S University Blvd, Denver, CO 80210' },
        eventLocation: null,
        isAtEvent: false,
        menu: [
          { item: 'Margherita Pie (14")', price: 18, dietary: ['Vegetarian'], description: 'Fresh mozzarella, basil, tomato' },
          { item: 'Meat Lover\'s', price: 22, dietary: [], description: 'Pepperoni, sausage, bacon' },
          { item: 'Garlic Breadsticks', price: 7, dietary: ['Vegetarian'], description: 'With marinara' }
        ],
        phone: '(720) 555-0106',
        email: 'pizza@rockymtnpizza.com',
        socials: { facebook: 'https://facebook.com/rockymtnpizza' },
        attending_events: [new ObjectId()],
        images: [{ url: 'https://yourdomain.com/images/rocky-pizza.jpg', alt: 'Rocky Mountain Pizza' }],
        last_updated: new Date().toISOString()
      },

      // 7. Havasu Ice Cream Co – LAKE HAVASU CITY, AZ
      {
        _id: new ObjectId(),
        truck_id: 'ft_havasu_icecream_001',
        name: 'Havasu Ice Cream Co',
        cuisine: ['Dessert', 'Ice Cream'],
        status: 'Open',
        hours: '1 PM - 10 PM',
        mainLocation: { lat: 34.4730, lng: -114.3280, address: '2180 McCulloch Blvd N, Lake Havasu City, AZ 86403' },
        eventLocation: { lat: 34.4750, lng: -114.3400, address: 'Lake Havasu Marina, Sunset Festival' },
        isAtEvent: true,
        menu: [
          { item: 'Lake Havasu Sundae', price: 8, dietary: ['Vegetarian'], description: 'Vanilla, hot fudge, whipped cream' },
          { item: 'Mango Sorbet', price: 5, dietary: ['Vegan'], description: 'Dairy-free, fresh mango' },
          { item: 'Waffle Cone', price: 1.5, dietary: ['Vegetarian'], description: 'Add to any scoop' }
        ],
        phone: '(928) 555-0107',
        email: 'scoops@havasuicecream.com',
        socials: { instagram: 'https://instagram.com/havasuicecream' },
        attending_events: [new ObjectId()],
        images: [{ url: 'https://yourdomain.com/images/havasu-icecream.jpg', alt: 'Havasu Ice Cream Co' }],
        last_updated: new Date().toISOString()
      }
    ];

    const result = await collection.insertMany(trucks);
    console.log(`Migration SUCCESS: Inserted ${result.insertedCount} food trucks into ${dbName}.${collectionName}`);

  } catch (err) {
    console.error('Migration FAILED:', err.message);
  } finally {
    await client.close();
    console.log('Connection closed.');
  }
}

// Run it
runMigration();
