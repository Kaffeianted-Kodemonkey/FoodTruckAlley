import * as React from 'react';
import { Link } from 'gatsby';

const DirectoryListing = ({ item, type, isOpen, onToggle }) => {
  const isTruck = type === 'Trucks';
  const meta = isTruck ? item.status : item.date;

  return (
    <div className={`border-bottom transition-all ${isOpen ? 'bg-light' : 'bg-white'}`}>
      {/* HEADER SECTION */}
      <div 
        className="p-3 d-flex justify-content-between align-items-start" 
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
        role="button"
        tabIndex={0}
      >
        <div className="text-truncate">
          {/* Line 1: Title & Featured Icon */}
          <h6 className="mb-1 fw-bold d-flex align-items-center">
            {item.title} 
            {item.isUpgraded && (
              <i className="bi bi-patch-check-fill text-warning ms-1" title="Premium Partner"></i>
            )}
          </h6>

          {/* Line 2: Cuisine & Status */}
          {isTruck && (
            <div className="small mb-1">
              <span className="text-muted">{item.cuisine}</span>
              <span className="mx-2 opacity-25">|</span>
              <span className={item.status === 'Open Now' ? "text-success fw-bold" : "text-primary"}>
                {meta}
              </span>
            </div>
          )}

          {/* Line 3: Location, City, State */}
          <div className="small text-muted text-truncate">
            <i className="bi bi-geo-alt-fill text-danger me-1" style={{ fontSize: '10px' }}></i>
            {item.location} 
            <span className="opacity-75 ps-1">
               ({item.city || 'Denver'}, {item.state || 'CO'})
            </span>
          </div>
        </div>

        {/* Right side: Star Rating & Chevron */}
        <div className="d-flex align-items-center gap-2 pt-1">
           {isTruck && <span className="text-warning small fw-bold"><i className="bi bi-star-fill me-1"></i>4.8</span>}
           <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>
              <i className="bi bi-chevron-down text-muted"></i>
           </span>
        </div>
      </div>

      {/* EXPANDED SECTION */}
      <div 
        className="overflow-hidden" 
        style={{ 
          maxHeight: isOpen ? '1000px' : '0', 
          transition: 'max-height 0.4s ease-in-out',
          opacity: isOpen ? 1 : 0 
        }}
      >
        <div className="p-3 pt-0 border-top bg-white">
          <div className="py-3">
            <div 
              className="small text-muted mb-3" 
              dangerouslySetInnerHTML={{ __html: item.description }} 
            />
            
            <div className="d-flex gap-2 align-items-center flex-wrap">
              <button 
                className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                onClick={(e) => { e.stopPropagation(); window.open(`https://google.com{item.lat},${item.lng}`); }}
              >
                 <i className="bi bi-geo-alt-fill me-1"></i> Directions
              </button>
              
              {item.isUpgraded ? (
                <Link 
                  to={isTruck ? `/trucks/${item.slug}` : `/events/${item.slug}`} 
                  className="btn btn-sm btn-primary rounded-pill px-4 ms-auto shadow-sm text-decoration-none text-white"
                >
                  {isTruck ? 'View Full Menu' : 'View Event Details'}
                </Link>
              ) : (
                <div className="ms-auto">
                   <small className="text-muted fst-italic" style={{ fontSize: '10px' }}>
                     <i className="bi bi-lock-fill me-1"></i> Details Locked
                   </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryListing;
