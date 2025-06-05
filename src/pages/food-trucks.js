import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import {Seo} from "../components/seo"


const Profile = ({ data }) => {
  return (
    <Layout pageTitle="Food Truck Profile">
      <h1>Directory - Listing</h1>

      <div className="row mt-5">
        <div className="col-4">
          <table class="table table-bordered">
            <tr>
              <td><p className="fs-5">Sort by: [Name, Cusien, Zip-code]</p></td>
            </tr>
          </table>
        </div>
      </div>
      <div className="row mt-2">
          {
            data.allMdx.nodes.map((node) => (
              <div className="col-lg-4 col-md-2">
                <div className="card w-85" key={node.id}>
                  <img src="..." className="card-img-top" alt="..." />
                  <div className="card-body">
                    <h3 class="card-title"><Link to={`/profile/${node.frontmatter.slug}`}>{node.frontmatter.title}</Link></h3>
                    <h4 class="card-text">Status: {node.frontmatter.current_status}</h4>
                    <p class="card-text">Hours: {node.frontmatter.hours}</p>
                    <p class="card-text">Phone: {node.frontmatter.phone}</p>
                    <p class="card-text">Location: {node.frontmatter.location}</p>
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
    allMdx(sort: {frontmatter: {date: DESC}}) {
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
      }
    }
  }
`

export const Head = () => <Seo title="Food Truck Profile" />

export default Profile
