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
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data/`, // Point to your JSON files
      },
    },
  ],
};
