import * as React from 'react';
import { Link } from 'gatsby';

const TruckLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Food Truck Alley</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login/Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    {/* Main Content */}
    <main className="container-fluid p-0" style={{ flexGrow: 1 }}>
      <div className="row g-0 h-100">{children}</div>
    </main>

    {/* Footer */}
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
);

export default TruckLayout;
