import * as React from 'react';
import Layout from '../components/layout';
import { Link } from 'gatsby';

const Vendors = () => {
  return (
    <Layout>
      <div className="bg-dark text-white py-5 px-4 text-center">
        <h1 className="display-4 fw-bold">Put Your Truck on the <span className="text-warning">Map</span></h1>
        <p className="lead opacity-75 mx-auto" style={{ maxWidth: '600px' }}>
          Join the #1 platform connecting local foodies with trucks and events in real-time.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold">Get Started</Link>
          <a href="#pricing" className="btn btn-outline-light btn-lg rounded-pill px-5">View Tiers</a>
        </div>
      </div>

      <div className="container py-5" id="pricing">
        <div className="row g-4 justify-content-center">
          {/* FREE TIER */}
          <div className="col-md-5 col-lg-4">
            <div className="card h-100 border-0 shadow-sm rounded-4 p-4">
              <div className="card-body">
                <h3 className="fw-bold">Free</h3>
                <p className="text-muted">Perfect for getting discovered.</p>
                <h2 className="fw-bold mb-4">$0 <small className="text-muted fs-6">/ mo</small></h2>
                <ul className="list-unstyled mb-5">
                  <li className="mb-2"><i className="bi bi-check2 text-success me-2"></i> Basic Map Pin</li>
                  <li className="mb-2"><i className="bi bi-check2 text-success me-2"></i> Truck Title & Cuisine</li>
                  <li className="mb-2"><i className="bi bi-check2 text-success me-2"></i> Direct Directions</li>
                  <li className="mb-2 text-muted opacity-50"><i className="bi bi-x text-danger me-2"></i> Full Signature Menu</li>
                </ul>
                <button className="btn btn-outline-dark w-100 rounded-pill py-2">Select Free</button>
              </div>
            </div>
          </div>

          {/* PREMIUM TIER */}
          <div className="col-md-5 col-lg-4">
            <div className="card h-100 border-primary border-2 shadow rounded-4 p-4 position-relative">
              <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-warning text-dark px-3 py-2 border border-white">
                MOST POPULAR
              </span>
              <div className="card-body">
                <h3 className="fw-bold">Premium Partner</h3>
                <p className="text-muted">Maximize your orders & visibility.</p>
                <h2 className="fw-bold mb-4 text-primary">$29 <small className="text-muted fs-6">/ mo</small></h2>
                <ul className="list-unstyled mb-5">
                  <li className="mb-2"><i className="bi bi-check2-all text-primary me-2"></i> <strong>Everything in Free</strong></li>
                  <li className="mb-2"><i className="bi bi-check2-all text-primary me-2"></i> Verified Gold Badge</li>
                  <li className="bi mb-2"><i className="bi bi-check2-all text-primary me-2"></i> Full Signature Menu</li>
                  <li className="mb-2"><i className="bi bi-check2-all text-primary me-2"></i> Direct "Call to Order" Button</li>
                  <li className="mb-2"><i className="bi bi-check2-all text-primary me-2"></i> Feature in "Catch this Truck"</li>
                </ul>
                <Link to="/register?plan=premium" className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm">Go Premium</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Vendors;
