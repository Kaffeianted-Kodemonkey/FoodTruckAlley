import * as React from "react"
import { Link } from "gatsby"
import { graphql } from 'gatsby'
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import { Seo } from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    <section className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">Locate your Favorate Food Truck:</h1>
          <form className="mt-5 mb-5 d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>

          <StaticImage
            src="../images/gatsby-astronaut.png"
            width={300}
            quality={95}
            formats={["AUTO", "WEBP"]}
            alt="A Gatsby astronaut"
            className="img-fluid"
          />

        </div>
      </div>

      <div className="row mt-2">
        {
          data.allFile.nodes.map(node => (
            <div className="col-lg-4 col-md-2 mt-3">
              <div className="card" key={node.name}>
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

    </section>
  </Layout>
)

export const query = graphql`
  query {
    allFile {
      nodes {
        name
      }
    }
  }
`
export const Head = () => <Seo title="Food Truck Alley" />

export default IndexPage
