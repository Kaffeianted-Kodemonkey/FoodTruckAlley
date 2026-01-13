// src/components/FeaturedTrucks.js
import React, { memo } from 'react';
import { Link } from 'gatsby';
import { StaticImage } from "gatsby-plugin-image";

const TruckCard = memo(({ truck }) => {
  const hasImage = truck.images?.[0]?.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(truck.images[0].url);

  // Join all cuisine names (or fallback)
  const cuisineList = truck.cuisines?.length > 0
    ? truck.cuisines.map(c => c.name).join(' • ')
    : 'Various';

  // Join all specialty names (or empty if none)
  const specialtyList = truck.specialties?.length > 0
    ? truck.specialties.map(s => s.name).join(' • ')
    : '';

  return (
    <div className="col">
      <div className="card h-100 shadow-sm rounded-4 overflow-hidden border-0">
        {/* Image */}
        {hasImage ? (
          <img
            src={truck.images[0].url}
            alt={truck.images[0].alt || truck.name}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <StaticImage
            src="https://ordering.port-royal.com/wp-content/uploads/woocommerce-placeholder-e1686240333544.png"
            alt={truck.name + ' - placeholder'}
            className="card-img-top mx-auto"
            style={{ width: '50%', height: 'auto', objectFit: 'cover' }}
            loading="lazy"
          />
        )}

        {/* Hours */}
        <div className="row mt-2 px-3">
          <div className="col-4 text-center">
            <p className="mb-0 fw-bold">Open:</p>
            <p className="mb-0">{truck.hours?.open || 'N/A'}</p>
          </div>
          <div className="col-4 text-center">
            <p className="mb-0 fs-5 fw-bold">{truck.hours.days}</p>
          </div>
          <div className="col-4 text-center">
            <p className="mb-0 fw-bold">Close:</p>
            <p className="mb-0">{truck.hours?.close || 'N/A'}</p>
          </div>
        </div>
        <hr className="my-2" />

        {/* Status badge */}
        <div className="position-absolute top-0 end-0 m-2">
          <span
            className={`badge rounded-pill px-3 py-1 fs-7 fw-semibold text-white ${
              truck.status === 'Open' ? 'bg-success' : 'bg-secondary'
            }`}
          >
            {truck.status === 'Open' ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Card body */}
        <div className="card-body d-flex flex-column p-3">
          <h2 className="card-title fw-bold text-primary mb-2 text-truncate text-center">
            <u>{truck.name || 'Unnamed Truck'}</u>
          </h2>

          {/* Contact info */}
          <p className="text-center small mb-2 fs-6 fw-bold"> {truck.address || 'No address'} </p>
          <p className="text-center small mb-2 fs-6 "> {truck.phone || 'No phone'} • {truck.email || 'No email'}</p>


          <hr className="my-2" />

          {/* Cuisines & Specialties */}
          <div className="row text-center small mb-3">
            <div className="col-6 mb-2">
              <h3 className="fs-4"><strong>Cuisines</strong></h3>
              <p className="mb-0 fs-5">{cuisineList}</p>
            </div>
            <div className="col-6">
              <h3 className="fs-4"><strong>Specialties</strong></h3>
              <p className="mb-0 fs-5">{specialtyList || 'None'}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="btn-group mt-auto">
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
        <TruckCard
          key={truck.truck_id || truck.id}
          truck={truck}
        />
      ))}
    </div>
  );
};

export default memo(FeaturedTrucks);
