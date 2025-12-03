import * as React from 'react';
import { useState } from 'react';

const LocationSearch = ({ foodTrucks, setFilteredTrucks, setSearchLocation, haversineDistance }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useHighAccuracy, setUseHighAccuracy] = useState(true); // Toggle for accuracy
  const radius = 5; // Fixed radius in miles

  const handleLocationSearch = () => {
    setIsLoading(true);
    setError(null);

    // Helper function to filter trucks by location and radius
    const filterTrucksByLocation = (userLocation) => {
      console.log('Filtering with user location:', userLocation);
      const nearbyTrucks = foodTrucks.filter((truck) => {
        const truckLocation = truck.isAtEvent && truck.eventLocation?.lat && truck.eventLocation?.lng
          ? { lat: truck.eventLocation.lat, lng: truck.eventLocation.lng }
          : { lat: truck.mainLocation?.lat, lng: truck.mainLocation?.lng };

        if (!truckLocation.lat || !truckLocation.lng) {
          console.log(`Invalid coordinates for truck: ${truck.name || 'Unnamed Truck'}`);
          return false;
        }

        const distance = haversineDistance(userLocation, truckLocation);
        console.log(`Distance to ${truck.name || 'Unnamed Truck'}: ${distance} miles`);
        return distance <= radius;
      });

      console.log('Nearby trucks:', nearbyTrucks);
      setFilteredTrucks(nearbyTrucks);
      setSearchLocation(userLocation);
      setIsLoading(false);
      if (nearbyTrucks.length === 0) {
        setError(`No food trucks found within ${radius} miles of your location.`);
      }
    };

    if (navigator.geolocation) {
      // Try geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          filterTrucksByLocation(userLocation);
        },
        (err) => {
          console.error('Geolocation error:', err.code, err.message);
          let errorMessage = 'Unable to retrieve your location. ';
          switch (err.code) {
            case 1: // PERMISSION_DENIED
              errorMessage += 'Please allow location access in your browser settings and try again.';
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage += 'Location data is unavailable. Using default location (Vernal, UT).';
              // Fallback to hardcoded location
              const userLocation = { lat: 40.4555, lng: -109.5287 }; // Vernal, UT
              filterTrucksByLocation(userLocation);
              break;
            case 3: // TIMEOUT
              errorMessage += 'Location request timed out. Try again or toggle low accuracy.';
              break;
            default:
              errorMessage += 'An error occurred. Try again.';
          }
          setError(errorMessage);
          setIsLoading(false);
        },
        { timeout: 15000, enableHighAccuracy: useHighAccuracy }
      );
    } else {
      setError('Geolocation is not supported by your browser. Using default location (Vernal, UT).');
      const userLocation = { lat: 40.4555, lng: -109.5287 }; // Vernal, UT
      filterTrucksByLocation(userLocation);
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-3">
      <button
        className="btn btn-success w-100"
        onClick={handleLocationSearch}
        disabled={isLoading}
      >
        {isLoading ? 'Finding Trucks...' : 'Find Trucks Near Me'}
      </button>
      {error && (
        <div className="alert alert-danger mt-2" role="alert">
          {error}
          {error.includes('POSITION_UNAVAILABLE') || error.includes('TIMEOUT') ? (
            <div className="mt-2">
              <button
                className="btn btn-sm btn-warning"
                onClick={() => {
                  setUseHighAccuracy(!useHighAccuracy);
                  handleLocationSearch();
                }}
                disabled={isLoading}
              >
                {useHighAccuracy ? 'Try Low Accuracy' : 'Try High Accuracy'}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
