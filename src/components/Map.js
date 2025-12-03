// src/components/Map.js
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

let globalMap = null;
let globalMarkers = [];
let globalRouteRenderer = null;

const Map = ({ filteredTrucks, searchLocation, travelPath }) => {
  const mapRef = useRef(null);
  const loaderRef = useRef(null);

  // Initialize loader once
  if (!loaderRef.current) {
    loaderRef.current = new Loader({ apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY });
  }

  useEffect(() => {
    const initMap = async () => {
      const google = await loaderRef.current.load();

      // Create map only once
      if (!globalMap && mapRef.current) {
        const center = searchLocation || { lat: 40.4555, lng: -109.5287 };
        globalMap = new google.maps.Map(mapRef.current, {
          center,
          zoom: searchLocation ? 11 : 6,
          disableDefaultUI: false,
          styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }],
        });
      }

      // Update center and zoom
      const newCenter = searchLocation || { lat: 40.4555, lng: -109.5287 };
      globalMap.setCenter(newCenter);
      globalMap.setZoom(searchLocation ? 11 : 6);

      // Clear old markers
      globalMarkers.forEach(m => m.setMap(null));
      globalMarkers = [];

      // Add new markers
      filteredTrucks.forEach(truck => {
        const loc = truck.isAtEvent ? truck.eventLocation : truck.mainLocation;
        if (loc?.lat && loc?.lng) {
          const marker = new google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: globalMap,
            title: truck.name,
          });
          globalMarkers.push(marker);
        }
      });

      // Update route
      if (globalRouteRenderer) {
        globalRouteRenderer.setMap(null);
      }

      if (travelPath?.origin && travelPath?.destination) {
        const ds = new google.maps.DirectionsService();
        globalRouteRenderer = new google.maps.DirectionsRenderer({
          map: globalMap,
          suppressMarkers: true,
          polylineOptions: { strokeColor: '#0d6efd', strokeWeight: 5 },
        });

        ds.route(
          { origin: travelPath.origin, destination: travelPath.destination, travelMode: 'DRIVING' },
          (result, status) => {
            if (status === 'OK') {
              globalRouteRenderer.setDirections(result);
            }
          }
        );
      }
    };

    initMap();
  }, [filteredTrucks, searchLocation, travelPath]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;
