import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import FoodTruckMap from "../../components/FoodTruckMap"
import Layout from "../../components/layout"
import { Seo } from "../../components/seo"
import FTALogo from "../../images/usa-logo.png"
import { FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa"

const Events = ({ data }) => {
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
            <h1 className="text-uppercase m-0">Event Directory</h1>
            <small className="text-muted ms-2">Find your favorite Food Truck at Events</small>
          </div>
          <div className="col-8 text-end">
            <form className="d-inline-flex" role="search" onSubmit={handleSearch} aria-label="Search events">
              <input
                className="form-control me-2"
                type="search"
                placeholder="e.g., Austin, TX or Event Name"
                aria-label="Enter city, event name, or food truck name"
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
        <h2 className="text-uppercase mb-3"><u>Featured Events</u></h2>
        <div className="btn-group mb-3" role="group" aria-label="Sort options">
          <button className={`btn ${sortCriteria === "a-z" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setSortCriteria("a-z")}>A-Z</button>
          <button className={`btn ${sortCriteria === "z-a" ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setSortCriteria("z-a")}>Z-A</button>
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
                  <div className="card w-100 h-100 shadow-lg border-0" style={{
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                    transition: "transform 0.3s, box-shadow 0.3s"
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)"
                      e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"
                    }}>
                    {image ? (
                      <GatsbyImage
                        image={image}
                        alt={node.frontmatter.hero_image_alt || "Event Image"}
                        objectFit="cover"
                        style={{ height: "200px", borderBottom: "2px solid #dee2e6" }}
                        className="card-img-top img-fluid"
                        loading="lazy"
                      />
                    ) : (
                      <div style={{ height: "200px", backgroundColor: "#f0f0f0", borderBottom: "2px solid #dee2e6" }} className="d-flex align-items-center justify-content-center">
                        No image available
                      </div>
                    )}
                    <div className="card-body p-3">
                      <span className={`badge ${isOpen ? "bg-success" : "bg-danger"} text-white mb-2 d-inline-block`}
                        style={{ padding: "0.3rem 0.6rem", borderRadius: "0.3rem", fontSize: "0.9rem" }}>
                        {isOpen ? "Open" : "Closed"}
                      </span>
                      <h3 className="card-title text-primary fw-bold mb-2" style={{ fontSize: "1.3rem" }}>
                        <Link to={`/events/${node.frontmatter.slug}`} className="text-decoration-none text-primary">
                          {node.frontmatter.title}
                        </Link>
                      </h3>
                      <p className="card-text mb-1"><FaClock className="me-1" /> Hours: {node.frontmatter.hours}</p>
                      <p className="card-text mb-1"><FaPhone className="me-1" /> Phone: {node.frontmatter.phone}</p>
                      <p className="card-text mb-1"><FaMapMarkerAlt className="me-1" /> Location: {node.frontmatter.city}, {node.frontmatter.state}</p>
                      {node.frontmatter.events && node.frontmatter.events.length > 0 && (
                        <p className="card-text mb-2 text-muted small">Events: {node.frontmatter.events.join(", ")}</p>
                      )}
                      <Link to={`/events/${node.frontmatter.slug}`} className="btn btn-primary btn-sm mt-2" style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}>
                        Event Details
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center">No events match your search.</p>
          )}
        </div>
      </section>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMdx(filter: { frontmatter: { category: { eq: "events" } } }) {
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
          events
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
    title="Event Directory"
    description="Explore the latest food truck events with our interactive directory and map."
    meta={[
      { property: "og:title", content: "Event Directory - Food Truck Alley" },
      { property: "og:description", content: "Discover upcoming food truck events near you." },
      { property: "og:image", content: "https://yourdomain.com/images/usa-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ]}
  />
)

export default Events
