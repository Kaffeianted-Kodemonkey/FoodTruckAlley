import * as React from 'react';
import { useState } from 'react';
import { graphql, Link } from 'gatsby';
import TLayout from '../components/trucklayout';

const TruckDirectory = ({ data }) => {
  const foodTrucks = data?.allMongodbFoodtruckalleyFoodTrucks?.nodes || [];
  const [filteredTrucks] = useState(foodTrucks);

  return (
    <TLayout>
      <h3 className="mb-4">Food Truck Directory</h3>

      {filteredTrucks.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          No food trucks available. Please check your database connection.
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Current Location</th>
                    <th scope="col">Hours</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Email</th>
                    <th scope="col">Details & Information</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrucks.map((truck) => {
                    const currentAddress = truck.isAtEvent && truck.eventLocation?.address
                      ? truck.eventLocation.address
                      : truck.mainLocation?.address || 'Not specified';

                    return (
                      <tr key={truck.truck_id || truck.id}>
                        {/* Name */}
                        <td className="fw-semibold">{truck.name || 'Unnamed Truck'}</td>

                        {/* Status */}
                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-1 ${
                              truck.status === 'Open' ? 'bg-success' : 'bg-danger'
                            }`}
                          >
                            {truck.status || 'Unknown'}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="small">{currentAddress}</td>

                        {/* Hours */}
                        <td className="small">{truck.hours || 'Not specified'}</td>

                        {/* Phone → Click to Call */}
                        <td>
                          {truck.phone ? (
                            <a
                              href={`tel:${truck.phone.replace(/[^+\d]/g, '')}`}
                              className="text-decoration-none text-primary fw-medium"
                              aria-label={`Call ${truck.name}`}
                            >
                              {truck.phone}
                            </a>
                          ) : (
                            <span className="text-muted">Not specified</span>
                          )}
                        </td>

                        {/* Email → Click to Email */}
                        <td>
                          {truck.email ? (
                            <a
                              href={`mailto:${truck.email}`}
                              className="text-decoration-none text-primary fw-medium"
                              aria-label={`Email ${truck.name}`}
                            >
                              {truck.email}
                            </a>
                          ) : (
                            <span className="text-muted">Not specified</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td>
                          <div className="btn-group" role="group">
                            <Link
                              to={`/truck/${truck.truck_id || truck.id}`}
                              className="btn btn-sm btn-success"
                            >
                              View Map
                            </Link>

                            <Link
                              to={`/truck/${truck.truck_id || truck.id}`}
                              className="btn btn-sm btn-warning"
                            >
                              View Profile
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
