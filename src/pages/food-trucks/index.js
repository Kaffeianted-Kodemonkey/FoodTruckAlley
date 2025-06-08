import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/layout'
import {Seo} from '../../components/seo'

const FoodTrucks = ({ data }) => {
  return (
    <Layout pageTitle="Food Trucks - Directory">
      <section className="container">
        <h1>Food Trucks - Directory</h1>
      </section>

      <main className="container">
        <div className="row">
          {data.allMdx.nodes.map((node) => (
            <div className="col-lg-4 col-md-2 mt-5" key={node.id}>
              <div className="card w-85">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                  <h3 className="card-title">
                    <Link to={`/food-trucks/${node.frontmatter.slug}`}>
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
      </main>
    </Layout>
  )
}
export const query = graphql`
  query {
    allMdx(filter: {frontmatter: {category: {eq: "food-trucks"}}}) {
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

export const Head = () => <Seo title="Events - Directory" />

export default FoodTrucks
