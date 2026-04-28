import React, { useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';

const MapBoundsHandler = ({ pins, isSingleView }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !pins || pins.length === 0) return;

        const bounds = new window.google.maps.LatLngBounds();
        let validPinsCount = 0;

        pins.forEach(pin => {
            const lat = parseFloat(pin.lat);
            const lng = parseFloat(pin.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                bounds.extend({ lat, lng });
                validPinsCount++;
            }
        });

        if (validPinsCount === 0) return;

        if (isSingleView && validPinsCount >= 1) {
            const singlePin = { 
                lat: parseFloat(pins[0].lat), 
                lng: parseFloat(pins[0].lng) 
            };
            map.setCenter(singlePin);
            map.setZoom(15);
        } else {
            // This 50px padding solves your original "pins falling off" issue
            map.fitBounds(bounds, 50);
        }
    }, [map, pins, isSingleView]);

    return null;
};

const Gmap = ({ activeTab, trucks = [], events = [], isSingleView }) => {
    const rawPins = activeTab === 'Trucks' ? trucks : events;
    
    // FILTER: Only allow pins with valid numeric coordinates to reach the Marker
    const pins = rawPins.filter(p => 
        p && typeof p.lat !== 'undefined' && typeof p.lng !== 'undefined' && 
        !isNaN(parseFloat(p.lat)) && !isNaN(parseFloat(p.lng))
    );

    const API_KEY = 'AIzaSyBZ127VkVLAhoiVWxjMJ17fn9dnQCEbd2A';
    const MAP_ID = 'DEMO_MAP_ID';

    return (
        <div className="w-100 h-100 position-relative">
            <APIProvider apiKey={API_KEY}>
                <Map
                    defaultCenter={{ lat: 39.7392, lng: -104.9903 }}
                    defaultZoom={12}
                    mapId={MAP_ID}
                    disableDefaultUI={true}
                >
                    {pins.map((pin) => (
                        <AdvancedMarker 
                            key={pin.id} 
                            // Explicitly convert to Number to satisfy Google's strict type check
                            position={{ lat: Number(pin.lat), lng: Number(pin.lng) }}
                        >
                            <div className="d-flex flex-column align-items-center" style={{ transform: 'translate(-50%, -100%)' }}>
                                <i className={`bi bi-geo-alt-fill fs-3 ${activeTab === 'Trucks' ? 'text-danger' : 'text-primary'} shadow`}></i>
                                <div className="bg-white px-2 py-1 rounded shadow-sm border border-secondary border-opacity-25" 
                                     style={{ fontSize: '11px', marginTop: '-8px', whiteSpace: 'nowrap', fontWeight: '600' }}>
                                    {pin.title}
                                </div>
                            </div>
                        </AdvancedMarker>
                    ))}
                    <MapBoundsHandler pins={pins} isSingleView={isSingleView} />
                </Map>
            </APIProvider>
        </div>
    );
};

export default Gmap;
