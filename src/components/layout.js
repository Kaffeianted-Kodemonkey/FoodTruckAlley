import * as React from 'react';
import { useState } from 'react';
import Navbar from './nav';
import Search from './search';
import Gmap from './Gmap';
import Footer from './footer';
import { useSearchData } from '../context/SearchData';
import Feedback from './Feedback';

const Layout = ({ children, singleItem }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  
  const searchContext = useSearchData();

  if (!searchContext) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">{children}</main>
      </div>
    );
  }

  const { 
    filters, 
    setFilters, 
    activeTab, 
    filteredResults 
  } = searchContext;

  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  
  // Create the toggle function for feedback
  const toggleFeedback = () => setIsFeedbackOpen(!isFeedbackOpen);

  const isSingleView = !!singleItem;

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ADDED: Pass the toggle function to the Navbar */}
      <Navbar 
        onToggleSearch={toggleSearch} 
        onToggleFeedback={toggleFeedback} 
      />

      <main className="container-fluid flex-grow-1 p-0 position-relative">
        <div className="d-flex flex-column flex-md-row h-100">

          {/* Side Search Drawer */}
          <div
            className="bg-white border-end shadow-lg"
            style={{
              width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : '300px',
              position: 'fixed',
              left: isSearchOpen ? '0' : '-100%',
              top: 0,
              bottom: 0,
              zIndex: 2000,
              transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Search onClose={toggleSearch} />
          </div>

          <div className="flex-grow-1 w-100">
            {/* Hero Map Section */}
            <div className="row g-0 sticky-top shadow-sm" style={{ zIndex: 1020, top: '56px' }}>
              <div 
                className="col bg-light border-bottom position-relative" 
                style={{ height: '35vh', maxHeight: '400px', minHeight: '250px' }}
              >
                
                {!isSingleView && (filters.query || filters.centerCoords) && (
                  <div className="position-absolute top-0 start-50 translate-middle-x mt-2 w-100 px-3" style={{ zIndex: 1000, maxWidth: '400px' }}>
                    <div className="badge bg-white text-dark shadow-sm p-2 rounded-pill border d-flex align-items-center justify-content-between gap-2 w-100">
                      <div className="text-truncate small">
                        <i className="bi bi-geo-alt-fill text-primary me-1"></i>
                        Searching <strong>{filters.radius}mi</strong> of <strong>{filters.locationLabel}</strong>
                      </div>
                      <button 
                        className="btn-close" 
                        style={{ fontSize: '0.5rem', padding: '0.5rem' }} 
                        onClick={() => setFilters({ ...filters, centerCoords: null, locationLabel: 'Your current view' })}
                      ></button>
                    </div>
                  </div>
                )}

                <Gmap
                  activeTab={isSingleView ? (singleItem.cuisine ? 'Trucks' : 'Events') : activeTab}
                  trucks={isSingleView && singleItem.cuisine ? [singleItem] : (activeTab === 'Trucks' ? filteredResults : [])}
                  events={isSingleView && !singleItem.cuisine ? [singleItem] : (activeTab === 'Events' ? filteredResults : [])}
                  isSingleView={isSingleView}
                  center={filters.centerCoords}
                />
              </div>
            </div>

            {/* List Content */}
            <div className="row g-0">
              <div className="col bg-white">
                {React.Children.map(children, child => {
                  if (React.isValidElement(child)) {
                    return React.cloneElement(child, { items: filteredResults });
                  }
                  return child;
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="d-none d-md-block">
        <Footer />
      </div>

      {isSearchOpen && (
        <div
          className="position-fixed w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 1999, top: 0, left: 0 }}
          onClick={toggleSearch}
        />
      )}

      {/* Backdrop for Feedback Drawer */}
      {isFeedbackOpen && (
        <div
          className="position-fixed w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 2999, top: 0, left: 0 }}
          onClick={() => setIsFeedbackOpen(false)}
        />
      )}

      <Feedback isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};

export default Layout;
