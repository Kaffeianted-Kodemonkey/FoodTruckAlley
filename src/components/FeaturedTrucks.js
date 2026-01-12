// src/components/FeaturedTrucks.js
import React, { memo, useMemo } from 'react';
import { Link } from 'gatsby';
import { StaticImage } from "gatsby-plugin-image";

// Internal card component (no longer exported)
const TruckCard = memo(({ truck, cuisineMap = {}, specialtyMap = {} }) => {
  const hasImage = truck.images?.[0]?.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(truck.images[0].url);

  // Resolve cuisine names with debug fallback
  const cuisineNames = useMemo(() => {
    const names = (truck.cuisines || [])
      .map(id => {
        const idStr = id?.toString();
        const cuisine = cuisineMap[idStr];
        return cuisine ? cuisine.name : `Unknown (${idStr})`;
      })
      .filter(Boolean);
    return names.length > 0 ? names.join(' • ') : 'Various';
  }, [truck.cuisines, cuisineMap]);

  // Resolve specialty names
  const specialtyNames = useMemo(() => {
    const names = (truck.specialties || [])
      .map(id => {
        const idStr = id?.toString();
        const specialty = specialtyMap[idStr];
        return specialty ? specialty.name : `Unknown (${idStr})`;
      })
      .filter(Boolean);
    return names.length > 0 ? names.join(' • ') : '';
  }, [truck.specialties, specialtyMap]);

  // Debug per truck (remove in production)
  console.log(`Truck ${truck.name} cuisines:`, truck.cuisines, '→', cuisineNames);

  return (
    <div className="col">
      <div className="card h-100 shadow-sm rounded-4 overflow-hidden border-0">
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
        <div className="row">
          <div className="col-6 fs-5 text-center">
            <p><strong>Open: {truck.hours.open}</strong></p>
          </div>
          <div className="col-6 fs-5 text-center">
            <p><strong>Close: {truck.hours.close}</strong></p>
          </div>
        </div>
        <hr />
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
            {cuisineNames}
          </p>
          {specialtyNames && (
            <p className="card-text small text-muted mb-2 text-truncate fst-italic">
              {specialtyNames}
            </p>
          )}
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
}, (prev, next) =>
  prev.truck.id === next.truck.id &&
  prev.cuisineMap === next.cuisineMap &&
  prev.specialtyMap === next.specialtyMap
);

TruckCard.displayName = 'TruckCard';

// Reusable helper to build ID → object map
const createReferenceMap = (items = []) => {
  const map = {};
  items.forEach(item => {
    if (item?.id) {
      map[item.id.toString()] = item;
    }
  });
  return map;
};

const FeaturedTrucks = ({ trucks = [], limit = 12, cuisines = [], specialties = [] }) => {
  // Debug: Confirm data arrival
  console.log('FeaturedTrucks props:', {
    trucks: trucks.length,
    cuisines: cuisines.length,
    firstCuisineId: cuisines[0]?.id,
    firstCuisineName: cuisines[0]?.name,
    specialties: specialties.length
  });

  const cuisineMap = useMemo(() => createReferenceMap(cuisines), [cuisines]);
  const specialtyMap = useMemo(() => createReferenceMap(specialties), [specialties]);

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
          cuisineMap={cuisineMap}
          specialtyMap={specialtyMap}
        />
      ))}
    </div>
  );
};

export default memo(FeaturedTrucks);
  
