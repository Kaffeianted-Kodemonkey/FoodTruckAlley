import * as React from 'react'
import { useState } from 'react';
import { graphql } from 'gatsby';
import TSearch from '../components/tsearch';
import Map from '../components/map';

const Homepage = ({ data }) => {
  const foodTrucks = data.allMongodbFoodtruckalleyFoodTrucks.nodes;
  const [filteredTrucks, setFilteredTrucks] = useState(foodTrucks);
  const [searchLocation, setSearchLocation] = useState(null);
  const [travelPath, setTravelPath] = useState(null);

  console.log('Food trucks:', foodTrucks);
  console.log('Filtered trucks:', filteredTrucks);
  console.log('Search location:', searchLocation);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4">
          <TSearch
            foodTrucks={foodTrucks}
            setFilteredTrucks={setFilteredTrucks}
            setSearchLocation={setSearchLocation}
            setTravelPath={setTravelPath}
          />
        </div>
        <div className="col-md-8">
          <Map
            filteredTrucks={filteredTrucks}
            searchLocation={searchLocation}
            travelPath={travelPath}
          />
        </div>
      </div>
    </div>
  );
}

export const query = graphql`
  query {
    allMongodbFoodtruckalleyFoodTrucks {
      nodes {
        id
        truck_id
        name
        cuisine
        status
        hours
        mainLocation { lat lng address }
        eventLocation { lat lng address }
        isAtEvent
        menu {
          item
          price
          dietary
          description
        }
        phone
        email
        images { url alt }
        last_updated
      }
    }
  }
`;

export default Homepage;
