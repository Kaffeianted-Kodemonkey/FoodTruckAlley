import * as React from "react"
import { Link, graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../../components/layout"
import { Seo } from "../../components/seo"
import FTALogo from "../../images/usa-logo.png"

const FoodTrucks = ({ data, children }) => {
  const image = getImage(data.mdx.frontmatter.hero_image)

  // Define social media platforms and their icons
  const socials = {
    facebook: {
      url: data.mdx.frontmatter.facebook || "",
      icon: "bi bi-facebook",
      label: "Facebook",
    },
    twitter: {
      url: data.mdx.frontmatter.twitter || "",
      icon: "bi bi-twitter",
      label: "Twitter",
    },
  }

  // Filter out socials with no URL
  const activeSocials = Object.entries(socials)
    .filter(([_, details]) => details.url)
    .map(([platform, details]) => ({ platform, ...details }))

  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <section className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-2 m-0 p-0">
            <img src={FTALogo} alt="Food Truck Alley" className="img-fluid img-thumbnail" width="25%" />
          </div>
          <div className="col-lg-8 text-center">
            <GatsbyImage
              image={image}
              alt={data.mdx.frontmatter.hero_image_alt}
              objectFit="cover"
              style={{ width: "100%", height: "500px" }}
              className="img-fluid img-thumbnail"
            />
          </div>
        </div>
      </section>

      <main className="container">
        <div className="row-cols-12">
          <h1 className="mt-5 mb-5 text-uppercase text-center"><strong>{data.mdx.frontmatter.title} - {data.mdx.frontmatter.city}, {data.mdx.frontmatter.state}</strong></h1>
          <h2 className="mt-5 mb-5 text-uppercase text-center">Join the Action on {data.mdx.frontmatter.date}, {data.mdx.frontmatter.hours}!</h2>
        </div>

        <hr />

        <div className="row">
          <div className="col-6">
            <h3 className="text-uppercase"><strong>Event Hours</strong></h3>
            <ul>
              <li><strong>Status:</strong> {data.mdx.frontmatter.current_status}</li>
              <li><strong>Open Date:</strong> {data.mdx.frontmatter.date}</li>
              <li><strong>Hours:</strong> {data.mdx.frontmatter.hours}</li>
              <li><strong>Location:</strong> {data.mdx.frontmatter.address} {data.mdx.frontmatter.city}, {data.mdx.frontmatter.state}, {data.mdx.frontmatter.zipcode}</li>
            </ul>
          </div>
          <div className="col-6">
            <h3 className="text-uppercase"><strong>Contact Information</strong></h3>
            <p><strong>Phone:</strong> {data.mdx.frontmatter.phone}</p>
            <p><strong>Email:</strong> {data.mdx.frontmatter.email}</p>
            <p><strong>Socials:</strong>
              {activeSocials.length > 0 ? (
                activeSocials.map(({ platform, url, icon }) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-2"
                  >
                    <i className={icon}></i>
                  </a>
                ))
              ) : (
                <span>No social media links available</span>
              )}
            </p>
          </div>
        </div>

        <hr />

        <div className="row-col-12">
          {children}
        </div>

        <hr/>

        <div className="row-col-12">
        <h3 className="text-uppercase texr-center">Food Trucks Attending</h3>
        <ul>
          <li><strong>Speedy BBQ:</strong> Smoked brisket and ribs with a spicy kick (exclusive event sauce!).</li>
          <li><strong>Racing Tacos:</strong> Nitro nachos and quick-serve tacos with a racing twist.</li>
          <li><strong>Fuel Stop Vegan:</strong> Plant-based burgers and fries for a healthy pit stop.</li>
        </ul>

        <p>Note: List may change—check back for the latest lineup!</p>
        </div>

        <hr />
        
        <a href="/events" className="btn btn-primary mt-3"> Back to Event Directory</a>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        current_status
        slug
        hours
        title
        phone
        email
        address
        city
        state
        zipcode
        date(formatString: "MMMM DD, YYYY")
        hero_image_alt
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
        }
        facebook
        twitter
      }
    }
  }
`

export const Head = ({ data }) => <Seo title={data.mdx.frontmatter.title} />

export default FoodTrucks
