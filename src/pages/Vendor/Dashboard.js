import * as React from 'react';
import { useState } from 'react';
import Layout from '../../components/layout';
import { Link } from 'gatsby';

const VendorDashboard = () => {
    const [status, setStatus] = useState('offline'); // 'offline', 'locating', 'live'
    const [lastCheckIn, setLastCheckIn] = useState(null);
    const [announcement, setAnnouncement] = React.useState('');

    const handleCheckIn = () => {
        setStatus('locating');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Broadcasting to Map:", latitude, longitude);

                    // Here is where we will eventually hit the WordPress REST API
                    setTimeout(() => {
                        setStatus('live');
                        setLastCheckIn(new Date().toLocaleTimeString());
                    }, 1500);
                },
                (error) => {
                    alert("Location access denied. Please enable GPS to check in.");
                    setStatus('offline');
                }
            );
        }
    };
    const [specialPhoto, setSpecialPhoto] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSpecialPhoto(reader.result); // In a real app, you'd upload this to WordPress
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Layout>
            <div className="container py-4" style={{ maxWidth: '500px' }}>
                <div className="bg-dark text-white p-4 shadow-sm border-bottom border-warning border-4">
                    <div className="container p-0">
                        <Link to="/" className="btn btn-sm btn-outline-light rounded-pill mb-4 opacity-75">
                            <i className="bi bi-arrow-left me-1"></i> Back to Map
                        </Link>
                        <div className="text-center mb-5">
                            <div className="position-relative d-inline-block mb-3">
                                <div className={`rounded-circle p-1 ${status === 'live' ? 'bg-success' : 'bg-secondary'}`}>
                                    <img
                                        src="https://placeholder.com"
                                        alt="Truck Logo"
                                        className="rounded-circle border border-white border-4"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                </div>
                                {status === 'live' && (
                                    <span className="position-absolute bottom-0 end-0 badge rounded-pill bg-success border border-white border-2 p-2">
                                        <span className="visually-hidden">Live</span>
                                    </span>
                                )}
                            </div>
                            <h2 className="fw-bold mb-0">Taco Tracker</h2>
                            <p className="text-muted small">Premium Partner</p>
                        </div>
                    </div>
                </div>
                {/* MAIN CHECK-IN ACTION */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                    <div className={`p-4 text-center ${status === 'live' ? 'bg-success bg-opacity-10' : 'bg-light'}`}>
                        {status === 'offline' && (
                            <>
                                <i className="bi bi-geo-alt text-muted display-4 mb-3 d-block"></i>
                                <h5 className="fw-bold">Currently Offline</h5>
                                <p className="small text-muted mb-4">Foodies can't see you on the map. Ready to serve?</p>
                                <button onClick={handleCheckIn} className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow">
                                    CHECK IN NOW
                                </button>
                            </>
                        )}

                        {status === 'locating' && (
                            <div className="py-4">
                                <div className="spinner-border text-primary mb-3" role="status"></div>
                                <h5 className="fw-bold">Syncing GPS...</h5>
                                <p className="small text-muted">Updating your pin on the map.</p>
                            </div>
                        )}

                        {status === 'live' && (
                            <>
                                <i className="bi bi-broadcast text-success display-4 mb-3 d-block"></i>
                                <h5 className="fw-bold text-success">YOU ARE LIVE!</h5>
                                <p className="small text-muted mb-4">Pinned at current location.<br />Last updated: {lastCheckIn}</p>
                                <div className="d-grid gap-2">
                                    <button onClick={handleCheckIn} className="btn btn-outline-success rounded-pill fw-bold">
                                        Update My Spot
                                    </button>
                                    <button onClick={() => setStatus('offline')} className="btn btn-link text-danger text-decoration-none small">
                                        End Service / Go Offline
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0 text-uppercase small text-muted">Daily Special & Deals</h6>
                            {specialPhoto && (
                                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                                    Visible on Map
                                </span>
                            )}
                        </div>

                        {/* PHOTO SECTION */}
                        {specialPhoto ? (
                            <div className="position-relative mb-3">
                                <img
                                    src={specialPhoto}
                                    alt="Daily Special"
                                    className="img-fluid rounded-4 shadow-sm"
                                    style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="btn btn-dark btn-sm position-absolute bottom-0 end-0 m-2 rounded-pill shadow opacity-90"
                                >
                                    <i className="bi bi-camera-fill me-1"></i> Change
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="btn btn-outline-primary w-100 py-4 border-2 border-dashed rounded-4 mb-3 d-flex flex-column align-items-center"
                            >
                                <i className="bi bi-camera-plus fs-2 mb-1"></i>
                                <span className="fw-bold small">Snap Today's Special</span>
                            </button>
                        )}

                        {/* ANNOUNCEMENT TEXT AREA */}
                        <div className="form-group">
                            <label className="form-label small fw-bold text-muted mb-1">QUICK ANNOUNCEMENT</label>
                            <div className="input-group bg-light rounded-3 overflow-hidden border-0">
                                <span className="input-group-text bg-transparent border-0 pe-1">
                                    <i className="bi bi-megaphone text-primary small"></i>
                                </span>
                                <textarea
                                    className="form-control bg-transparent border-0 ps-1 small"
                                    rows="2"
                                    placeholder="e.g. 50% off all tacos for the next hour!"
                                    maxLength="100"
                                    value={announcement}
                                    onChange={(e) => setAnnouncement(e.target.value)}
                                    style={{ resize: 'none' }}
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-between mt-1">
                                <small className="text-muted" style={{ fontSize: '9px' }}>{100 - announcement.length} characters left</small>
                                {announcement && (
                                    <button className="btn btn-link text-danger p-0 small text-decoration-none" style={{ fontSize: '11px' }} onClick={() => setAnnouncement('')}>
                                        Clear Text
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Hidden File Input */}
                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" capture="environment" className="d-none" />

                        {/* SAVE ACTION (Crucial for when we hit the DB) */}
                        {(specialPhoto || announcement) && (
                            <button className="btn btn-primary w-100 mt-3 rounded-pill fw-bold shadow-sm py-2">
                                Save & Update Pin
                            </button>
                        )}
                    </div>
                </div>

                {/* QUICK STATS */}
                <div className="row g-3">
                    <div className="col-6">
                        <div className="p-3 bg-white border rounded-4 text-center shadow-sm">
                            <h4 className="fw-bold mb-0">124</h4>
                            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>Views Today</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-3 bg-white border rounded-4 text-center shadow-sm">
                            <h4 className="fw-bold mb-0">12</h4>
                            <small className="text-muted text-uppercase fw-bold" style={{ fontSize: '10px' }}>Phone Taps</small>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default VendorDashboard;
