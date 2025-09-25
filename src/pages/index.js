import * as React from "react"
import { Link } from "gatsby"
import { graphql } from 'gatsby'
import Layout from "../components/trucklayout"

//import { StaticImage } from "gatsby-plugin-image"

//import Layout from "../components/layout"
//import { Seo } from "../components/seo"

const IndexPage = ({ data }) => {
  return (
    <Layout pageTitle="Food Truck Alley">
      <main>
        <div className="row px-3">
        {
          data.allMongodbFoodtruckalleyFoodTrucks.nodes.map((node) => (

              <div className="col-md-4">
                <div className="card w-85" key={node.id}>
                  <img src={node.images} className="card-img-top" alt={node.name} />
                  <div className="card-body">
                    <h3 className="card-title"><Link to={`/profile/${node.slug}`}>{node.title}</Link></h3>
                    <h4 className="card-text">Status: {node.status}</h4>
                    <p className="card-text">Hours: {node.hours}</p>
                    <p className="card-text">Phone: {node.phone}</p>
                    <p className="card-text">Location: {node.location}</p>
                  </div>
                </div>
              </div>
          ))
        }
        </div>

      </main>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMongodbFoodtruckalleyFoodTrucks {
      nodes {
        name
        hours
        phone
        cuisine
        location
        status
        images{
          alt
          url
        }
      }
    }
  }
`
export const Head = () => <title>Food Truck Alley</title>

export default IndexPage
