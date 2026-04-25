// src/templates/item-details.js
import * as React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';

const ListingDetails = ({ data }) => {
  // item will be either the truck or the event found by the ID
  const item = data?.trucksJson || data?.eventsJson;

  if (!item) {
    return <Layout>item not found.</Layout>;
  }
  
  const isTruck = !!item.cuisine; 

  return (
    <Layout>
      <div className="bg-dark text-white p-4">
        <Link to="/" className="btn btn-sm btn-outline-light rounded-pill mb-3">
          <i className="bi bi-arrow-left me-1"></i> Back to Directory
        </Link>
        <h1 className="fw-bold">{item.title}</h1>
        <p className="text-warning mb-0">{isTruck ? item.cuisine : item.location}</p>
      </div>

      <div className="container py-4">
        <div className="row g-2 mb-4">
          <div className="col-6">
            <a href={`https://google.com{item.lat},${item.lng}`} target="_blank" rel="noreferrer" className="btn btn-outline-primary w-100 py-2 rounded-pill text-decoration-none text-center">
              <i className="bi bi-geo-alt-fill me-1"></i> Directions
            </a>
          </div>
          <div className="col-6">
            <button className="btn btn-outline-primary w-100 py-2 rounded-pill">
              <i className="bi bi-telephone-fill me-1"></i> Call
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h5 className="fw-bold border-bottom pb-2">About</h5>
          <p className="text-muted small">{item.description}</p>
          <div className="d-flex gap-3 small">
            <span><i className="bi bi-clock text-primary me-1"></i> {item.hours}</span>
          </div>
        </div>

        <div className="mb-5">
          <h5 className="fw-bold border-bottom pb-2 mb-3">Today's Menu</h5>
          {item.menu?.map((item, idx) => (
            <div key={idx} className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
              <div>
                <h6 className="mb-0 fw-bold">{item.name}</h6>
                <small className="text-muted">{item.diet}</small>
              </div>
              <span className="fw-bold text-primary">{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ListingDetails;

export const query = graphql`
  query($id: String!) {
    trucksJson(id: { eq: $id }) {
      id, title, cuisine, description, hours, lat, lng, menu { name, price, diet }
    }
    eventsJson(id: { eq: $id }) {
      id, title, location, description, date, time, lat, lng, amenities
    }
  }
`;