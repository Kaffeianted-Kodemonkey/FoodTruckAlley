import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="container d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: "70vh" }}>
        
        {/* Fun Visual Element */}
        <div className="mb-4">
          <span style={{ fontSize: "5rem" }} role="img" aria-label="broken truck">
            🚚💨
          </span>
          <h1 className="display-1 fw-bold text-primary">404</h1>
        </div>

        <h2 className="mb-3">Engine Trouble!</h2>
        <p className="lead text-muted mb-4">
          Looks like this food truck took a wrong turn and ended up in a parking lot that doesn't exist.
        </p>

        <div className="card border-0 bg-light p-4 shadow-sm mb-4" style={{ maxWidth: "500px" }}>
          <p className="mb-0">
            <strong>Don't let your lunch get cold!</strong> <br /> 
            The good news is that there are plenty of other trucks serving up something delicious nearby.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-3">
          <Link to="/" className="btn btn-primary btn-lg px-4 shadow">
            Back to the Map
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-outline-secondary btn-lg px-4"
          >
            Go Back
          </button>
        </div>

        {/* Subtle PWA Branding */}
        <div className="mt-5 text-muted small">
          <p>Tip: Add this app to your home screen so you never lose your way to dinner again!</p>
        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage

export const Head = () => <title>404: Truck Not Found</title>
