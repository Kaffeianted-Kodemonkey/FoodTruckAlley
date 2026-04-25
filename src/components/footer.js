// src/components/footer.js
import * as React from 'react';
import { Link } from 'gatsby';

const Footer = () => (
  <>
    {/* MOBILE BOTTOM NAV (PWA Style - Only visible on small screens) */}
    <div className="d-md-none bg-dark border-top fixed-bottom py-2 shadow-lg" style={{ zIndex: 1100 }}>
      <div className="d-flex justify-content-around text-center">
        <Link to="/" className="text-white text-decoration-none small">
          <i className="bi bi-house-door d-block fs-4 text-warning"></i>
          Home
        </Link>
        <Link to="/" className="text-white text-decoration-none small">
          <i className="bi bi-map d-block fs-4"></i>
          Map
        </Link>
        <Link to="/_profile" className="text-white text-decoration-none small">
          <i className="bi bi-person-circle d-block fs-4"></i>
          Profile
        </Link>
        <button className="btn btn-link text-white text-decoration-none p-0 small border-0">
          <i className="bi bi-bookmark-heart d-block fs-4"></i>
          Saved
        </button>
      </div>
    </div>

    {/* DESKTOP FOOTER (Hidden on mobile to save space) */}
    <footer className="bg-dark text-white py-5 mt-auto d-none d-md-block">
      <div className="container-fluid px-4">
        <div className="row g-4">
          {/* Support Section */}
          <div className="col-12 col-md-4 text-md-start">
            <h6 className="text-uppercase fw-bold mb-3 small text-warning">Support</h6>
            <a 
              href="mailto:support@kaffeinatedkodemonkey.com" 
              className="text-white text-decoration-none small d-flex align-items-center gap-2 mb-2"
            >
              <i className="bi bi-envelope-fill"></i> Contact Support
            </a>
            <p className="text-muted small mt-2">Helping foodies find the best street eats since 2026.</p>
          </div>

          {/* Business Links */}
          <div className="col-6 col-md-4">
            <h6 className="text-uppercase fw-bold mb-3 small text-warning">Vendors</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">Get Listed Free</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">FT-Dashboard</a></li>
              <li className="mb-2"><a href="#" className="text-white text-decoration-none">User Profile</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-6 col-md-4">
            <h6 className="text-uppercase fw-bold mb-3 small text-warning">Legal</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <Link to="/privacy" className="text-white text-decoration-none">Privacy Policy</Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-white text-decoration-none">Terms of Service</Link>
              </li>
            </ul>
          </div>      
        </div>

        <hr className="my-4 border-secondary" />

        <div className="row align-items-center">
          <div className="col text-center">
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} <strong>Food Truck Alley</strong>. 
              Built with <i className="bi bi-cup-hot-fill text-warning"></i> by <a href="https://kaffeinatedkodemonkey.com" className="text-muted text-decoration-none">Kaffeinated Kode Monkey</a>.
            </p>
          </div>
        </div>
      </div>
    </footer>
    
    {/* Spacer for mobile to prevent content from being hidden behind the fixed nav */}
    <div className="d-md-none" style={{ height: '70px' }}></div>
  </>
);

export default Footer;
