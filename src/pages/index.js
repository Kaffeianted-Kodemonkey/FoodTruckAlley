// pages/index.js
import * as React from 'react';
import { useState, useMemo, useCallback, useRef } from 'react';
import { graphql } from 'gatsby';

import FoodTruckSearch from '../components/FoodTruckSearch';
import FeaturedTrucks from '../components/FeaturedTrucks';
import Map from '../components/Map';
import TLayout from '../components/trucklayout';

const Homepage = ({ data }) => {
  const foodTrucks = data?.allMongodbFoodtruckalleyFoodTrucks?.nodes || [];

  // === STATE ===
  const [filteredTrucks, setFilteredTrucks] = useState(foodTrucks);
  const [searchLocation, setSearchLocation] = useState(null);
  const [travelPath, setTravelPath] = useState(null);

  // === MEMOIZED FEATURED (ONCE) ===
  const initialFeatured = useMemo(() => {
    return [...foodTrucks].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [foodTrucks]);

  // === STABLE CALLBACK ===
  const handleFilterChange = useCallback((trucks, loc, path) => {
    setFilteredTrucks(trucks);
    setSearchLocation(loc);
    setTravelPath(path);
  }, []);

  // === STABLE DISPLAY TRUCKS (NO RECALCULATION) ===
  const displayTrucksRef = useRef(initialFeatured);
  const isFilteredRef = useRef(false);

  // Only update when filter actually changes
  if (filteredTrucks.length !== foodTrucks.length) {
    displayTrucksRef.current = filteredTrucks;
    isFilteredRef.current = true;
  } else if (isFilteredRef.current) {
    displayTrucksRef.current = initialFeatured;
    isFilteredRef.current = false;
  }

  const displayTrucks = displayTrucksRef.current;

  return (
    <TLayout>
      <div className="d-flex flex-column vh-100 overflow-hidden">
        <div className="flex-grow-1 d-flex overflow-hidden">

          {/* LEFT: SEARCH */}
          <div className="col-md-3 bg-white border-end d-flex flex-column" style={{ height: '100%' }}>
            <div className="p-4 flex-grow-1 overflow-auto">
              <h4 className="text-primary fw-bold mb-4">Find Food Trucks</h4>
              <FoodTruckSearch
                foodTrucks={foodTrucks}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* RIGHT: MAP + RESULTS */}
          <div className="col-md-9 d-flex flex-column" style={{ height: '100%' }}>
            <div className="flex-grow-1" style={{ minHeight: 0 }}>
              <Map
                filteredTrucks={filteredTrucks}
                searchLocation={searchLocation}
                travelPath={travelPath}
              />
            </div>

            <div className="bg-light border-top" style={{ height: '40%', overflowY: 'auto' }}>
              <div className="container-fluid px-3 py-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-primary fw-bold mb-0">
                    {filteredTrucks.length === foodTrucks.length
                      ? 'Featured Trucks'
                      : `Search Results (${filteredTrucks.length})`}
                  </h5>
                  {filteredTrucks.length !== foodTrucks.length && (
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setFilteredTrucks(foodTrucks);
                        setSearchLocation(null);
                        setTravelPath(null);
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {displayTrucks.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">
                      <strong>No trucks match your search.</strong><br />
                      Try adjusting filters.
                    </p>
                  </div>
                ) : (
                  <FeaturedTrucks trucks={displayTrucks} limit={6} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TLayout>
  );
};

export const query = graphql`
  query {
    allMongodbFoodtruckalleyFoodTrucks {
      nodes {
        id
        truck_id
        name
        cuisine
        status
        images { url alt }
        mainLocation { lat lng address }
        eventLocation { lat lng address }
        isAtEvent
        menu { dietary }
      }
    }
  }
`;

export default Homepage;
