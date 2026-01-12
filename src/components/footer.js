// src/components/footer.js
import * as React from 'react';
import { Link } from 'gatsby';

const Footer = () => (
  <footer className="bg-dark text-white text-center py-3">
    <p>&copy; 2026 Food Truck Alley. All rights reserved.</p>
    <ul className="list-inline mb-0">
      <li className="list-inline-item">
        <Link to="/privacy" className="text-white text-decoration-none">Privacy Policy</Link>
      </li>
      <li className="list-inline-item">
        <Link to="/terms" className="text-white text-decoration-none">Terms of Service</Link>
      </li>
    </ul>
  </footer>
);

export default Footer;
