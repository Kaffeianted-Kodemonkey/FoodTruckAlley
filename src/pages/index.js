import * as React from "react"
import { useState } from "react"
//import { Link } from "gatsby"
import { graphql } from 'gatsby'
import TruckLayout from "../components/trucklayout"
import TSearch from '../components/tsearch';
import Map from '../components/map';

// Placeholder food truck data (replace with GraphQL or API data)
const initialFoodTrucks = [
  {
    id: 1,
    name: 'Taco Haven',
    mainLocation: { lat: 37.7749, lng: -122.4194, address: '123 Food Truck St, San Francisco, CA' },
    eventLocation: null,
    isAtEvent: false,
    cuisine: 'Mexican',
  },
  {
    id: 2,
    name: 'Burger Wheels',
    mainLocation: { lat: 37.7849, lng: -122.4094, address: '456 Taco Ave, San Francisco, CA' },
    eventLocation: { lat: 37.7949, lng: -122.3994, address: '789 Event Plaza, San Francisco, CA' },
    isAtEvent: true,
    cuisine: 'American',
  },
];

const IndexPage = () => {
  const [filteredTrucks, setFilteredTrucks] = useState(initialFoodTrucks);
  const [searchLocation, setSearchLocation] = useState(null);
  const [travelPath, setTravelPath] = useState(null);

  return (
    <TruckLayout>
      <div className="col-md-3">
        <TSearch
          foodTrucks={initialFoodTrucks}
          setFilteredTrucks={setFilteredTrucks}
          setSearchLocation={setSearchLocation}
          setTravelPath={setTravelPath}
        />
      </div>
      <div className="col-md-9">
        <Map foodTrucks={filteredTrucks} travelPath={travelPath} searchLocation={searchLocation} />
      </div>
    </TruckLayout>
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
        hours
        mainLocation { lat lng address }
        eventLocation { lat lng address }
        isAtEvent
        menu
        phone
        email
        socials { facebook twitter instagram }
        attending_events
        images { url alt }
        last_updated
      }
    }
  }
`

export const Head = () => <title>Food Truck Alley</title>

export default IndexPage;
