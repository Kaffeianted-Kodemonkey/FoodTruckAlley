// src/components/layout.js
import * as React from 'react';
import { useState } from 'react';
import Navbar from './nav';
import Search from './search'; 
import Gmap from './Gmap'; // Updated from MapMock
import Footer from './footer';

const Layout = ({ children, activeTab, trucks, events }) => { 
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <div className="d-flex flex-column min-vh-100 overflow-hidden">
      {/* 1. Sticky Navbar */}
      <Navbar onToggleSearch={toggleSearch} />

      <main className="container-fluid flex-grow-1 p-0 position-relative">
        <div className="d-flex h-100">

          {/* 2. Side Search Drawer (PWA style) */}
          <div
            className="bg-white border-end shadow-sm"
            style={{
              width: '300px',
              position: 'absolute',
              left: isSearchOpen ? '0' : '-300px',
              top: 0,
              bottom: 0,
              zIndex: 1050,
              transition: '0.3s ease-in-out'
            }}
          >
            <Search onClose={toggleSearch} />
          </div>

          {/* 3. Main Viewport */}
          <div className="flex-grow-1 w-100 transition-all">
            
            {/* Hero Map Section - Using Gmap with GraphQL data */}
            <div className="row g-0">
              <div className="col bg-light border-bottom" style={{ height: '350px' }}>
                <Gmap 
                  activeTab={activeTab || 'Trucks'} 
                  trucks={trucks} 
                  events={events} 
                />
              </div>
            </div>

            {/* The rest of the page content (Slider + Directory) is passed via children */}
            <div className="row g-0">
              <div className="col">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Bottom Tab Bar / Footer */}
      <Footer />

      {/* 5. Overlay for Search Drawer */}
      {isSearchOpen && (
        <div
          className="position-fixed w-100 h-100"
          style={{ 
            background: 'rgba(0,0,0,0.3)', 
            zIndex: 1040, 
            top: 0, 
            left: 0 
          }}
          onClick={toggleSearch}
        />
      )}
    </div>
  );
};

export default Layout;
