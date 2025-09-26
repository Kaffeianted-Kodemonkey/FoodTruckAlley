const { MongoClient, ObjectId } = require('mongodb');

async function runMigration() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('foodtruckalley');
    const collection = db.collection('food_trucks');

    // Drop existing collection
    await collection.drop().catch(err => console.log('Collection drop failed (may not exist):', err.message));

    // Insert data
    await collection.insertMany([
      {
        _id: new ObjectId('6870817751b91c6e4f017ccb'),
        truck_id: 'ft_sticky_nickies_001',
        name: 'Sticky Nickies',
        cuisine: ['American'],
        status: 'Open',
        hours: '10 AM - 8 PM',
        mainLocation: {
          lat: 40.4555,
          lng: -109.5287,
          address: '123 Food Lane, Vernal, UT 84078'
        },
        eventLocation: null,
        isAtEvent: false,
        menu: [],
        phone: 'N/A',
        email: 'N/A',
        socials: {
          facebook: 'https://www.facebook.com/dragracesevent',
          twitter: 'https://twitter.com/DragRacesEvent',
          instagram: null
        },
        attending_events: [new ObjectId('6870817751b91c6e4f017ccc')],
        images: [],
        last_updated: '2021-07-23T00:00:00Z'
      },
      {
        _id: new ObjectId('6870884bba170373b72d320d'),
        truck_id: 'ft_taco_king_001',
        name: 'Taco King',
        cuisine: ['Mexican', 'Gluten-Free'],
        status: 'Open',
        hours: '9 AM - 6 PM',
        mainLocation: {
          lat: 40.4555,
          lng: -109.5287,
          address: '456 Taco Lane, Vernal, UT 84078'
        },
        eventLocation: {
          lat: 40.4555,
          lng: -109.5287,
          address: '456 Festival Grounds, Vernal, UT'
        },
        isAtEvent: true,
        menu: [
          {
            item: 'King Trio',
            price: 9,
            dietary: [],
            description: 'Three tacos: one carne asada, one pollo asado, one al pastor. Topped with diced onions, cilantro, and choice of red or green salsa. Add guacamole: +$1'
          },
          {
            item: 'Carne Asada Taco',
            price: 3.5,
            dietary: [],
            description: 'Grilled steak, topped with fresh pico de gallo and queso fresco. Add avocado slices: +$1'
          },
          {
            item: 'Pollo Verde Taco',
            price: 3.5,
            dietary: [],
            description: 'Marinated grilled chicken with tomatillo salsa, cilantro, and lime crema.'
          },
          {
            item: 'Shrimp Diablo Taco',
            price: 4,
            dietary: [],
            description: 'Blackened shrimp with chipotle aioli, roasted corn salsa, and cilantro.'
          },
          {
            item: 'King Burrito',
            price: 10,
            dietary: [],
            description: 'Choice of carne asada, chicken, or pulled pork with seasoned rice, black beans, cheese, lettuce, and crema. Add jalapeños: +$0.50'
          },
          {
            item: 'Veggie King',
            price: 8,
            dietary: ['Vegetarian'],
            description: 'Grilled portobello mushrooms, black beans, Mexican rice, pico de gallo, and avocado.'
          },
          {
            item: 'Elote (Street Corn)',
            price: 4,
            dietary: ['Vegetarian'],
            description: 'Grilled corn on the cob with mayo, cotija cheese, chili powder, and lime.'
          },
          {
            item: 'Chips & Guacamole',
            price: 5,
            dietary: ['Vegetarian'],
            description: 'House-made corn tortilla chips with fresh guacamole.'
          },
          {
            item: 'Horchata',
            price: 3,
            dietary: ['Vegetarian'],
            description: 'Creamy cinnamon rice drink.'
          },
          {
            item: 'Mexican Soda',
            price: 2.5,
            dietary: [],
            description: 'Jarritos (Mango, Tamarind, or Lime).'
          }
        ],
        phone: 'N/A',
        email: 'N/A',
        socials: {
          facebook: null,
          twitter: null,
          instagram: null
        },
        attending_events: [new ObjectId('6870884bba170373b72d320e')],
        images: [
          {
            url: 'https://yourdomain.com/images/taco-king-hero.jpg',
            alt: 'Taco King food truck'
          }
        ],
        last_updated: '2021-07-23T00:00:00Z'
      }
    ]);

    console.log('Migration completed: Inserted 2 food trucks');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.close();
  }
}

runMigration();
