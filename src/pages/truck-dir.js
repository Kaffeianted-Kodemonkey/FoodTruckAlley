// src/pages/truck-dir.js
import * as React from 'react';
import { graphql, Link } from 'gatsby';
import TLayout from '../components/trucklayout';

const TruckDirectory = ({ data }) => {
  const foodTrucks = data?.allMongodbFoodtruckalleyFoodTrucks?.nodes || [];

  return (
    <TLayout>
      <div className="container py-5">
        <h1 className="display-5 fw-bold text-success mb-4 text-center">
          Food Truck Directory
        </h1>
        <p className="lead text-center text-muted mb-5">
          Browse all registered food trucks in the Food Truck Alley network.
        </p>

        {foodTrucks.length === 0 ? (
          <div className="alert alert-warning text-center py-5" role="alert">
            <h4>No food trucks found</h4>
            <p className="mb-0">
              The directory is empty or there was an issue loading data. Please check your database connection.
            </p>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded-3 overflow-hidden">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-success text-white">
                <tr>
                  <th scope="col" className="ps-4">Truck Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Current Location</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Email</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {foodTrucks.map((truck) => {
                  const address = truck.address || 'Location not specified';

                  return (
                    <tr key={truck.truck_id || truck.id} className="border-bottom">
                      <td className="ps-4 fw-semibold text-dark">
                        {truck.name || 'Unnamed Truck'}
                      </td>
                      <td>
                        <span
                          className={`badge rounded-pill px-3 py-2 fs-6 ${
                            truck.status === 'Open'
                              ? 'bg-success text-white'
                              : 'bg-secondary text-white'
                          }`}
                        >
                          {truck.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="small text-muted">
                        {address}
                      </td>
                      <td>
                        {truck.phone ? (
                          <a
                            href={`tel:${truck.phone.replace(/[^+\d]/g, '')}`}
                            className="text-success text-decoration-none fw-medium"
                            aria-label={`Call ${truck.name}`}
                          >
                            {truck.phone}
                          </a>
                        ) : (
                          <span className="text-muted small">Not specified</span>
                        )}
                      </td>
                      <td>
                        {truck.email ? (
                          <a
                            href={`mailto:${truck.email}`}
                            className="text-success text-decoration-none fw-medium"
                            aria-label={`Email ${truck.name}`}
                          >
                            {truck.email}
                          </a>
                        ) : (
                          <span className="text-muted small">Not specified</span>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <Link
                            to={`/truck/${truck.truck_id || truck.id}`}
                            className="btn btn-sm btn-outline-success"
                            title="View Map"
                          >
                          Map
                          </Link>
                          <Link
                            to={`/truck/${truck.truck_id || truck.id}`}
                            className="btn btn-sm btn-warning text-white"
                            title="View Full Profile"
                          >
                          Profile
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="text-center mt-5 text-muted small">
          <p>
            Showing <strong>{foodTrucks.length}</strong> food truck{foodTrucks.length !== 1 ? 's' : ''} in the directory.
          </p>
        </div>
      </div>
    </TLayout>
  );
};

// Updated GraphQL query
export const query = graphql`
  query TruckDirectoryQuery {
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
        phone
        email
      }
    }
  }
`;

export default TruckDirectory;
