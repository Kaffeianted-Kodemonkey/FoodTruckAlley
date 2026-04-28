import * as React from 'react';
import { Link } from 'gatsby';

const Navbar = ({ onToggleSearch, onToggleFeedback }) => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark  border-bottom sticky-top py-2 px-3">
      <div className="container-fluid p-0">
        {/* LEFT: Branding & Search Toggle */}
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-outline-light d-flex align-items-center"
            onClick={onToggleSearch}
            type="button"
            aria-label="Toggle Search"
          >
            <span className="me-2"><i class="bi bi-list"></i></span>
            <span className="d-none d-sm-inline">Find Food</span>
          </button>

          {/* LOGO / BRAND */}
          <Link className="navbar-brand fw-bold flex-grow-1" to="/">
            <i className="bi bi-truck text-warning fs-4"></i>  <span className="text-warning">FoodTruck</span>Alley
          </Link>
        </div>

        {/* RIGHT: Actions */}
        <div className="d-flex align-items-center gap-2 gap-md-3">

          {/* FOODIE FEEDBACK ICON */}
          <button
            className="btn btn-link text-white p-1"
            title="App Feedback"
            aria-label="Submit Feedback"
            onClick={onToggleFeedback}
          >
            <i className="bi bi-chat-heart fs-5"></i>
          </button>

          {/* VENDOR/ORGANIZER UPGRADE ICON */}
          <Link
            to="/Vendors"
            className="btn btn-outline-warning border-0 p-2 px-md-2 d-flex align-items-center gap-1"
            title="Vendor Upgrade"
          >
            <i className="bi bi-rocket-takeoff fs-5 text-warning"></i>
            <span className="small fw-bold d-none d-md-inline text-dark">Get Listed</span>
          </Link>

          {/* SIGN IN / ACCOUNT */}
          <Link
            to="/Vendor/Dashboard"
            className="btn btn-primary rounded-pill px-2 px-md-4 py-1 small shadow-sm fw-bold text-decoration-none"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
