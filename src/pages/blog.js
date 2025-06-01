import * as React from "react"
import { Link } from "gatsby"
import { graphql } from 'gatsby'
import Layout from "../components/layout"
import {Seo} from "../components/seo"


const BlogPage = ({ data }) => {
  return (
    <Layout pageTitle="My Blog Posts">
      <div className="row mt-2">
        {
          data.allFile.nodes.map(node => (
            <div className="col-lg-4 col-md-2 mt-3">
              <div className="card w-75" key={node.name}>
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                  <h5 class="card-title"><Link to="/">{node.name}</Link></h5>
                  <p class="card-text">Statue: [Open/Cose]</p>
                  <p class="card-text">Location: [Current Location]</p>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allFile {
      nodes {
        name
      }
    }
  }
`

export const Head = ({ data }) => <title>{data.site.siteMetadata.title}</title>

export default BlogPage
