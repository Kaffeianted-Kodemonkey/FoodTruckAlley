import * as React from "react"
import { Link } from "gatsby"
import { graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import FoodTruckMap from "../components/FoodTruckMap"
import Layout from "../components/layout"
import { Seo } from "../components/seo"

const IndexPage = ({ data }) => {
  const [showMap, setShowMap] = React.useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    setShowMap(true)
  }

  return (
    <Layout>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">Locate your Favorite Food Truck:</h1>
            <form
              className="mt-5 mb-5 d-flex"
              role="search"
              onSubmit={handleSearch}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>

            {showMap ? (
              <FoodTruckMap />
            ) : (
              <StaticImage
                src="../images/usa-logo.png"
                width={300}
                quality={95}
                formats={["AUTO", "WEBP"]}
                alt="Food Truck Ally"
                className="img-fluid"
              />
            )}
          </div>
        </div>

        <div className="row mt-2">
          {data.allMdx.nodes.map((node) => (
            <div className="col-lg-4 col-md-2" key={node.id}>
              <div className="card w-85">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                  <h3 className="card-title">
                    <Link to={`/profile/${node.frontmatter.slug}`}>
                      {node.frontmatter.title}
                    </Link>
                  </h3>
                  <h4 className="card-text">
                    Status: {node.frontmatter.current_status}
                  </h4>
                  <p className="card-text">Hours: {node.frontmatter.hours}</p>
                  <p className="card-text">Phone: {node.frontmatter.phone}</p>
                  <p className="card-text">Location: {node.frontmatter.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC } }) {
      nodes {
        frontmatter {
          title
          date(formatString: "MMMM D, YYYY")
          hours
          slug
          phone
          current_status
          location
        }
        id
      }
    }
  }
`

export const Head = () => <Seo title="Food Truck Alley" />

export default IndexPage
