// pages/index.js
import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { graphql } from 'gatsby';

import FoodTruckSearch from '../components/FoodTruckSearch';
import FeaturedTrucks from '../components/FeaturedTrucks';
import Map from '../components/Map';
import TLayout from '../components/trucklayout';

const Homepage = ({ data }) => {
  const foodTrucks = data?.allMongodbFoodtruckalleyFoodTrucks?.nodes || [];

  const [filteredTrucks, setFilteredTrucks] = useState(foodTrucks);
  const [searchLocation, setSearchLocation] = useState(null);
  const [travelPath, setTravelPath] = useState(null);

  // Memoized featured trucks
  const initialFeatured = useMemo(() =>
    [...foodTrucks].sort(() => 0.5 - Math.random()).slice(0, 6),
    [foodTrucks]
  );

  const handleFilterChange = useCallback((trucks, loc, path) => {
    setFilteredTrucks(trucks);
    setSearchLocation(loc);
    setTravelPath(path);
  }, []);

  const displayTrucks = useMemo(() =>
    filteredTrucks.length === foodTrucks.length ? initialFeatured : filteredTrucks,
    [filteredTrucks, foodTrucks.length, initialFeatured]
  );

  return (
    <TLayout>
      <div className="bg-success-subtle d-flex flex-column min-vh-100">
        <div className="flex-grow-1 d-flex">
          {/* Search Panel */}
          <div className="col-md-3 bg-white border-end d-flex flex-column">
            <div className="p-4 flex-grow-1 overflow-auto">
              <h4 className="text-primary fw-bold mb-4">Find Food Trucks</h4>
              <FoodTruckSearch
                foodTrucks={foodTrucks}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Map + Results */}
          <div className="col-md-9 bg-success-subtle d-flex flex-column">
            <div className="img-thumbnail mt-3 mx-3 p-3 flex-grow-1" style={{ minHeight: '550px' }}>
              <Map filteredTrucks={filteredTrucks} searchLocation={searchLocation} travelPath={travelPath} />
            </div>

            <div className="border-top">
              <div className="container-fluid px-3 py-4">
                <h2 className="text-success fs-1 fw-bold mb-3">
                  {filteredTrucks.length === foodTrucks.length ? 'Featured Trucks' : `Search Results (${filteredTrucks.length})`}
                </h2>
                {displayTrucks.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <strong>No trucks match your search.</strong><br />
                    Try adjusting filters or expanding your area.
                  </div>
                ) : (
                  <FeaturedTrucks
                    trucks={displayTrucks}
                    limit={12}
                  />
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
  query HomepageQuery {
    allMongodbFoodtruckalleyFoodTrucks {
      nodes {
        id
        truck_id
        name
        status
        address
        location {
          type
          coordinates
        }
        hours {
          open
          close
          days
        }
        cuisines {
          name
          slug
          description
        }
        specialties {
          name
          slug
          description
          category
        }
        menu {
          item
          price
          dietary
          description
        }
        phone
        email
        images {
          url
          alt
        }
        last_updated
      }
    }
  }
`;

export default Homepage;
