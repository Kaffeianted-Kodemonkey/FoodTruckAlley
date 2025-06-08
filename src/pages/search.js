import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import {Seo} from "../components/seo"


const Profile = ({ data }) => {
  return (
    <Layout pageTitle="Food Truck Profile">
      <h1>Search Food Trucks</h1>

      <p>Soon to come an advance search to find your favorit cusien, favorit food truck, or fined a truck near your loction.</p>

      <div className="row mt-2">
        {
          data.allMdx.nodes.map((node) => (
            <div className="col-lg-4 col-md-2 mt-3">
              <div className="card w-75" key={node.id}>
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                  <h3 className="card-title"><Link to={`/profile/${node.frontmatter.slug}`}>{node.frontmatter.title}</Link></h3>
                  <h4 className="card-text">Status: {node.frontmatter.current_status}</h4>
                  <p className="card-text">Hours: {node.frontmatter.hours}</p>
                  <p className="card-text">Phone: {node.frontmatter.phone}</p>
                  <p className="card-text">Location: {node.frontmatter.location}</p>
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
          city
          state
        }
      }
    }
  }
`

export const Head = () => <Seo title="Food Truck Profile" />

export default Profile
