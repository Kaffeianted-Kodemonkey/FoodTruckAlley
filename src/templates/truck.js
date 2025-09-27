import * as React from 'react';
import { graphql } from 'gatsby';
import TLayout from '../components/trucklayout';

const TruckPage = ({ data }) => {
  const truck = data.mongodbFoodtruckalleyFoodTrucks;

  if (!truck) {
    return (
      <TLayout>
        <div className="container">
          <div className="alert alert-warning" role="alert">
            Truck not found.
          </div>
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

  console.log(`Truck page for ${truck.name}:`, {
    image: validImageUrl,
    status: truck.status,
    menu: truck.menu,
    hours: truck.hours,
    location: truck.isAtEvent ? truck.eventLocation : truck.mainLocation,
    contact: { phone: truck.phone, email: truck.email },
    socials: truck.socials,
  });

  return (
    <TLayout>
      <div className="container-fluid">
        {/* Banner Image */}
        <div className="row">
          <div className="col-12 p-0">
            <img
              src={validImageUrl}
              alt={validAltText}
              className="img-fluid w-100"
              style={{ maxHeight: '300px', objectFit: 'cover' }}
              onError={(e) => {
                console.log(`Image load error for ${truck.name}: ${validImageUrl}`);
                e.target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(truck.name || 'Food+Truck')}`;
              }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="row justify-content-center my-3">
          <div className="col-auto">
            <span className={`badge ${truck.status === 'Open' ? 'bg-success' : 'bg-danger'}`}>
              {truck.status || 'Status Unknown'}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="row">
          {/* Center Column: Menu */}
          <div className="col-md-8">
            <h2>Menu</h2>
            {truck.menu && truck.menu.length > 0 ? (
              <div className="list-group">
                {truck.menu.map((item, index) => (
                  <div key={index} className="list-group-item">
                    <h5>{item.item}</h5>
                    <p className="mb-1">${item.price.toFixed(2)}</p>
                    <p className="mb-1">{item.description || 'No description available'}</p>
                    {item.dietary && item.dietary.length > 0 && (
                      <p className="mb-0">
                        <small>Dietary: {item.dietary.join(', ')}</small>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No menu items available.</p>
            )}
          </div>

          {/* Right Column: Hours, Location, Contact, Socials */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Details</h3>
                <h5>Hours</h5>
                <p>{truck.hours || 'Not specified'}</p>

                <h5>Location</h5>
                <p>
                  {truck.isAtEvent && truck.eventLocation?.address
                    ? truck.eventLocation.address
                    : truck.mainLocation?.address || 'Not specified'}
                </p>

                <h5>Contact</h5>
                <p>Phone: {truck.phone || 'Not specified'}</p>
                <p>Email: {truck.email || 'Not specified'}</p>

                <h5>Socials</h5>
                {truck.socials && truck.socials.length > 0 ? (
                  <ul className="list-unstyled">
                    {truck.socials.map((social, index) => (
                      <li key={index}>
                        <a href={social.url} target="_blank" rel="noopener noreferrer">
                          {social.platform || 'Social Link'}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No socials available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TLayout>
  );
};

export default TruckPage;
