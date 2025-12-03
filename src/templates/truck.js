import * as React from 'react';
import { useState } from 'react';
import { graphql } from 'gatsby';
import TLayout from '../components/trucklayout';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const TruckPage = ({ data }) => {
  // Move useState to the top to comply with Rules of Hooks
  const [selectedMarker, setSelectedMarker] = useState(null);

  const truck = data.mongodbFoodtruckalleyFoodTrucks;

  if (!truck) {
    return (
      <TLayout>
        <div className="alert alert-warning" role="alert">
          Truck not found.
        </div>
      </TLayout>
    );
  }

  const validImageUrl =
    truck.images &&
    truck.images[0]?.url &&
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(truck.images[0].url)
      ? truck.images[0].url
      : `https://via.placeholder.com/150?text=${encodeURIComponent(truck.name || 'Food+Truck')}`;
  const validAltText = truck.images && truck.images[0]?.alt ? truck.images[0].alt : truck.name || 'Food Truck';

  const location = truck.isAtEvent && truck.eventLocation ? truck.eventLocation : truck.mainLocation;
  const mapCenter = location?.lat && location?.lng ? { lat: location.lat, lng: location.lng } : { lat: 40.4555, lng: -109.5287 };

  console.log(`Truck page for ${truck.name}:`, {
    image: validImageUrl,
    status: truck.status,
    menu: truck.menu,
    hours: truck.hours,
    location,
    contact: { phone: truck.phone, email: truck.email, website: truck.website },
    socials: truck.socials,
    description: truck.description,
  });

  return (
    <TLayout>
      {/* Banner Image */}
      <div className="row border-bottom">
        <div className="col-12 p-0">
          <img
            src={validImageUrl}
            alt={validAltText}
            className="img-fluid w-100 shadow-sm"
            style={{ maxHeight: '300px', objectFit: 'cover' }}
            onError={(e) => {
              console.log(`Image load error for ${truck.name}: ${validImageUrl}`);
              e.target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(truck.name || 'Food+Truck')}`;
            }}
          />
        </div>
      </div>

      {/* Food Truck Name */}
      <div className="row border-bottom opacity-75 bg-black text-light fw-bold">
        <div className="col-4 pt-4 text-center">
          <h3><strong>Current Location</strong></h3>
          <hr />
          <p>Location: {truck.isAtEvent === 'false' ? truck.mainLocation['address'] : truck.eventLocation['address']}</p>
          <p>Hours: {truck.hours}</p>
        </div>
        {/* Status */}
        <div className="col-4 mt-4 text-center">
          <p className="fs-1"><strong>{truck.name}</strong></p>

          <p>
            <span className={`badge ${truck.status === 'Open' ? 'bg-success' : 'bg-danger'} fs-3`}>
              {truck.status || 'Status Unknown'}
            </span>
          </p>
        </div>

        <div className="col-4 text-center mt-4">
          <h3><strong>Review Ratings</strong></h3>
          <hr />
        </div>
      </div>

      {/* Main Content */}
      <div className="row opacity-75 bg-success text-light fw-bold">
        <div className="col-12 py-3">
          <h3 className="mb-1 text-center fs-1">Menu</h3>
          <p className="text-center mb-0">
            {truck.cuisine && truck.cuisine.length > 0
              ? truck.cuisine.join(' - ')
              : 'No cuisines specified'}
          </p>
        </div>
      </div>

      <div className="row border-bottom opacity-75 bg-success text-light fw-bold pt-3">
        {/* Center Column: Menu */}
        <div className="col-md-8">
          {truck.menu && truck.menu.length > 0 ? (
            <div className="row">
              {truck.menu.map((item, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div
                    className="card h-100 border-0 shadow"
                    style={{
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                      backgroundColor: '#f8f9fa',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.03)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="card-body">
                      <h5 className="card-title text-dark">{item.item}</h5>
                      <h6 className="card-subtitle mb-2 text-success fw-bold">${item.price.toFixed(2)}</h6>
                      <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                        {item.description || 'No description available'}
                      </p>
                      {item.dietary && item.dietary.length > 0 && (
                        <div className="mt-2">
                          {item.dietary.map((diet, idx) => (
                            <span key={idx} className="badge bg-success-subtle text-dark me-1">
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
            <p className="text-muted text-center">No menu items available.</p>
          )}
        </div>

        {/* Right Column: Details */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Details</h3>
              <h5>About</h5>
              <p>{truck.description || 'No description available'}</p>

              <h5>Hours</h5>
              <p>{truck.hours || 'Not specified'}</p>

              <h5>Location</h5>
              <p>{location?.address || 'Not specified'}</p>
              {location?.lat && location?.lng && (
                <LoadScript googleMapsApiKey={process.env.GATSBY_GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ height: '200px', width: '100%' }}
                    center={mapCenter}
                    zoom={15}
                  >
                    <Marker
                      position={mapCenter}
                      onClick={() => setSelectedMarker(truck)}
                    />
                    {selectedMarker && (
                      <InfoWindow
                        position={mapCenter}
                        onCloseClick={() => setSelectedMarker(null)}
                      >
                        <div>
                          <h6>{truck.name}</h6>
                          <p>{location.address}</p>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </LoadScript>
              )}

              <h5 className="mt-3">Contact</h5>
              <p>Phone: {truck.phone || 'Not specified'}</p>
              <p>Email: {truck.email || 'Not specified'}</p>
              <p>
                Website:{' '}
                {truck.website ? (
                  <a href={truck.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                ) : (
                  'Not specified'
                )}
              </p>

              <h5>Socials</h5>
              {truck.socials && truck.socials.length > 0 ? (
                <ul className="list-unstyled">
                  {truck.socials.map((social, index) => (
                    <li key={index}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-success"
                        style={{ transition: 'color 0.2s' }}
                        onMouseEnter={(e) => (e.target.style.color = '#28a745')}
                        onMouseLeave={(e) => (e.target.style.color = '#198754')}
                      >
                        {social.platform || 'Social Link'}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No socials available.</p>
              )}
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
      mainLocation { lat lng }
      eventLocation { lat lng }
      isAtEvent
      menu { dietary }
      images { url alt }
    }
  }
}
`;

export default TruckPage;
