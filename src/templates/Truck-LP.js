import * as React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';

const TruckLP = ({ data }) => {
  const truck = data.truck;
  const scheduledEvents = data.allEvents.nodes.filter(event => 
    truck.eventSchedule?.includes(event.id)
  );

  if (!truck) return <Layout>Truck not found.</Layout>;

  return (
    <Layout singleItem={truck}>
      {/* BRAND HEADER */}
      <div className="bg-dark text-white p-4 shadow-sm border-bottom border-warning border-4">
        <div className="container p-0">
          <Link to="/" className="btn btn-sm btn-outline-light rounded-pill mb-4 opacity-75">
            <i className="bi bi-arrow-left me-1"></i> Back to Map
          </Link>
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <span className="badge bg-warning text-dark mb-2 fw-bold text-uppercase">{truck.cuisine}</span>
              <h1 className="display-5 fw-bold mb-1">{truck.title}</h1>
              <p className="lead-sm text-white-50 mb-0">
                <i className="bi bi-geo-alt-fill text-danger me-1"></i> Currently at: <strong>{truck.location}</strong>
              </p>
            </div>
            {truck.isUpgraded && <i className="bi bi-patch-check-fill text-warning display-6"></i>}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* MAIN CONTENT: MENU & ABOUT */}
          <div className="col-lg-8">
            <section className="mb-5">
              <h4 className="fw-bold mb-3">About the Truck</h4>
              <p className="text-secondary lh-lg">{truck.description}</p>
              <div className="p-3 bg-light rounded-4 d-inline-flex align-items-center">
                <i className="bi bi-clock-history text-primary fs-4 me-3"></i>
                <div>
                  <small className="d-block text-muted fw-bold text-uppercase" style={{ fontSize: '10px' }}>Current Hours</small>
                  <span className="fw-bold text-dark">{truck.hours}</span>
                </div>
              </div>
            </section>

            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Signature Menu</h4>
                <span className="badge border text-muted rounded-pill">Prices Subject to Change</span>
              </div>
              <div className="row g-3">
                {truck.menu?.map((item, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 p-3 border-top border-primary border-3">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-bold mb-0">{item.name}</h6>
                        <span className="text-primary fw-bold">{item.price}</span>
                      </div>
                      <small className="text-muted">{item.diet || "Truck Classic"}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR: CONTACT & SCHEDULE */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '2rem' }}>
              {/* Action Card */}
              <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">Quick Actions</h6>
                  <div className="d-grid gap-2">
                    <a href={`https://google.com{truck.lat},${truck.lng}`} target="_blank" rel="noreferrer" className="btn btn-primary py-3 rounded-3 fw-bold">
                      <i className="bi bi-cursor-fill me-2"></i>Navigate Now
                    </a>
                    {truck.phone && (
                      <a href={`tel:${truck.phone}`} className="btn btn-outline-success py-3 rounded-3 fw-bold">
                        <i className="bi bi-telephone-fill me-2"></i>Call to Order
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Card */}
              {scheduledEvents.length > 0 && (
                <div className="card border-0 bg-light rounded-4 p-4">
                  <h6 className="fw-bold mb-4"><i className="bi bi-calendar-event me-2"></i>Upcoming Schedule</h6>
                  {scheduledEvents.map(event => (
                    <Link key={event.id} to={`/events/${event.slug}`} className="text-decoration-none mb-3 d-block group">
                      <div className="bg-white p-3 rounded-3 shadow-sm-hover transition-all">
                        <div className="d-flex align-items-center">
                           <div className="bg-primary bg-opacity-10 text-primary rounded px-2 py-1 me-3 text-center" style={{ minWidth: '50px' }}>
                              <small className="fw-bold d-block" style={{ fontSize: '10px' }}>MAY</small>
                              <span className="fw-bold">12</span>
                           </div>
                           <div>
                             <h6 className="mb-0 text-dark fw-bold small">{event.title}</h6>
                             <small className="text-muted" style={{ fontSize: '11px' }}>{event.location}</small>
                           </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TruckLP;

export const query = graphql`
  query($id: String!) {
    truck: trucksJson(id: { eq: $id }) {
      id
      title
      slug
      cuisine
      description
      hours
      location
      lat
      lng
      phone
      isUpgraded
      eventSchedule
      menu {
        name
        price
        diet
      }
    }
    allEvents: allEventsJson {
      nodes {
        id
        title
        slug
        date
        location
      }
    }
  }
`;
