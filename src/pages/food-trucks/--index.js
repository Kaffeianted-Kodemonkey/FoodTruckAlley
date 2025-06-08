import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../../components/layout"
import { Seo } from "../../components/seo"
import FTALogo from "../../images/usa-logo.png"

const FoodTrucks = ({ data }) => {
  const foodTrucks = data.allMdx.nodes

  return (
    <Layout pageTitle="Food Truck Directory">
      <section className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-6 m-0 p-0">
            <img src={FTALogo} alt="Food Truck Alley" className="rounded float-start me-3" width="12%"/>
            <h1 className="text-uppercase mt-4"> Food Truck - Directory</h1>
          </div>
        </div>
      </section>

      <main className="container">
        <div className="row">
          {foodTrucks.map((node) => {
            const image = getImage(node.frontmatter.hero_image?.childImageSharp?.gatsbyImageData)

            return (
              <div className="col-lg-4 col-md-2 mt-5" key={node.id}>
                <div className="card w-85">
                  {image ? (
                    <GatsbyImage
                      image={image}
                      alt={node.frontmatter.hero_image_alt || "Food Truck Image"}
                      objectFit="cover"
                      style={{ width: "100%", height: "auto" }}
                      className="img-fluid img-thumbnail"
                    />
                  ) : (
                    <div style={{ width: "100%", height: "200px", backgroundColor: "#f0f0f0" }}>
                      No image available
                    </div>
                  )}
                  <div className="card-body">
                    <h2 className="card-title text-center">
                      <Link to={`/food-trucks/${node.frontmatter.slug}`}>
                        {node.frontmatter.title}
                      </Link>
                    </h2>
                    <h3 className="card-text text-center">{node.frontmatter.current_status}- for the Season</h3>

                    <hr />

                    <p className="card-text">Hours: {node.frontmatter.hours}</p>
                    <p className="card-text">Phone: {node.frontmatter.phone}</p>
                    <p className="card-text">Location: {node.frontmatter.location}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(filter: { frontmatter: { category: { eq: "food-trucks" } } }) {
      nodes {
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
          hours
          slug
          phone
          current_status
          city
          state
          hero_image_alt
          hero_image {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        id
      }
    }
  }
`

export const Head = () => <Seo title="Food Truck Directory" />

export default FoodTrucks
