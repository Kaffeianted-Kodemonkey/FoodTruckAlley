// gatsby-node.js
const path = require(`path`);

/**
 * Define the schema for local JSON data.
 * This ensures GraphQL queries don't break even if a JSON file is empty.
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type TrucksJson implements Node {
      title: String!
      slug: String!
      cuisine: String
      status: String
      hours: String
      location: String
      description: String
      isUpgraded: Boolean
      lat: Float
      lng: Float
      phone: String
      instagram: String
      menu: [MenuItem]
    }

    type MenuItem {
      name: String
      price: String
      diet: String
    }

    type EventsJson implements Node {
      title: String!
      slug: String!
      location: String
      date: String
      time: String
      description: String
      isUpgraded: Boolean
      lat: Float
      lng: Float
      amenities: [String]
    }
  `;
  createTypes(typeDefs);
};

/**
 * Generate individual pages for both trucks and events.
 */
exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // 1. Query local JSON nodes for both types
  const result = await graphql(`
    {
      allTrucksJson {
        nodes {
          id
          slug
          isUpgraded
        }
      }
      allEventsJson {
        nodes {
          id
          slug
          isUpgraded
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query to create pages.`, result.errors);
    return;
  }

  // 2. Use the unified "Listing Details" template
  const sharedTemplate = path.resolve(`./src/templates/listing-details.js`);

  // 3. Create pages for TRUCKS
  const trucks = result.data?.allTrucksJson?.nodes || [];
  trucks.forEach((truck) => {
    createPage({
      path: `/trucks/${truck.slug}`,
      component: sharedTemplate,
      context: { id: truck.id },
      defer: !truck.isUpgraded, 
    });
  });

  // 4. Create pages for EVENTS
  const events = result.data?.allEventsJson?.nodes || [];
  events.forEach((event) => {
    createPage({
      path: `/events/${event.slug}`,
      component: sharedTemplate,
      context: { id: event.id },
      defer: !event.isUpgraded, 
    });
  });
};
