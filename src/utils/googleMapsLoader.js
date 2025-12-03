// src/components/Map.js
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../utils/googleMapsLoader';

const Map = ({ filteredTrucks, searchLocation, travelPath }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        const google = await loadGoogleMaps();

        if (!isMounted) return;

        const center = searchLocation || { lat: 40.4555, lng: -109.5287 };

        mapInstance.current = new google.maps.Map(mapRef.current, {
          center,
          zoom: searchLocation ? 11 : 6,
          disableDefaultUI: false,
          styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
        });

        window.map = mapInstance.current;

        // Clear old markers
        if (window.markers) window.markers.forEach(m => m.setMap(null));
        window.markers = [];

        filteredTrucks.forEach(truck => {
          const loc = truck.isAtEvent ? truck.eventLocation : truck.mainLocation;
          if (loc?.lat && loc?.lng) {
            const marker = new google.maps.Marker({
              position: { lat: loc.lat, lng: loc.lng },
              map: mapInstance.current,
              title: truck.name,
            });
            window.markers.push(marker);
          }
        });

        if (travelPath) {
          const ds = new google.maps.DirectionsService();
          const dr = new google.maps.DirectionsRenderer({ map: mapInstance.current, suppressMarkers: true });
          ds.route(
            { origin: travelPath.origin, destination: travelPath.destination, travelMode: 'DRIVING' },
            (res, status) => {
              if (status === 'OK') dr.setDirections(res);
            }
          );
        }
      } catch (err) {
        console.error('Map load failed:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (window.markers) window.markers.forEach(m => m.setMap(null));
      window.markers = [];
    };
  }, [filteredTrucks, searchLocation, travelPath]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
