import * as React from "react"
import { useState, useEffect } from "react"
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

// Map container styles for responsive sizing
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '500px',
};

// Default map center (e.g., San Francisco)
const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

// Haversine formula for distance calculation
const toRadians = (degrees) => (degrees * Math.PI) / 180;

const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lng2 - lng1);
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

const Map = ({ foodTrucks, travelPath, searchLocation }) => {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [directions, setDirections] = useState(null);

  // Center map on user's location or search location
  useEffect(() => {
    if (searchLocation) {
      setMapCenter(searchLocation);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log('Geolocation not available, using default center');
        }
      );
    }
  }, [searchLocation]);

  // Handle Directions API response
  const directionsCallback = (response) => {
    if (response !== null && response.status === 'OK') {
      setDirections(response);
    } else {
      console.log('Directions request failed:', response);
    }
  };

  // Filter trucks by proximity to searchLocation or travelPath
  const filteredTrucks = foodTrucks.filter((truck) => {
    const activeLocation = truck.isAtEvent && truck.eventLocation
      ? truck.eventLocation
      : truck.mainLocation;
    if (travelPath) {
      const distanceToStart = getDistance(
        activeLocation.lat,
        activeLocation.lng,
        travelPath.origin.lat,
        travelPath.origin.lng
      );
      const distanceToEnd = getDistance(
        activeLocation.lat,
        activeLocation.lng,
        travelPath.destination.lat,
        travelPath.destination.lng
      );
      return distanceToStart <= 5000 || distanceToEnd <= 5000; // 5km radius
    }
    if (searchLocation) {
      const distance = getDistance(
        activeLocation.lat,
        activeLocation.lng,
        searchLocation.lat,
        searchLocation.lng
      );
      return distance <= 10000; // 10km radius for location/event search
    }
    return true; // Show all trucks if no search criteria
  });

  // Determine active location
  const getActiveLocation = (truck) => {
    return truck.isAtEvent && truck.eventLocation
      ? { lat: truck.eventLocation.lat, lng: truck.eventLocation.lng, address: truck.eventLocation.address }
      : { lat: truck.mainLocation.lat, lng: truck.mainLocation.lng, address: truck.mainLocation.address };
  };

  return (
    <LoadScript googleMapsApiKey={process.env.GATSBY_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={12}>
        {travelPath && (
          <DirectionsService
            options={{
              origin: travelPath.origin,
              destination: travelPath.destination,
              travelMode: 'DRIVING',
            }}
            callback={directionsCallback}
          />
        )}
        {directions && <DirectionsRenderer options={{ directions }} />}
        {filteredTrucks.map((truck) => {
          const activeLocation = getActiveLocation(truck);
          return (
            <Marker
              key={truck.id}
              position={{ lat: activeLocation.lat, lng: activeLocation.lng }}
              title={truck.name}
              onClick={() => setSelectedTruck(truck)}
            />
          );
        })}
        {selectedTruck && (
          <InfoWindow
            position={getActiveLocation(selectedTruck)}
            onCloseClick={() => setSelectedTruck(null)}
          >
            <div>
              <h6>{selectedTruck.name}</h6>
              <p>{getActiveLocation(selectedTruck).address}</p>
              <p>{selectedTruck.isAtEvent ? 'At Event' : 'Main Location'}</p>
              <p>Cuisine: {selectedTruck.cuisine}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
