// src/components/Gmap.js
import * as React from 'react';

const Gmap = ({ activeTab, trucks = [], events = [] }) => {
    // Dynamically select pins from GraphQL data based on the active tab
    const pins = activeTab === 'Trucks' ? trucks : events;

    return (
        <div className="w-100 h-100 bg-secondary bg-opacity-10 position-relative overflow-hidden">
            {/* Mock Map Background Branding */}
            <div className="absolute-center text-muted opacity-50 text-center" style={{ zIndex: 0 }}>
                <i className="bi bi-map fs-1 d-block mb-2"></i>
                <small className="fw-bold">Gmap View: {activeTab}</small>
            </div>

            {/* Render Pins using queried lat/lng coordinates */}
            {pins.map((pin) => (
                <div
                    key={pin.id}
                    className="position-absolute"
                    style={{ 
                        // Logic to spread pins across the mock container for visualization
                        left: `${(pin.lng + 105) * 500 % 100}%`, 
                        top: `${(pin.lat - 39) * 500 % 100}%`,
                        zIndex: 10
                    }}
                >
                    <div className="d-flex flex-column align-items-center" style={{ transform: 'translate(-50%, -100%)' }}>
                        <i className={`bi bi-geo-alt-fill fs-4 ${activeTab === 'Trucks' ? 'text-danger' : 'text-primary'}`}></i>
                        {/* Optional: Small label for the truck/event name */}
                        <div className="bg-white px-1 rounded shadow-sm" style={{ fontSize: '10px', marginTop: '-5px' }}>
                            {pin.title}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Gmap;