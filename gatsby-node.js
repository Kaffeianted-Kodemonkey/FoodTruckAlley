// Example gatsby-node.js logic
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allTrucks: allTrucksJson { nodes { id slug } }
      allEvents: allEventsJson { nodes { id slug } }
    }
  `);

  // Create Truck Landing Pages
  result.data.allTrucks.nodes.forEach(truck => {
    createPage({
      path: `/trucks/${truck.slug}`,
      component: require.resolve(`./src/templates/Truck-LP.js`),
      context: { id: truck.id },
    });
  });

  // Create Event Landing Pages
  result.data.allEvents.nodes.forEach(event => {
    createPage({
      path: `/events/${event.slug}`,
      component: require.resolve(`./src/templates/Event-LP.js`),
      context: { id: event.id },
    });
  });
};
