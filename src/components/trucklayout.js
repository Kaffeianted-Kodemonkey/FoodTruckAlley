import * as React from 'react';
import { Link } from 'gatsby';
import Navbar from './nav';

const TLayout = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {/* Navbar */}
    <Navbar />

    {/* Main Content */}
    <main className="container-fluid">
      {children}
    </main>

    {/* Footer */}
    <footer className="bg-success text-white text-center py-3" style={{ flexShrink: 0 }}>
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

export default TLayout;
