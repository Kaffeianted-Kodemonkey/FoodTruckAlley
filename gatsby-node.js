exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type mongodbFoodtruckalleyFood_trucks implements Node {
      _id: ID!
      truck_id: String!
      name: String!
      cuisine: [String!]!
      status: String!
      hours: String!
      mainLocation: mongodbFoodtruckalleyFood_trucksMainLocation!
      eventLocation: mongodbFoodtruckalleyFood_trucksEventLocation
      isAtEvent: Boolean!
      menu: [String!]!
      phone: String!
      email: String!
      socials: mongodbFoodtruckalleyFood_trucksSocials!
      attending_events: [ID!]!
      images: [mongodbFoodtruckalleyFood_trucksImages!]!
      last_updated: String!
      address: String!
    }

    type mongodbFoodtruckalleyFood_trucksMainLocation {
      lat: Float!
      lng: Float!
      address: String!
    }

    type mongodbFoodtruckalleyFood_trucksEventLocation {
      lat: Float
      lng: Float
      address: String
    }

    type mongodbFoodtruckalleyFood_trucksSocials {
      facebook: String
      twitter: String
      instagram: String
    }

    type mongodbFoodtruckalleyFood_trucksImages {
      url: String!
      alt: String!
    }
  `;
  createTypes(typeDefs);
};
