require("dotenv").config({
  path: `.env`,
})
/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "Food Truck Alley",
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: `gatsby-source-mongodb`,
      options: {
        connectionString: process.env.MONGODB_URI,
        dbName: process.env.MONGODB_DB,
        collection: [process.env.MONGODB_COLLECTION],
        extraFields: {
          'food_trucks.socials': 'MongodbFoodtruckalleyFoodTrucksSocials',
          'food_trucks.attending_events': 'MongodbFoodtruckalleyFoodTrucksEvents'
        },
        extraParams: {
          ssl: true,
          authSource: "admin",
          retryWrites: true,
          w: "majority"
        }
      }
    },
  ],
};
