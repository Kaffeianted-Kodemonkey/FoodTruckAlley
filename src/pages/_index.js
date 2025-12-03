import * as React from 'react';
import { useState } from 'react';
import { graphql } from 'gatsby';
import TSearch from '../components/tsearch';
import TLayout from '../components/trucklayout';
import Map from '../components/map';
import { Link } from 'gatsby';

// Function to randomly select n items from an array
const getRandomTrucks = (array, n) => {
  if (!array || array.length === 0) return [];
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(n, array.length));
};

const Homepage = ({ data }) => {
  const foodTrucks = data?.allMongodbFoodtruckalleyFoodTrucks?.nodes || [];
  const [filteredTrucks, setFilteredTrucks] = useState(foodTrucks);
  const [searchLocation, setSearchLocation] = useState(null);
  const [travelPath, setTravelPath] = useState(null);

  // Select 3 random trucks for featured section
  const featuredTrucks = getRandomTrucks(foodTrucks, 3);

  console.log('Food trucks:', foodTrucks);
  console.log('Filtered trucks:', filteredTrucks);
  console.log('Search location:', searchLocation);
  console.log('Featured trucks:', featuredTrucks);

  return (
    <TLayout>
      <div className="row">
        <div className="col-md-3">
          <TSearch
            foodTrucks={foodTrucks}
            setFilteredTrucks={setFilteredTrucks}
            setSearchLocation={setSearchLocation}
            setTravelPath={setTravelPath}
          />
        </div>
        <div className="col-md-9">
          <Map
            filteredTrucks={filteredTrucks}
            searchLocation={searchLocation}
            travelPath={travelPath}
            key={JSON.stringify(searchLocation)} // Force map re-render on location change
          />

          <hr />

          <h3 className="mb-4">Featured Food Trucks</h3>
          {foodTrucks.length === 0 ? (
            <div className="alert alert-warning" role="alert">
              No food trucks available. Please check your database connection.
            </div>
          ) : (
            <div className="row">
              {featuredTrucks.map((truck) => {
                // Validate image URL
                const validImageUrl =
                  truck.images &&
                  truck.images[0]?.url &&
                  /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(truck.images[0].url)
                    ? truck.images[0].url
                    : 'https://via.placeholder.com/150';
                const validAltText =
                  truck.images && truck.images[0]?.alt ? truck.images[0].alt : truck.name || 'Food Truck';

                // Log image issues
                console.log(`Image for ${truck.name || 'Unnamed Truck'}:`, {
                  url: truck.images?.[0]?.url,
                  valid: /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(truck.images?.[0]?.url),
                  used: validImageUrl,
                });

                return (
                  <div key={truck.truck_id || truck.id} className="col-4 mb-4">
                    <div className="card" style={{ width: '18rem', height: '20rem' }}>
                      <img
                        src={validImageUrl}
                        className="card-img-top"
                        alt={validAltText}
                        style={{ height: '10rem', objectFit: 'cover' }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{truck.name || 'Unnamed Truck'}</h5>
                        <p className="card-text">
                          {truck.cuisine?.length > 0 ? truck.cuisine.join(', ') : 'No cuisine specified'}
                        </p>
                        <Link
                          to={`/truck/${truck.truck_id || truck.id}`}
                          className="btn btn-primary mt-auto"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
      mainLocation { lat lng }
      eventLocation { lat lng }
      isAtEvent
      menu { dietary }
      images { url alt }
    }
  }
}
`;

export default Homepage;
