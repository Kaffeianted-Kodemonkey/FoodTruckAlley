require("dotenv").config({
  path: `.env`,
})
/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  pathPrefix: "https://kfn8dkodemonkey.github.io/FTA/",   // ← your repo name
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
        dbName: process.env.MONGODB_DB || 'foodtruckalley',
        collection: 'food_trucks',
        preserveObjectIds: true,
        extraParams: {
          retryWrites: true,
          w: 'majority'
        }
      }
    },
  ],
};
