// gatsby-node.js
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type MongodbFoodtruckalleyFoodTrucks implements Node {
      id: ID!
      truck_id: String
      name: String!
      status: String
      address: String
      location: MongodbFoodtruckalleyFoodTrucksLocation
      cuisines: [MongodbFoodtruckalleyCuisines!] @link(from: "cuisines", by: "id")
      specialties: [MongodbFoodtruckalleySpecialties!] @link(from: "specialties", by: "id")
      menu: [MongodbFoodtruckalleyFoodTrucksMenuItem!]!
      phone: String
      email: String
      socials: [MongodbFoodtruckalleyFoodTrucksSocialItem!]!
      images: [MongodbFoodtruckalleyFoodTrucksImage!]!
      hours: MongodbFoodtruckalleyFoodTrucksHours
      events: [String!]!                # Future array of event IDs
      last_updated: Date
      createdAt: Date
    }

    type MongodbFoodtruckalleyFoodTrucksLocation {
      type: String!                     # "Point"
      coordinates: [Float!]!            # [lng, lat]
    }

    type MongodbFoodtruckalleyFoodTrucksSocialItem {
      platform: String!
      url: String!
    }

    type MongodbFoodtruckalleyFoodTrucksImage {
      url: String!
      alt: String
    }

    type MongodbFoodtruckalleyFoodTrucksMenuItem {
      item: String!
      price: Float!
      dietary: [String!]!
      description: String
    }

    type MongodbFoodtruckalleyFoodTrucksHours {
      open: String
      close: String
      days: String
    }

    # Reference collections – keep as-is
    type MongodbFoodtruckalleyCuisines implements Node {
      id: ID!
      name: String!
      slug: String
      description: String
    }

    type MongodbFoodtruckalleySpecialties implements Node {
      id: ID!
      name: String!
      slug: String
      description: String
      category: String
    }
  `;

  createTypes(typeDefs);
};

// Optional: Dynamic page creation for individual trucks
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
    console.error('Error creating truck pages:', result.errors);
    return;
  }

  result.data.allMongodbFoodtruckalleyFoodTrucks.nodes.forEach(({ truck_id, id }) => {
    const slug = truck_id || id;
    createPage({
      path: `/truck/${slug}`,
      component: require.resolve('./src/templates/truck.js'),
      context: { truck_id: slug },
    });
  });
};
