import * as React from 'react'
import { Link } from 'gatsby'

const Footer = ({ pageTitle, children }) => {
  return (
    <div className="container">
      <footer className="d-flex justify-content-between align-items-center py-0 mt-3">
        <div className="col-md-4 mb-0 text-body-secondary">
          <p>© 2025 Food Truck Alley </p>
        </div>
        <div className="col-md-4 mb-0 text-body-secondary">
          <p><Link to="#" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none" aria-label="Bootstrap">Logo Here</Link></p>
        </div>
        <div className="col-md-4 mb-0 text-body-secondary">
          <ul className="nav justify-content-end">
            <li className="nav-item"><Link to="#" className="nav-link px-2 text-body-secondary">Home</Link></li>
            <li className="nav-item"><Link to="#" className="nav-link px-2 text-body-secondary">Features</Link></li>
            <li className="nav-item"><Link to="#" className="nav-link px-2 text-body-secondary">Pricing</Link></li>
            <li className="nav-item"><Link to="#" className="nav-link px-2 text-body-secondary">FAQs</Link></li>
            <li className="nav-item"><Link to="#" className="nav-link px-2 text-body-secondary">About</Link></li>
          </ul>
        </div>
      </footer>
    </div>
    )
  }

  export default Footer
