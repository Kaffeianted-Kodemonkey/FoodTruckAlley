import * as React from 'react';
import { Link } from 'gatsby';

const FeaturedCard = ({ item }) => {
  // Check type: either by a 'type' property or by presence of 'cuisine'
  const isTruck = item.cuisine !== undefined;
  
  const title = item.title;
  const status = item.status || (isTruck ? "Open Now" : "Upcoming");
  const subtext = isTruck ? item.cuisine : item.location;
  const meta = isTruck ? item.hours : `${item.date} • ${item.time}`;

  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
      <div className="card-body p-3">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="text-truncate" style={{ maxWidth: '70%' }}>
            <div className="d-flex align-items-center gap-1 mb-1">
              <i className={`bi ${isTruck ? 'bi-patch-check-fill' : 'bi-megaphone-fill'} text-warning`}></i>
              <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '0.65rem' }}>
                {isTruck ? 'Featured Truck' : 'Featured Event'}
              </span>
            </div>
            <h5 className="card-title mb-0 fw-bold text-truncate">{title}</h5>
            <small className="text-muted d-block">{subtext}</small>
          </div>
          <span className={`badge ${status === 'Open Now' ? 'bg-success' : 'bg-primary'} rounded-pill shadow-sm`}>
            {status}
          </span>
        </div>

        {/* INFO ROW */}
        <div className="row g-0 small text-muted mb-3 py-2 border-top border-bottom my-2">
          <div className="col-12 d-flex align-items-center">
            <i className={`bi ${isTruck ? 'bi-clock' : 'bi-calendar3'} me-2 text-primary`}></i> 
            <span className="text-truncate">{meta}</span>
          </div>
        </div>

        {/* ACTION BUTTON - Fixed pathing */}
        <div className="d-grid">
          <Link 
            to={isTruck ? `/trucks/${item.slug}` : `/events/${item.slug}`} 
            className="btn btn-primary btn-sm fw-bold rounded-pill shadow-sm py-2 text-center"
          >
            <i className={`bi ${isTruck ? 'bi-truck' : 'bi-calendar-event'} me-2`}></i>
            {isTruck ? 'View Menu' : 'Event Info'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCard;
