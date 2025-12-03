import * as React from 'react'
import { Link } from 'gatsby'

const Navbar = ({ children }) => {
  return (
    <nav className="border-bottom">
      <div className="row bg-success-subtle">
        <div className="container d-flex flex-wrap border-bottom">
          <ul className="nav me-auto">
            <li className="nav-item"><Link to="/" className="nav-link link-body-emphasis">Home</Link></li>
            <li className="nav-item"><Link to="/truck-dir" className="nav-link link-body-emphasis">Truck Directory</Link></li>
            <li className="nav-item"><Link to="/" className="nav-link link-body-emphasis">Pricing</Link></li>
            <li className="nav-item"><Link to="/" className="nav-link link-body-emphasis">FAQs</Link></li>
            <li className="nav-item"><Link to="/" className="nav-link link-body-emphasis">About</Link></li>
          </ul>
          <ul className="nav">
          <li className="nav-item"><Link to="/" className="nav-link link-body-emphasis">Login</Link></li>
          <li className="nav-item"><Link to="/" className="nav-link link-body-emphasis">Sign up</Link></li>
        </ul>
        </div>
      </div>
      <div className="row bg-success text-light">
        <div className="col-md-5">
          <p className="px-3 mt-3">Logo Here</p>
        </div>
        <div className="col-md-7">
          <h1 className="mt-2 text-align-center">Food Truck Alley</h1>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
