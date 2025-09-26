const { MongoClient, ObjectId } = require('mongodb');
const { Client } = require('@googlemaps/google-maps-services-js');
require('dotenv').config();

// Initialize Google Maps client
const googleMapsClient = new Client({});

// Configuration
const DATABASE_NAME = 'foodtruckalley';
const COLLECTION_NAME = 'food_trucks';
const DRY_RUN = false;

// Delay function for rate limiting
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function geocodeAndUpdate() {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }
    if (!process.env.GATSBY_GOOGLE_MAPS_API_KEY) {
      console.warn('GATSBY_GOOGLE_MAPS_API_KEY is not defined; geocoding fallback may be limited');
    }

    // Connect to MongoDB
    console.log(`Connecting to MongoDB: ${process.env.MONGODB_URI.replace(/:\/\/.*@/, '://<hidden>@')}`);
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db(DATABASE_NAME);
    const foodTrucksCollection = db.collection(COLLECTION_NAME);
    const eventsCollection = db.collection('events');

    // List collections
    console.log('Listing collections...');
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    const eventsExists = collections.some(col => col.name === 'events');
    console.log(`Events collection exists: ${eventsExists}`);

    // Check document count
    console.log(`Checking documents in ${COLLECTION_NAME}...`);
    const initialCount = await foodTrucksCollection.countDocuments();
    console.log(`Found ${initialCount} trucks`);

    if (initialCount === 0) {
      console.warn(`No documents found in ${COLLECTION_NAME}. Please verify data.`);
      await client.close();
      return;
    }

    // Check for duplicate truck names
    console.log('Checking for duplicate truck names...');
    const nameCounts = await foodTrucksCollection.aggregate([
      { $group: { _id: '$name', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();
    if (nameCounts.length > 0) {
      console.warn('Duplicate truck names found:', JSON.stringify(nameCounts, null, 2));
    }

    // Normalize socials field
    console.log('Normalizing socials field...');
    await foodTrucksCollection.updateMany(
      { socials: { $exists: false } },
      { $set: { socials: { facebook: null, twitter: null, instagram: null } } }
    );
    await foodTrucksCollection.updateMany(
      { 'socials.facebook': { $exists: false } },
      { $set: { 'socials.facebook': null } }
    );
    await foodTrucksCollection.updateMany(
      { 'socials.twitter': { $exists: false } },
      { $set: { 'socials.twitter': null } }
    );
    await foodTrucksCollection.updateMany(
      { 'socials.instagram': { $exists: false } },
      { $set: { 'socials.instagram': null } }
    );

    // Update events with static values
    console.log('Updating events collection...');
    await eventsCollection.updateOne(
      { _id: new ObjectId('6870817751b91c6e4f017ccc') },
      {
        $set: {
          name: 'Stock Cars Drag Races',
          location: {
            lat: 40.3793,
            lng: -109.3465,
            address: '789 Event Plaza, Vernal, UT'
          },
          date: new Date('2025-10-01T00:00:00Z')
        }
      },
      { upsert: true }
    );
    await eventsCollection.updateOne(
      { _id: new ObjectId('6870884bba170373b72d320e') },
      {
        $set: {
          name: 'Roundup Festival',
          location: {
            lat: 40.4555,
            lng: -109.5287,
            address: '456 Festival Grounds, Vernal, UT'
          },
          date: new Date('2025-10-01T00:00:00Z')
        }
      },
      { upsert: true }
    );

    // Fetch all food trucks
    console.log('Fetching food trucks...');
    const trucks = await foodTrucksCollection.find({}).toArray();
    console.log(`Processing ${trucks.length} trucks`);

    for (const truck of trucks) {
      try {
        console.log(`Processing truck: ${truck.name || 'unknown'} (_id: ${truck._id})`);

        // Clean name field
        const name = truck.name && typeof truck.name === 'string' ? truck.name.trim() : 'Unknown Truck';
        if (name === 'Unknown Truck') {
          console.warn(`Truck _id: ${truck._id} has invalid or missing name`);
        }

        // Populate mainLocation
        let mainLocation = truck.mainLocation || {};
        if (truck.map_location && typeof truck.map_location === 'object' && truck.map_location.lat != null && truck.map_location.lng != null) {
          mainLocation = {
            lat: Number(truck.map_location.lat),
            lng: Number(truck.map_location.lng),
            address: truck.location ||
              (truck.map_location.city && truck.map_location.state
                ? `${truck.map_location.city}, ${truck.map_location.state} ${truck.map_location.zip || ''}`.trim()
                : 'N/A')
          };
          console.log(`Using map_location for ${name}: ${JSON.stringify(mainLocation)}`);
        } else if (truck.location && typeof truck.location === 'string') {
          console.log(`Geocoding location for ${name}: ${truck.location}`);
          if (process.env.GATSBY_GOOGLE_MAPS_API_KEY) {
            try {
              const response = await googleMapsClient.geocode({
                params: {
                  address: truck.location,
                  key: process.env.GATSBY_GOOGLE_MAPS_API_KEY
                }
              });
              if (response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry.location;
                mainLocation = {
                  lat: Number(lat),
                  lng: Number(lng),
                  address: truck.location
                };
                console.log(`Geocoded ${name}: ${JSON.stringify(mainLocation)}`);
              } else {
                mainLocation = {
                  lat: 0,
                  lng: 0,
                  address: truck.location
                };
                console.warn(`No geocoding results for ${name}: ${truck.location}`);
              }
              await delay(100);
            } catch (geoError) {
              console.error(`Geocoding failed for ${name}: ${geoError.message}`);
              mainLocation = {
                lat: 0,
                lng: 0,
                address: truck.location
              };
            }
          } else {
            mainLocation = {
              lat: 0,
              lng: 0,
              address: truck.location
            };
            console.warn(`No API key; set default coordinates for ${name}`);
          }
        } else if (!mainLocation.lat || !mainLocation.lng || mainLocation.lat === 0 || mainLocation.lng === 0) {
          mainLocation = {
            lat: 0,
            lng: 0,
            address: 'N/A'
          };
          console.warn(`No valid location data for ${name}; using default`);
        } else {
          console.log(`Keeping existing mainLocation for ${name}: ${JSON.stringify(mainLocation)}`);
        }

        // Populate eventLocation
        let eventLocation = null;
        let isAtEvent = truck.attending_events && Array.isArray(truck.attending_events) && truck.attending_events.length > 0;
        if (isAtEvent && eventsExists) {
          let eventId = truck.attending_events[0];
          if (typeof eventId === 'string') {
            try {
              eventId = new ObjectId(eventId);
            } catch (e) {
              console.warn(`Invalid ObjectId for event ${eventId} in ${name}; treating as string`);
            }
          }
          console.log(`Checking event ${eventId} for ${name}`);
          const event = await eventsCollection.findOne({ _id: eventId });
          if (event && event.location && event.location.lat != null && event.location.lng != null) {
            eventLocation = {
              lat: Number(event.location.lat),
              lng: Number(event.location.lng),
              address: event.location.address || event.name || 'N/A'
            };
            console.log(`Event location for ${name}: ${JSON.stringify(eventLocation)}`);
          } else {
            console.warn(`No valid event location for ${name}, event: ${eventId}. Event: ${JSON.stringify(event)}`);
            eventLocation = null;
            isAtEvent = false;
          }
        } else {
          console.log(`No events or events collection missing for ${name}; setting eventLocation: null`);
          isAtEvent = false;
        }

        // Prepare update
        const update = {
          $set: {
            name,
            mainLocation,
            eventLocation,
            isAtEvent,
            email: typeof truck.email === 'object' || !truck.email ? 'N/A' : truck.email,
            address: typeof truck.address === 'object' || !truck.address ? 'N/A' : truck.address,
            socials: {
              facebook: truck.socials?.facebook || null,
              twitter: truck.socials?.twitter || null,
              instagram: truck.socials?.instagram || null
            }
          },
          $unset: {
            location: '',
            map_location: '',
            facebook: '',
            twitter: '',
            testField: ''
          }
        };

        if (DRY_RUN) {
          console.log(`Dry run: Would update ${name} with:`, JSON.stringify(update, null, 2));
        } else {
          const result = await foodTrucksCollection.updateOne({ _id: truck._id }, update);
          if (result.matchedCount === 0) {
            console.error(`No document matched for ${name} (_id: ${truck._id})`);
          } else if (result.modifiedCount === 0) {
            console.warn(`No changes applied for ${name} (_id: ${truck._id})`);
          } else {
            console.log(`Updated ${name} (_id: ${truck._id})`);
          }
        }
      } catch (error) {
        console.error(`Error processing ${truck.name || 'unknown'} (_id: ${truck._id}):`, error.message);
      }
    }

    // Verify document count
    const finalCount = await foodTrucksCollection.countDocuments();
    console.log(`Final document count in ${COLLECTION_NAME}: ${finalCount}`);

    // Ensure text index on name
    console.log('Checking/creating text index on name...');
    const indexes = await foodTrucksCollection.indexes();
    const hasTextIndex = indexes.some(index => index.key.name === 'text');
    if (!hasTextIndex) {
      if (DRY_RUN) {
        console.log('Dry run: Would create text index on name');
      } else {
        await foodTrucksCollection.createIndex({ name: 'text' });
        console.log('Created text index on name');
      }
    } else {
      console.log('Text index on name already exists');
    }

    console.log('Migration complete');
    await client.close();
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

geocodeAndUpdate();
