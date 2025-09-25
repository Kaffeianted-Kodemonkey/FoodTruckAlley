import * as React from 'react'
import { Link } from 'gatsby'
import Navbar from './nav'
import Map from './map'
import Footer from './footer'
import TSearch from './tsearch'

const Layout = ({ pageTitle, children }) => {
  return (
    <div>
      <Navbar />

      <div className="row">
        <div className="col-md-3 mt-3 px-5">
          <h2 className="fs-3 text-center">Search Nearby Food Trucks</h2>
          <hr />

          <TSearch />
        </div>
        <div className="col-md-8 mt-5">
          <Map />
          {children}
        </div>
      </div>
      <div className="bg-body-tertiary fixed-bottom">
        <Footer />
      </div>
    </div>
  )
}

export default Layout
