// src/components/nav.js
import * as React from 'react';
import { Link } from 'gatsby';

const Navbar = () => (
  <nav className="border-bottom">
    <div className="bg-success-subtle border-bottom">
      <div className="container d-flex justify-content-between align-items-center py-3">
        <ul className="nav me-auto">
          <li className="nav-item">
            <Link to="/" className="nav-link link-body-emphasis">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/truck-dir" className="nav-link link-body-emphasis">Truck Directory</Link>
          </li>
          <li className="nav-item">
            <Link to="/pricing" className="nav-link link-body-emphasis">Pricing</Link>
          </li>
          <li className="nav-item">
            <Link to="/faqs" className="nav-link link-body-emphasis">FAQs</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link link-body-emphasis">About</Link>
          </li>
        </ul>
        <ul className="nav">
          <li className="nav-item">
            <Link to="/login" className="nav-link link-body-emphasis">Login</Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link link-body-emphasis">Sign up</Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="bg-success text-light py-3">
      <div className="container d-flex align-items-center">
        <div className="col-md-5 text-center text-md-start">
          <p className="m-0">Logo Here</p>
        </div>
        <div className="col-md-7 text-center text-md-start">
          <h1 className="m-0">Food Truck Alley</h1>
        </div>
      </div>
    </div>
  </nav>
);

export default Navbar;
