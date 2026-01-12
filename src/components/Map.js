// src/components/Map.js
import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

let globalMap = null;
let globalMarkers = [];
let globalRouteRenderer = null;

const Map = ({ filteredTrucks = [], searchLocation, travelPath }) => {
  const mapRef = useRef(null);
  const loaderRef = useRef(null);

  if (!loaderRef.current) {
    loaderRef.current = new Loader({
      apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places']
    });
  }

  useEffect(() => {
    const initMap = async () => {
      const google = await loaderRef.current.load();

      if (!globalMap && mapRef.current) {
        globalMap = new google.maps.Map(mapRef.current, {
          center: searchLocation || { lat: 40.4555, lng: -109.5287 },
          zoom: searchLocation ? 12 : 5,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [{ featureType: 'poi.business', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
        });
      }

      if (searchLocation) {
        globalMap.setCenter(searchLocation);
        globalMap.setZoom(12);
      }

      globalMarkers.forEach(m => m.setMap(null));
      globalMarkers = [];

      filteredTrucks.forEach(truck => {
        if (!truck.location?.coordinates) return;

        const [lng, lat] = truck.location.coordinates;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: globalMap,
          title: truck.name,
          icon: { url: 'https://maps.google.com/mapfiles/ms/icons/foodbank.png', scaledSize: new google.maps.Size(40, 40) }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${truck.name}</strong><br>${truck.address || 'No address'}</div>`
        });

        marker.addListener('click', () => infoWindow.open(globalMap, marker));

        globalMarkers.push(marker);
      });

      if (globalRouteRenderer) globalRouteRenderer.setMap(null);

      if (travelPath?.origin && travelPath?.destination) {
        const directionsService = new google.maps.DirectionsService();
        globalRouteRenderer = new google.maps.DirectionsRenderer({
          map: globalMap,
          suppressMarkers: true,
          polylineOptions: { strokeColor: '#0d6efd', strokeOpacity: 0.8, strokeWeight: 6 }
        });

        directionsService.route(
          { origin: travelPath.origin, destination: travelPath.destination, travelMode: google.maps.TravelMode.DRIVING },
          (result, status) => { if (status === 'OK') globalRouteRenderer.setDirections(result); }
        );
      }
    };

    initMap();

    return () => {
      // Cleanup if needed
    };
  }, [filteredTrucks, searchLocation, travelPath]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '500px' }} />;
};

export default Map;
