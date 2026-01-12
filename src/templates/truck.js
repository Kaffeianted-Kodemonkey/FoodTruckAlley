// src/pages/truck.js
import * as React from 'react';
import { useState } from 'react';
import { graphql } from 'gatsby';
import TLayout from '../components/trucklayout';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const TruckPage = ({ data }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);

  const truck = data.mongodbFoodtruckalleyFoodTrucks;

  if (!truck) {
    return (
      <TLayout>
        <div className="alert alert-warning text-center py-5">
          Truck not found.
        </div>
      </TLayout>
    );
  }

  const imageUrl = truck.images?.[0]?.url && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(truck.images[0].url)
    ? truck.images[0].url
    : 'https://via.placeholder.com/1200x400/f8f9fa/6c757d?text=' + encodeURIComponent(truck.name || 'Food Truck');

  const altText = truck.images?.[0]?.alt || truck.name || 'Food Truck';

  const mapCenter = truck.location?.coordinates
    ? { lat: truck.location.coordinates[1], lng: truck.location.coordinates[0] }
    : { lat: 40.4555, lng: -109.5287 };

  const cuisineNames = truck.cuisines?.join(', ') || 'Various';
  const specialtyNames = truck.specialties?.join(', ') || 'None';

  return (
    <TLayout>
      {/* Banner Image */}
      <div className="row border-bottom mb-4">
        <div className="col-12 p-0">
          <img
            src={imageUrl}
            alt={altText}
            className="img-fluid w-100 shadow"
            style={{ maxHeight: '350px', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/1200x400/f8f9fa/6c757d?text=' + encodeURIComponent(truck.name);
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="row mb-4 bg-dark text-white rounded-3 p-4 shadow">
        <div className="col-md-8">
          <h1 className="display-4 fw-bold mb-2">{truck.name}</h1>
          <div className="d-flex flex-wrap gap-3 mb-3">
            <span className={`badge fs-4 px-4 py-2 ${truck.status === 'Open' ? 'bg-success' : 'bg-danger'}`}>
              {truck.status || 'Unknown'}
            </span>
            <span className="badge bg-primary fs-5 px-3 py-2">
              {cuisineNames}
            </span>
            {specialtyNames !== 'None' && (
              <span className="badge bg-info fs-5 px-3 py-2">
                {specialtyNames}
              </span>
            )}
          </div>
          <p className="lead mb-1">{truck.address || 'Location not specified'}</p>
        </div>
        <div className="col-md-4 text-md-end mt-3 mt-md-0">
          <h4>Contact</h4>
          {truck.phone && <p className="mb-1">📞 {truck.phone}</p>}
          {truck.email && <p className="mb-1">✉️ {truck.email}</p>}
        </div>
      </div>

      {/* Main Content */}
      <div className="row g-4">
        {/* Menu */}
        <div className="col-lg-8">
          <h3 className="fw-bold mb-4 text-success">Menu</h3>
          {truck.menu?.length > 0 ? (
            <div className="row g-4">
              {truck.menu.map((item, index) => (
                <div key={index} className="col-md-6">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{item.item}</h5>
                      <h6 className="text-success mb-2">${item.price.toFixed(2)}</h6>
                      <p className="text-muted mb-3">{item.description || 'No description'}</p>
                      {item.dietary?.length > 0 && (
                        <div className="d-flex flex-wrap gap-2">
                          {item.dietary.map((diet, i) => (
                            <span key={i} className="badge bg-success-subtle text-success">
                              {diet}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              No menu items available yet.
            </div>
          )}
        </div>

        {/* Map + Details */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h4 className="mb-3">Location</h4>
              <p className="mb-3">{truck.address || 'No address available'}</p>
              <LoadScript googleMapsApiKey={process.env.GATSBY_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '300px' }}
                  center={mapCenter}
                  zoom={15}
                >
                  <Marker position={mapCenter} onClick={() => setSelectedMarker(true)} />
                  {selectedMarker && (
                    <InfoWindow position={mapCenter} onCloseClick={() => setSelectedMarker(null)}>
                      <div>
                        <strong>{truck.name}</strong>
                        <br />
                        {truck.address}
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
      </div>
    </TLayout>
  );
};

export const query = graphql`
  query TruckDetail($truck_id: String!) {
    mongodbFoodtruckalleyFoodTrucks(truck_id: { eq: $truck_id }) {
      id
      truck_id
      name
      status
      address
      location {
        type
        coordinates
      }
      cuisines
      specialties
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
`;

export default TruckPage;
