// src/components/Map.js
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

let globalMap = null;
let globalMarkers = [];
let globalRouteRenderer = null;

const DEFAULT_CENTER = { lat: 40.0875, lng: -108.8048 }; // Rangely, CO fallback
const DEFAULT_ZOOM = 5; // wide view
const LOCAL_ZOOM = 12;  // closer view for user or single truck

const Map = ({ filteredTrucks = [], searchLocation, travelPath }) => {
  const mapRef = useRef(null);
  const loaderRef = useRef(null);
  const [initialCenter, setInitialCenter] = useState(null);

  if (!loaderRef.current) {
    loaderRef.current = new Loader({
      apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places']
    });
  }

  // Determine initial center on mount
  useEffect(() => {
    // Priority 1: User geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setInitialCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          // Priority 2: Random truck with location
          const trucksWithLocation = filteredTrucks.filter(t => t.location?.coordinates);
          if (trucksWithLocation.length > 0) {
            const randomTruck = trucksWithLocation[Math.floor(Math.random() * trucksWithLocation.length)];
            const [lng, lat] = randomTruck.location.coordinates;
            setInitialCenter({ lat, lng });
          } else {
            // Fallback: default center
            setInitialCenter(DEFAULT_CENTER);
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      // No geolocation support → random truck or default
      const trucksWithLocation = filteredTrucks.filter(t => t.location?.coordinates);
      if (trucksWithLocation.length > 0) {
        const randomTruck = trucksWithLocation[Math.floor(Math.random() * trucksWithLocation.length)];
        const [lng, lat] = randomTruck.location.coordinates;
        setInitialCenter({ lat, lng });
      } else {
        setInitialCenter(DEFAULT_CENTER);
      }
    }
  }, [filteredTrucks]); // Re-run if filteredTrucks changes early

  useEffect(() => {
    if (!initialCenter) return; // Wait for center to be set

    const initMap = async () => {
      const google = await loaderRef.current.load();

      if (!globalMap && mapRef.current) {
        globalMap = new google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: initialCenter === DEFAULT_CENTER ? DEFAULT_ZOOM : LOCAL_ZOOM,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [{ featureType: 'poi.business', elementType: 'labels', stylers: [{ visibility: 'off' }] }]
        });
      }

      // If user does a manual search later, override center
      if (searchLocation) {
        globalMap.setCenter(searchLocation);
        globalMap.setZoom(LOCAL_ZOOM);
      }

      // Clear old markers
      globalMarkers.forEach(m => m.setMap(null));
      globalMarkers = [];

      // Add markers for filtered trucks
      filteredTrucks.forEach(truck => {
        if (!truck.location?.coordinates) return;

        const [lng, lat] = truck.location.coordinates;

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: globalMap,
          title: truck.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/foodbank.png',
            scaledSize: new google.maps.Size(40, 40)
          }
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${truck.name}</strong><br>${truck.address || 'No address'}</div>`
        });

        marker.addListener('click', () => infoWindow.open(globalMap, marker));

        globalMarkers.push(marker);
      });

      // Clear old route
      if (globalRouteRenderer) globalRouteRenderer.setMap(null);

      // Draw route if provided
      if (travelPath?.origin && travelPath?.destination) {
        const directionsService = new google.maps.DirectionsService();
        globalRouteRenderer = new google.maps.DirectionsRenderer({
          map: globalMap,
          suppressMarkers: true,
          polylineOptions: { strokeColor: '#0d6efd', strokeOpacity: 0.8, strokeWeight: 6 }
        });

        directionsService.route(
          { origin: travelPath.origin, destination: travelPath.destination, travelMode: google.maps.TravelMode.DRIVING },
          (result, status) => {
            if (status === 'OK') {
              globalRouteRenderer.setDirections(result);
            }
          }
        );
      }
    };

    initMap();

    return () => {
      // Optional cleanup
    };
  }, [filteredTrucks, searchLocation, travelPath, initialCenter]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '500px' }} />;
};

export default Map;
