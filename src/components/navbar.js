import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

const isActive = ({ isCurrent }) => {
  return isCurrent ? { className: "nav-link active" } : {className: "nav-link"}
}

const ExactNavLink = props => (
  <Link getProps={isActive} {...props} />
)

const Navbar = ({ siteTitle }) => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand" href="#">{siteTitle}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-navbar"
                aria-controls="main-navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="main-navbar">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
          <li className="nav-item">
            <ExactNavLink
              to="/food-trucks"
            >
              Food Trucks
            </ExactNavLink>
          </li>
          <li className="nav-item">
              <ExactNavLink
                to="/"
              >
                Events
              </ExactNavLink>
            </li>
            <li className="nav-item">
              <ExactNavLink
                to="/blog"
              >
                Blog
              </ExactNavLink>
            </li>
            <li className="nav-item">
              <ExactNavLink
                to="/about"
              >
                About
              </ExactNavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  siteTitle: PropTypes.string,
}



export default Navbar
