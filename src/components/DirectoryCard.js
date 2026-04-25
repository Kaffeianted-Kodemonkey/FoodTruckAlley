// src/components/DirectoryCard.js
// This page May NOT be Needed!!!

import * as React from 'react';
import { Link } from 'gatsby';

const DirectoryCard = ({ truck, onOpenPopup, onSave }) => {
  const { title, cuisine, rating, hours, location, isUpgraded, slug } = truck;

  return (
    <div className="d-flex align-items-center justify-content-between p-3 border-bottom bg-white">
      {/* 1. Basic Info Section */}
      <div className="flex-grow-1 text-truncate">
        <div className="d-flex align-items-center gap-2">
          <h6 className="mb-0 fw-bold">{title}</h6>
          <span className="text-warning small"><i className="bi bi-star-fill text-warning ms-1"></i>{rating || '4.8'}</span>
        </div>
        <small className="text-muted d-block text-truncate">
          {cuisine} • {location} • <span className="text-success fw-bold">{hours}</span>
        </small>
      </div>

      {/* 2. Action Cluster */}
      <div className="d-flex align-items-center gap-2 ms-3">
        {/* Save/Bookmark Button */}
        <button 
          onClick={() => onSave(truck.id)} 
          className="btn btn-sm btn-outline-light border-0 text-secondary p-1"
          title="Save to Favorites"
        >
         <i class="bi bi-bookmark-heart"></i>
        </button>

        {/* Dynamic Navigation Button */}
        {isUpgraded ? (
          <Link to={`/trucks/${slug}`} className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm">
            View Menu !!!
          </Link>
        ) : (
          <button onClick={() => onOpenPopup(truck)} className="btn btn-sm btn-outline-primary rounded-pill px-3">
            Quick Info
          </button>
        )}
      </div>
    </div>
  );
};
