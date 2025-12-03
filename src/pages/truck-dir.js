import * as React from 'react';
import { useState } from 'react';
import { graphql, Link } from 'gatsby';
// import TSearch from '../components/tsearch';
import TLayout from '../components/trucklayout';

const TruckDirectory = ({ data }) => {
  const foodTrucks = data?.allMongodbFoodtruckalleyFoodTrucks?.nodes || [];
  const [filteredTrucks, /*setFilteredTrucks*/] = useState(foodTrucks);

  console.log('Food trucks:', foodTrucks);
  console.log('Filtered trucks:', filteredTrucks);

  return (
    <TLayout>
      <h3 className="mb-4">Food Truck Directory</h3>
      {/* Uncomment to add search functionality */}
      {/* <TSearch
        foodTrucks={foodTrucks}
        setFilteredTrucks={setFilteredTrucks}
        setSearchLocation={() => {}} // Placeholder for map integration
        setTravelPath={() => {}} // Placeholder for map integration
      /> */}
      {filteredTrucks.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          No food trucks available. Please check your database connection.
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Current Location</th>
                  <th scope="col">Hours</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Email</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {filteredTrucks.map((truck) => (
                  <tr key={truck.truck_id || truck.id}>
                    <td>{truck.name || 'Unnamed Truck'}</td>
                    <td>
                      <span
                        className={`badge ${
                          truck.status === 'Open' ? 'bg-success' : 'bg-danger'
                        }`}
                      >
                        {truck.status || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      {truck.isAtEvent && truck.eventLocation?.address
                        ? truck.eventLocation.address
                        : truck.mainLocation?.address || 'Not specified'}
                    </td>
                    <td>{truck.hours || 'Not specified'}</td>
                    <td>{truck.phone || 'Not specified'}</td>
                    <td>{truck.email || 'Not specified'}</td>
                    <td>
                      <Link
                        to={`/truck/${truck.truck_id || truck.id}`}
                        className="btn btn-sm btn-primary"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
        hours
        mainLocation { address, lat, lng }
        eventLocation { address, lat, lng }
        isAtEvent
        phone
        email
      }
    }
  }
`;

export default TruckDirectory;
