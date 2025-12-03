import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = ({ filteredTrucks, searchLocation, travelPath }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY,
          version: 'weekly',
        });
        const google = await loader.load();
        const defaultCenter = { lat: 40.4555, lng: -109.5287 }; // Vernal, UT
        console.log('Map center:', searchLocation || defaultCenter);

        mapInstance.current = new google.maps.Map(mapRef.current, {
          center: searchLocation || defaultCenter,
          zoom: 10,
        });

        console.log('Rendering markers for trucks:', filteredTrucks);
        filteredTrucks.forEach((truck) => {
          const coords = truck.isAtEvent ? truck.eventLocation : truck.mainLocation;
          if (coords && coords.lat && coords.lng) {
            console.log(`Adding marker for ${truck.name} at ${coords.lat}, ${coords.lng}`);
            new google.maps.Marker({
              position: { lat: coords.lat, lng: coords.lng },
              map: mapInstance.current,
              title: truck.name,
            });
          } else {
            console.log(`Skipping marker for ${truck.name}: invalid coordinates`, coords);
          }
        });

        if (travelPath) {
          const directionsService = new google.maps.DirectionsService();
          const directionsRenderer = new google.maps.DirectionsRenderer({
            map: mapInstance.current,
          });
          directionsService.route(
            {
              origin: travelPath.origin,
              destination: travelPath.destination,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
              } else {
                console.log('Directions request failed:', status);
              }
            }
          );
        }
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
        setMapError('Unable to load the map. Please check your API key or internet connection.');
      }
    };
    initMap();
  }, [filteredTrucks, searchLocation, travelPath]);

  return (
    <div>
      {mapError && (
        <div className="alert alert-danger" role="alert">
          {mapError}
        </div>
      )}
      <div ref={mapRef} style={{ height: '60vh', width: '100%' }} />
    </div>
  );
};

export default Map;
