import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const Map = ({ filteredTrucks, searchLocation, travelPath }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({ apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY });
      const google = await loader.load();

      // Default center (Vernal, UT)
      const defaultCenter = { lat: 40.4555, lng: -109.5287 };
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: searchLocation || defaultCenter,
        zoom: 10,
      });

      // Add markers for filtered trucks
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

      // Draw travel path if provided
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
    };

    initMap();
  }, [filteredTrucks, searchLocation, travelPath]);

  return <div ref={mapRef} style={{ height: '100vh', width: '100%' }} />;
};

export default Map;
