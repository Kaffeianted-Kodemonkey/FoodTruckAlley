// src/components/trucklayout.js
import * as React from 'react';
import Navbar from './nav';
import Footer from './footer';

const TLayout = ({ children }) => (
  <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <main className="container-fluid flex-grow-1">
      {children}
    </main>
    <Footer />
  </div>
);

export default TLayout;
