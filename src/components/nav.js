// src/components/nav.js
import * as React from 'react';
import { Link } from 'gatsby';

const Navbar = ({ onToggleSearch }) => {
  return (
    <nav className="navbar navbar-dark bg-dark px-3 shadow-sm sticky-top" style={{ zIndex: 1100 }}>
      <div className="container-fluid p-0">
        
        {/* HAMBURGER / SEARCH TRIGGER */}
        <button 
          className="btn btn-outline-light me-3 d-flex align-items-center" 
          onClick={onToggleSearch}
          type="button"
          aria-label="Toggle Search"
        >
          <i className="bi bi-list fs-5 me-2"></i>
          <span className="d-none d-sm-inline">Find Food</span>
        </button>

        {/* LOGO / BRAND */}
        <Link className="navbar-brand fw-bold flex-grow-1" to="/">
          <i className="bi bi-truck text-warning me-2"></i>
          FoodTruck<span className="text-warning">Alley</span>
        </Link>

        {/* USER PROFILE / SETTINGS */}
        <div className="d-flex align-items-center gap-3">
          <Link to="/_profile" className="btn btn-sm btn-warning rounded-pill px-3 fw-bold">
            Sign In
          </Link>
          
          <button className="btn btn-link text-white p-0" title="Settings">
            <i className="bi bi-gear fs-5"></i>
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
