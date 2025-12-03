exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type MongodbFoodtruckalleyFoodTrucks implements Node {
      id: ID!
      truck_id: String
      name: String!
      cuisine: [String!]
      status: String
      hours: String
      mainLocation: MongodbFoodtruckalleyFoodTrucksMainLocation
      eventLocation: MongodbFoodtruckalleyFoodTrucksEventLocation
      isAtEvent: Boolean
      menu: [MongodbFoodtruckalleyFoodTrucksMenuItem!]!
      phone: String
      email: String
      socials: MongodbFoodtruckalleyFoodTrucksSocials
      attending_events: MongodbFoodtruckalleyFoodTrucksEvents
      images: [MongodbFoodtruckalleyFoodTrucksImages!]
      last_updated: String
    }

    type MongodbFoodtruckalleyFoodTrucksMainLocation {
      lat: Float
      lng: Float
      address: String
    }

    type MongodbFoodtruckalleyFoodTrucksEventLocation {
      lat: Float
      lng: Float
      address: String
    }

    type MongodbFoodtruckalleyFoodTrucksSocials {
      facebook: String
      twitter: String
      instagram: String
    }

    type MongodbFoodtruckalleyFoodTrucksEvents {
      Event: [String!]!
    }

    type MongodbFoodtruckalleyFoodTrucksImages {
      url: String
      alt: String
    }

    type MongodbFoodtruckalleyFoodTrucksMenuItem {
      item: String!
      price: Float!
      dietary: [String!]!
      description: String!
    }
  `;

  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMongodbFoodtruckalleyFoodTrucks {
        nodes {
          truck_id
          id
        }
      }
    }
  `);

  if (result.errors) {
    console.error('GraphQL query error:', result.errors);
    return;
  }

  result.data.allMongodbFoodtruckalleyFoodTrucks.nodes.forEach(({ truck_id, id }) => {
    createPage({
      path: `/truck/${truck_id || id}`,
      component: require.resolve('./src/templates/truck.js'),
      context: { truck_id: truck_id || id },
    });
  });
};
