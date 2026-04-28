import * as React from 'react';

const Feedback = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2000); // Close after 2 seconds
  };

  return (
    <div 
      className="bg-white shadow-lg border-top"
      style={{
        position: 'fixed',
        bottom: isOpen ? '0' : '-100%',
        left: 0,
        right: 0,
        zIndex: 3000,
        transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        maxHeight: '80vh'
      }}
    >
      <div className="p-4">
        {/* Handle for dragging visual */}
        <div className="mx-auto bg-light rounded-pill mb-4" style={{ width: '40px', height: '5px' }}></div>
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">App Feedback</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <p className="text-muted small">How can we make FoodTruckAlley better for you?</p>
            
            <div className="mb-3">
              <label className="form-label small fw-bold">WHAT'S ON YOUR MIND?</label>
              <select className="form-select bg-light border-0">
                <option>Suggest a Feature</option>
                <option>Report a Bug</option>
                <option>Truck Info is Wrong</option>
                <option>Other</option>
              </select>
            </div>

            <div className="mb-4">
              <textarea 
                className="form-control bg-light border-0" 
                rows="4" 
                placeholder="Tell us more..."
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100 py-3 rounded-4 fw-bold">
              Send Feedback
            </button>
          </form>
        ) : (
          <div className="py-5 text-center">
            <i className="bi bi-check-circle-fill text-success display-4 mb-3"></i>
            <h5 className="fw-bold">Thanks for the input!</h5>
            <p className="text-muted">We're building this for you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
