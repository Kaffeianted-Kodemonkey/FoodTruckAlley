// src/components/FeaturedTrucks.js
import React, { memo } from 'react';
import { Link } from 'gatsby';

const TruckCard = memo(({ truck }) => {
  const imageUrl =
    truck.images?.[0]?.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(truck.images[0].url)
      ? truck.images[0].url
      : 'https://via.placeholder.com/400x250/f8f9fa/6c757d?text=No+Image';

  return (
    <div className="col">
      <div className="card h-100 shadow-sm rounded-4 overflow-hidden border-0">
        <img
          src={imageUrl}
          alt={truck.images?.[0]?.alt || truck.name}
          className="card-img-top"
          style={{ height: '240px', objectFit: 'cover' }}
          loading="lazy"
        />
        <div className="position-absolute top-0 end-0 m-2">
          <span
            className={`badge rounded-pill px-3 py-1 fs-7 fw-semibold text-white ${
              truck.status === 'Open' ? 'bg-success' : 'bg-secondary'
            }`}
          >
            {truck.status === 'Open' ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="card-body d-flex flex-column p-3">
          <h6 className="card-title fw-bold text-primary mb-1 text-truncate">
            {truck.name || 'Unnamed Truck'}
          </h6>
          <p className="card-text small text-muted mb-2 text-truncate">
            {truck.cuisine?.join(' • ') || 'Various'}
          </p>
          <div className="col-6 btn-group mt-auto">
            <Link to={`/truck/${truck.truck_id || truck.id}`} className="btn btn-sm btn-success">
              View Map
            </Link>
            <Link to={`/truck/${truck.truck_id || truck.id}`} className="btn btn-sm btn-warning">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}, (prev, next) => prev.truck.id === next.truck.id);

TruckCard.displayName = 'TruckCard';

const FeaturedTrucks = ({ trucks = [], limit = 12 }) => {
  const display = trucks.slice(0, limit);

  if (!display.length) {
    return (
      <div className="text-center text-muted py-5">
        <p className="mb-0">No food trucks available.</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3 g-lg-4">
      {display.map(truck => (
        <TruckCard key={truck.truck_id || truck.id} truck={truck} />
      ))}
    </div>
  );
};

export default memo(FeaturedTrucks);
