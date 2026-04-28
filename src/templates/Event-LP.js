import * as React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';

const EventLP = ({ data }) => {
  const event = data.event;
  // Join logic: Filter all trucks to find only those attending this event
  const attendingTrucks = data.allTrucks.nodes.filter(truck => 
    event.attendingTrucks?.includes(truck.id)
  );

  if (!event) return <Layout>Event not found.</Layout>;

  return (
    <Layout singleItem={event}>
      {/* EVENT HERO SECTION */}
      <div className="bg-primary text-white p-4 shadow-sm border-bottom border-dark border-4">
        <div className="container p-0">
          <Link to="/" className="btn btn-sm btn-outline-light rounded-pill mb-4 border-opacity-25">
            <i className="bi bi-arrow-left me-1"></i> Back to Map
          </Link>
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <span className="badge bg-white text-primary mb-2 fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
                Community Gathering
              </span>
              <h1 className="display-5 fw-bold mb-1">{event.title}</h1>
              <p className="lead-sm text-white-50 mb-0">
                <i className="bi bi-geo-alt-fill me-1"></i> Hosted at: <strong>{event.location}</strong>
              </p>
            </div>
            {event.isUpgraded && <i className="bi bi-patch-check-fill text-white opacity-75 display-6"></i>}
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* MAIN CONTENT: LINEUP & DESCRIPTION */}
          <div className="col-lg-8">
            <section className="mb-5">
              <h4 className="fw-bold mb-3">Event Details</h4>
              <p className="text-secondary lead-sm lh-lg">{event.description}</p>
              
              <div className="row g-2 mt-2">
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-4 d-flex align-items-center">
                    <i className="bi bi-calendar-check text-primary fs-3 me-3"></i>
                    <div>
                      <small className="d-block text-muted fw-bold text-uppercase" style={{ fontSize: '10px' }}>Date</small>
                      <span className="fw-bold">{event.date}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-3 bg-light rounded-4 d-flex align-items-center">
                    <i className="bi bi-clock text-primary fs-3 me-3"></i>
                    <div>
                      <small className="d-block text-muted fw-bold text-uppercase" style={{ fontSize: '10px' }}>Time</small>
                      <span className="fw-bold">{event.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-5">
              <h4 className="fw-bold mb-4">Confirmed Truck Lineup ({attendingTrucks.length})</h4>
              <div className="row g-3">
                {attendingTrucks.length > 0 ? (
                  attendingTrucks.map(truck => (
                    <div key={truck.id} className="col-md-6">
                      <Link to={`/trucks/${truck.slug}`} className="text-decoration-none">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-3 shadow-sm-hover transition-all border-start border-primary border-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="fw-bold mb-0 text-dark">{truck.title}</h6>
                              <small className="text-muted">{truck.cuisine}</small>
                            </div>
                            <i className="bi bi-chevron-right text-muted"></i>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="p-4 border border-dashed rounded-4 text-center text-muted">
                      Lineup being finalized. Stay tuned!
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* SIDEBAR: NAVIGATION & PERKS */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '2rem' }}>
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">Plan Your Visit</h6>
                  <div className="d-grid gap-2">
                    <a 
                      href={`https://google.com{event.lat},${event.lng}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-primary py-3 rounded-3 fw-bold"
                    >
                      <i className="bi bi-map-fill me-2"></i>Navigate to Event
                    </a>
                  </div>
                </div>
              </div>

              {/* AMENITIES SECTION */}
              {event.amenities && (
                <div className="card border-0 bg-dark text-white rounded-4 p-4">
                  <h6 className="fw-bold mb-4 text-warning">
                    <i className="bi bi-stars me-2"></i>Included Perks
                  </h6>
                  <div className="d-flex flex-column gap-3">
                    {event.amenities.map(perk => (
                      <div key={perk} className="d-flex align-items-center small">
                        <i className="bi bi-check2-circle text-success me-3 fs-5"></i>
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($id: String!) {
    event: eventsJson(id: { eq: $id }) {
      id
      title
      slug
      location
      description
      date
      time
      lat
      lng
      amenities
      attendingTrucks
      isUpgraded
    }
    allTrucks: allTrucksJson {
      nodes {
        id
        title
        slug
        cuisine
      }
    }
  }
`;


export default EventLP;

