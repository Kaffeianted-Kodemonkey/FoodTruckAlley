// src/components/search.js
import * as React from 'react';

const Search = ({ onClose }) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Filters applied!");
    onClose(); 
  };

  return (
    <div className="d-flex flex-column h-100 p-4 bg-white shadow">
      {/* Header with Close Button */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-sliders2 text-primary fs-5"></i>
          <h5 className="mb-0 fw-bold">Filter Results</h5>
        </div>
        <button 
          className="btn-close" 
          onClick={onClose} 
          aria-label="Close search"
        ></button>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex-grow-1 d-flex flex-column">
        {/* Keyword Search */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-uppercase text-muted">Keyword</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input 
              type="text" 
              className="form-control border-start-0 bg-light" 
              placeholder="Truck name or dish..." 
            />
          </div>
        </div>

        {/* Cuisine Dropdown */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-uppercase text-muted">Cuisine</label>
          <div className="input-group">
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-egg-fried text-muted"></i>
            </span>
            <select className="form-select border-start-0 bg-light">
              <option value="all">All Cuisines</option>
              <option value="mexican">Mexican / Tacos</option>
              <option value="american">Burgers & BBQ</option>
              <option value="asian">Asian Fusion</option>
              <option value="dessert">Desserts & Coffee</option>
            </select>
          </div>
        </div>

        {/* Status Toggles */}
        <div className="mb-4 bg-light p-3 rounded-3">
          <div className="form-check form-switch mb-2">
            <input className="form-check-input" type="checkbox" id="openNow" />
            <label className="form-check-label fw-bold small" htmlFor="openNow">
              <i className="bi bi-clock-history me-2"></i>Open Now
            </label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="featuredOnly" />
            <label className="form-check-label fw-bold small" htmlFor="featuredOnly">
              <i className="bi bi-patch-check-fill text-primary me-2"></i>Premium Only
            </label>
          </div>
        </div>

        {/* Distance Slider */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-uppercase text-muted d-flex justify-content-between">
            <span><i className="bi bi-geo-alt me-1"></i> Radius</span>
            <span className="text-primary">25 miles</span>
          </label>
          <input type="range" className="form-range" min="1" max="100" step="5" />
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-3">
          <button type="submit" className="btn btn-primary w-100 mb-2 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-check-lg"></i> Update Results
          </button>
          <button 
            type="button" 
            className="btn btn-link w-100 text-muted text-decoration-none small d-flex align-items-center justify-content-center gap-1"
            onClick={() => console.log("Filters Reset")}
          >
            <i className="bi bi-arrow-counterclockwise"></i> Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
