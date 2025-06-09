import * as React from 'react'
import { Link, graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../../components/layout'
import {Seo} from '../../components/seo'

const FoodTrucks = ({ data, children }) => {
  const image = getImage(data.mdx.frontmatter.hero_image)

  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <main className="container">
        <div className="row row-cols-1 text-center">
          <div className="col">
            <GatsbyImage
              image={image}
              alt={data.mdx.frontmatter.hero_image_alt}
              objectFit="cover"
              style={{ width: "100%", height: "500px" }}
              className="img-fluid img-thumbnail"
            />
          </div>
          <div className="col">
            <h1 className="mt-3">{data.mdx.frontmatter.title} - {data.mdx.frontmatter.city}, {data.mdx.frontmatter.state}</h1>
            <h2 className="mt-2 mb-0 text-center">Join us on {data.mdx.frontmatter.date} - {data.mdx.frontmatter.event}</h2>
          </div>
        </div>

        <hr />

        <div className="row row-cols-3">
          <div className="col">
            <h3 className="text-uppercase"><strong>Hours & Location</strong></h3>
            <p><strong>Hours:</strong> {data.mdx.frontmatter.event ? `${data.mdx.frontmatter.event} - (event hours)` : data.mdx.frontmatter.hours}</p>
            <p><strong>Location:</strong> {data.mdx.frontmatter.event || `${data.mdx.frontmatter.city}, ${data.mdx.frontmatter.state}`}</p>
          </div>
          <div className="col">
            <h3 className="text-uppercase"><strong>Contact Information</strong></h3>
            <p><strong>Phone:</strong> {data.mdx.frontmatter.phone}</p>
            <p><strong>Email:</strong> <a href={`mailto:${data.mdx.frontmatter.email}`}>Food Truck Owner</a></p>
          </div>
          <div className="col">
            <h3 className="text-uppercase"><strong>Socials</strong></h3>
            <p><Link to={data.mdx.frontmatter.twitter}><i class="bi bi-twitter-x"></i></Link>
            <Link to={data.mdx.frontmatter.facebook}><i class="ms-3 bi bi-facebook"></i></Link></p>
          </div>
        </div>

        <hr />

        <div className="row row-cols-1">
          <div className="col">
            <h2 className="mb-3 fs-1"><strong>{data.mdx.frontmatter.title} Menu</strong></h2>
            {children}
          </div>
        </div>
        <hr />
        <p><a href="/" className="btn btn-primary mt-3"> Back to Event Directory</a></p>
      </main>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    mdx(id: {eq: $id}) {
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        current_status
        hours
        phone
        email
        city
        state
        facebook
        twitter
        event
        hero_image_alt
        hero_image {
          childImageSharp {
            gatsbyImageData
          }
        }
        current_status
      }
    }
  }
`
export const Head = ({ data }) => <Seo title={data.mdx.frontmatter.title} />

export default FoodTrucks
