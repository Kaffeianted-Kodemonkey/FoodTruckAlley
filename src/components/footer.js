import * as React from 'react'
import { Link } from 'gatsby'

const Footer = ({ pageTitle, children }) => {
  return (
    <div className="container">
      <footer className="bg-dark text-white text-center py-3">
        <p>&copy; 2025 Food Truck Alley. All rights reserved.</p>
        <ul className="list-inline">
          <li className="list-inline-item">
            <Link to="/privacy" className="text-white">Privacy Policy</Link>
          </li>
          <li className="list-inline-item">
            <Link to="/terms" className="text-white">Terms of Service</Link>
          </li>
        </ul>
      </footer>
    </div>
    )
  }

  export default Footer
