import * as React from 'react';
import { Link } from 'gatsby';

const DirectoryListing = ({ item, type, isOpen, onToggle }) => {
  const isTruck = type === 'Trucks';
  const subtitle = isTruck ? item.cuisine : item.location;
  const meta = isTruck ? item.hours : item.date;

  return (
    <div className={`border-bottom transition-all ${isOpen ? 'bg-light' : 'bg-white'}`}>
      {/* HEADER SECTION */}
      <div 
        className="p-3 d-flex justify-content-between align-items-center" 
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        <div className="text-truncate">
          <h6 className="mb-0 fw-bold">
            {item.title} 
            {item.isUpgraded && (
              <span title="Premium Partner">
                <i className="bi bi-patch-check-fill text-warning ms-1"></i>
              </span>
            )}
          </h6>
          <small className="text-muted">
            {subtitle} • <span className={isTruck ? "text-success" : "text-primary"}>{meta}</span>
          </small>
        </div>
        <div className="d-flex align-items-center gap-2">
           {isTruck && <span className="text-warning small"><i className="bi bi-star-fill me-1"></i>4.8</span>}
           <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>
              <i className="bi bi-chevron-down"></i>
           </span>
        </div>
      </div>

      {/* EXPANDED SECTION */}
      <div 
        className="overflow-hidden" 
        style={{ 
          maxHeight: isOpen ? '1000px' : '0', // Increased to prevent button cutoff
          transition: 'max-height 0.4s ease-in-out',
          opacity: isOpen ? 1 : 0 
        }}
      >
        <div className="p-3 pt-0 border-top bg-white">
          <div className="py-3">
            <div 
              className="small text-muted mb-3" 
              dangerouslySetInnerHTML={{ __html: item.content || item.description }} 
            />
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-sm btn-outline-secondary rounded-pill px-3">
                 <i className="bi bi-geo-alt-fill me-1"></i> Directions
              </button>
              <button className="btn btn-sm btn-outline-secondary rounded-pill px-2">
                 <i className="bi bi-bookmark-plus me-1"></i> Save
              </button>
              
              {/* This logic handles both Trucks (/trucks/slug) and Events (/events/slug) */}
              {item.isUpgraded && (
                <Link 
                  to={isTruck ? `/trucks/${item.slug}` : `/events/${item.slug}`} 
                  className="btn btn-sm btn-primary rounded-pill px-4 ms-auto shadow-sm text-decoration-none"
                >
                  {isTruck ? 'View Full Menu' : 'View Event Details'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryListing;
