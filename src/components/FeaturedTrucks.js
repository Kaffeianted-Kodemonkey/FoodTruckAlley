// src/components/FeaturedTruck.js
import * as React from 'react';

const FeaturedTruck = ({ truck, onOpenDetails }) => {
  // Use the passed truck data, or fallback to mock data for safety
  const t = truck || {
    title: "The Taco Tracker",
    cuisine: "Mexican Fusion",
    status: "Open Now",
    hours: "11am - 8pm",
    dietary: "Vegan/GF Options",
    location: "Civic Center Park"
  };

  const isOpen = t.status === "Open Now";

  return (
    <div className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '15px' }}>
      <div className="card-body p-3">
        
        {/* Top Row: Title & Status */}
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h5 className="card-title fw-bold mb-0 text-truncate" style={{ maxWidth: '70%' }}>
            {t.title}
          </h5>
          <span className={`badge rounded-pill ${isOpen ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.7rem' }}>
            {t.status}
          </span>
        </div>

        {/* Cuisine & Dietary */}
        <div className="mb-3">
          <span className="text-primary small fw-bold">{t.cuisine}</span>
          <span className="text-muted small mx-1">•</span>
          <span className="text-muted small">{t.dietary}</span>
        </div>

        {/* Info Row: Hours & Location */}
        <div className="row g-0 mb-3 border-top pt-2">
          <div className="col-6">
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Hours</div>
            <div className="small">🕒 {t.hours}</div>
          </div>
          <div className="col-6 border-start ps-3">
            <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>Current Spot</div>
            <div className="small text-truncate">📍 {t.location}</div>
          </div>
        </div>

        {/* Action Button */}
        <div className="d-grid">
          <button 
            className="btn btn-primary btn-sm rounded-pill fw-bold"
            onClick={() => onOpenDetails(t)}
          >
            View Truck Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTruck;
