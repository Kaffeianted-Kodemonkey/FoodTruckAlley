/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.onCreateWebpackConfig = ({ actions }) => {
       actions.setWebpackConfig({
         devServer: {
           hot: true,
           reconnect: true,
           client: {
             webSocketURL: {
               hostname: "localhost",
               pathname: "/__webpack_hmr",
               port: 8000,
             },
           },
         },
       })
     }
