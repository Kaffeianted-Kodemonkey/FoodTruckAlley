import * as React from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../../components/layout'
import {Seo} from '../../components/seo'
import FTALogo from "../../images/usa-logo.png"

const BlogPost = ({ data, children }) => {
const image = getImage(data.mdx.frontmatter.hero_image)

  return (
    <Layout pageTitle={data.mdx.frontmatter.title}>
      <section className="container-fluid m-0 p-0">
        <div className="row">
          <div className="col-2 m-0 p-0">
            <img src={FTALogo} alt="Food Truck Alley" className="img-fluid img-thumbnail" width="40%"/>
          </div>
          <div className="col-lg-8 text-center">
            <h1 className="mt-5">{data.mdx.frontmatter.title}</h1>
          </div>
        </div>
      </section>

      <hr />

      <main className="container">
        <div className="row-cols-12">
          <GatsbyImage
            image={image}
            alt={data.mdx.frontmatter.hero_image_alt}
            objectFit= "cover"
            style={{ width: "100%", height: "auto" }}
            className="img-fluid img-thumbnail"
          />
        </div>
        <h2 className="mt-5 mb-5 text-center">{data.mdx.frontmatter.current_status} for Business</h2>
        <hr />
        <div className="row-cols-12">
          {children}
        </div>
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

export default BlogPost
