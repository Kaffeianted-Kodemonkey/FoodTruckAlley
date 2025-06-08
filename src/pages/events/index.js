import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/layout'
import {Seo} from '../../components/seo'

const Events = ({ data }) => {
  return (
    <Layout pageTitle="Events - Directory">
      <section className="container">
        <h1>Events - Directory</h1>
      </section>

      <main className="container">
        <ul>
        {
          data.allMdx.nodes.map((node) => (
            <li key={node.id}>
              <Link to={`/events/${node.frontmatter.slug}`}>{node.frontmatter.title}</Link>
            </li>
          ))
        }
        </ul>
      </main>
    </Layout>
  )
}
export const query = graphql`
  query {
    allMdx(filter: {frontmatter: {category: {eq: "events"}}}) {
      nodes {
        frontmatter {
          slug
          title
        }
      }
    }
  }
`

export const Head = () => <Seo title="Events - Directory" />

export default Events
