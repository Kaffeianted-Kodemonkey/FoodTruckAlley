import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import FoodTruckMap from "../components/FoodTruckMap"
import Layout from "../components/layout"
import { Seo } from "../components/seo"
import FTALogo from "../images/usa-logo.png"

const IndexPage = ({ data }) => {
  const foodTrucks = data.allMdx.nodes
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortCriteria, setSortCriteria] = React.useState("a-z") // Default sort

  const handleSearch = (e) => {
    e.preventDefault()
    const firstMatch = foodTrucks.find((node) =>
      node.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${node.frontmatter.city}, ${node.frontmatter.state}`.toLowerCase().includes(searchQuery.toLowerCase())
    )
    if (firstMatch) {
      console.log("Focusing on:", firstMatch.frontmatter.title)
    }
  }

  const filteredTrucks = foodTrucks.filter((node) =>
    node.frontmatter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (node.frontmatter.city && node.frontmatter.state && `${node.frontmatter.city}, ${node.frontmatter.state}`.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    switch (sortCriteria) {
      case "a-z":
        return a.frontmatter.title.localeCompare(b.frontmatter.title)
      case "z-a":
        return b.frontmatter.title.localeCompare(a.frontmatter.title)
      case "cuisine":
        return (a.frontmatter.cuisine || "").localeCompare(b.frontmatter.cuisine || "")
      case "status":
        return (a.frontmatter.current_status || "").localeCompare(b.frontmatter.current_status || "")
      case "location":
        return `${a.frontmatter.city}, ${a.frontmatter.state}`.localeCompare(`${b.frontmatter.city}, ${b.frontmatter.state}`)
      default:
        return 0
    }
  })

  return (
    <Layout>
      <header className="container-fluid p-3 bg-light border-bottom">
        <div className="row align-items-center">
          <div className="col-4 d-flex align-items-center">
            <img src={FTALogo} alt="Food Truck Alley Logo" className="rounded me-3" style={{ width: "100px", height: "auto" }} />
            <h1 className="text-uppercase m-0">Food Truck Alley</h1>
            <small className="text-muted ms-2">Your Local Food Truck Guide</small>
          </div>
          <div className="col-8 text-end">
            <form className="d-inline-flex" role="search" onSubmit={handleSearch} aria-label="Search food trucks">
              <input
                className="form-control me-2"
                type="search"
                placeholder="e.g., Austin, TX"
                aria-label="Enter city or food truck name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="py-5">
        <div className="container">
          <FoodTruckMap initialLocation={true} foodTrucks={foodTrucks} searchQuery={searchQuery} />
        </div>
      </section>

      <hr />

      <section className="py-5 container">
        <h2 className="text-uppercase mb-3"><u>Featured Food Trucks</u></h2>
        <div className="btn-group mb-3" role="group" aria-label="Sort options">
          <button className={`btn ${sortCriteria === "a-z" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setSortCriteria("a-z")}>A-Z</button>
          <button className={`btn ${sortCriteria === "z-a" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setSortCriteria("z-a")}>Z-A</button>
          <button className={`btn ${sortCriteria === "cuisine" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setSortCriteria("cuisine")}>Cuisine</button>
          <button className={`btn ${sortCriteria === "status" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setSortCriteria("status")}>Status</button>
          <button className={`btn ${sortCriteria === "location" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setSortCriteria("location")}>Location</button>
        </div>
        <div className="row">
          {filteredTrucks.length > 0 ? (
            filteredTrucks.map((node) => {
              const image = getImage(node.frontmatter.hero_image?.childImageSharp?.gatsbyImageData)
              const isOpen = node.frontmatter.current_status?.toLowerCase() === "open"
              return (
                <div className="col-lg-4 col-md-6 mt-4" key={node.id}>
                  <div className="card w-100 h-100 shadow-sm border-0" style={{ transition: "transform 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                    {image ? (
                      <GatsbyImage
                        image={image}
                        alt={node.frontmatter.hero_image_alt || "Food Truck Image"}
                        objectFit="cover"
                        style={{ height: "200px" }}
                        className="card-img-top img-fluid"
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ height: "200px", backgroundColor: "#f0f0f0" }} className="d-flex align-items-center justify-content-center">
                        No image available
                      </div>
                    )}
                    <div className="card-body">
                      <div className=" text-center">
                        <h3 className="card-title">
                          <Link to={`/food-trucks/${node.frontmatter.slug}`} className="text-decoration-none text-dark">
                            {node.frontmatter.title}
                          </Link>
                        </h3>
                        <p className="card-text fs-4"><strong>Cuisine:</strong> {node.frontmatter.cuisine || "N/A"}</p>

                        <span className={`badge ${isOpen ? "bg-success" : "bg-danger"} text-white mb-2 d-inline-block`}
                          style={{ padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}>
                          {isOpen ? "Open" : "Closed"}
                        </span>
                      </div>

                      <hr />

                      <p className="card-text"><strong>Location: </strong>
                        <Link to={`/events/${node.frontmatter.eventSlug}`}>{node.frontmatter.event}</Link></p>
                      <p className="card-text"><strong>Hours:</strong> {node.frontmatter.hours} </p>

                      <p className="card-text fs-4">
                      <Link to={`/food-trucks/${node.frontmatter.slug}`} className="btn btn-outline-primary mt-2">Directory Listing</Link></p>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center">No food trucks match your search.</p>
          )}
        </div>
      </section>
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
          event
          eventSlug
          phone
          email
          current_status
          city
          state
          cuisine
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

export const Head = () => (
  <Seo
    title="Food Truck Alley"
    description="Discover local food trucks with our interactive map and directory."
    meta={[
      { property: "og:title", content: "Food Truck Alley" },
      { property: "og:description", content: "Find your favorite food trucks near you." },
      { property: "og:image", content: "https://yourdomain.com/images/usa-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ]}
  />
)

export default IndexPage
