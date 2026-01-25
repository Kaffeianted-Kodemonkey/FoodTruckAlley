require("dotenv").config({
  path: `.env`,
})
/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  pathPrefix:"/FTA",
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
        connectionString: process.env.MONGODB_URI,  // ← use env var!
        dbName: "foodtruckalley",                   // ← your actual DB name
        collection: ["foodtrucks"],                 // ← your collection(s), e.g. array if multiple
        // Optional extras if needed:
        // extraParams: { authSource: "admin" },
        // clientOptions: { useNewUrlParser: true, useUnifiedTopology: true },
        }
      }
    },
  ],
};
