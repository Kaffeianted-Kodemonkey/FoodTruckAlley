// tsearch.js
import React, { useState, useEffect } from 'react';
import LocationSearch from './location';
import Filter from './filter';
import { Loader } from '@googlemaps/js-api-loader';

// Haversine formula
const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLng = toRad(coords2.lng - coords1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coords1.lat)) * Math.cos(toRad(coords2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const TSearch = ({ foodTrucks, setFilteredTrucks, setSearchLocation, setTravelPath }) => {
  const [location, setLocation] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [searchError, setSearchError] = useState(null);

  // Handle location search
  const handleMainSearch = async (e) => {
    e?.preventDefault();
    setSearchError(null);

    if (location) {
      try {
        console.log('Geocoding location:', location);
        const loader = new Loader({ apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY });
        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK') {
            const searchCoords = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
            console.log('Geocoded location:', searchCoords);
            setSearchLocation(searchCoords);

            const filtered = foodTrucks.filter((truck) => {
              const truckCoords = truck.isAtEvent ? truck.eventLocation : truck.mainLocation;
              if (!truckCoords || !truckCoords.lat || !truckCoords.lng) {
                console.log(`Invalid coords for truck ${truck.name || 'Unnamed'}:`, truckCoords);
                return false;
              }
              const distance = haversineDistance(searchCoords, truckCoords);
              console.log(`Truck ${truck.name || 'Unnamed'} distance: ${distance} miles`);
              return distance <= 50;
            });

            console.log('Location filtered trucks:', filtered);
            setFilteredTrucks(filtered);
            setTravelPath(null);
            if (filtered.length === 0) {
              console.log('No trucks found within 50 miles of:', location);
              setSearchError('No food trucks found within 50 miles.');
            }
          } else {
            console.error('Geocode failed:', status);
            setSearchError('Invalid location. Please try again.');
            setFilteredTrucks(foodTrucks);
            setSearchLocation(null);
          }
        });
      } catch (error) {
        console.error('Failed to load Google Maps API for geocoding:', error);
        setSearchError('Failed to load map. Check your API key or connection.');
        setFilteredTrucks(foodTrucks);
        setSearchLocation(null);
      }
    } else {
      console.log('No location entered, resetting to all trucks');
      setFilteredTrucks(foodTrucks);
      setSearchLocation(null);
    }
  };

  // Auto-trigger location search
  useEffect(() => {
    handleMainSearch();
  }, [location, foodTrucks]);

  // Handle route search
  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    setSearchError(null);
    if (!origin || !destination) {
      setSearchError('Please enter both starting point and destination.');
      return;
    }

    try {
      const loader = new Loader({ apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY });
      const google = await loader.load();
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') {
            const path = result.routes[0].overview_path.map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }));
            setTravelPath({ origin, destination });

            const filtered = foodTrucks.filter((truck) => {
              const truckCoords = truck.isAtEvent ? truck.eventLocation : truck.mainLocation;
              if (!truckCoords || !truckCoords.lat || !truckCoords.lng) {
                console.log(`Invalid coords for truck ${truck.name || 'Unnamed'}:`, truckCoords);
                return false;
              }
              return path.some((point) => haversineDistance(point, truckCoords) <= 50);
            });

            console.log('Route filtered trucks:', filtered);
            setFilteredTrucks(filtered);
            setSearchLocation(null);
            if (filtered.length === 0) {
              setSearchError('No food trucks found along the route.');
            }
          } else {
            console.error('Directions request failed:', status);
            setSearchError('Failed to calculate route. Try again.');
          }
        }
      );
    } catch (error) {
      console.error('Failed to load Google Maps API for route:', error);
      setSearchError('Failed to load map. Check your API key or connection.');
    }
  };

  return (
    <div className="sidebar bg-light p-3 h-100">
      <h3 className="mb-4">Find Food Trucks</h3>

      <hr className="my-4" />
      
      <div className="mb-3">
        <label htmlFor="location" className="form-label fw-bold">
          Location:
        </label>
        <input
          type="text"
          className="form-control"
          id="location"
          placeholder="e.g., Denver, CO"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      {searchError && (
        <div className="alert alert-danger mt-3" role="alert">
          {searchError}
        </div>
      )}


      <Filter foodTrucks={foodTrucks} setFilteredTrucks={setFilteredTrucks} />
      <br />
      <LocationSearch
        foodTrucks={foodTrucks}
        setFilteredTrucks={setFilteredTrucks}
        setSearchLocation={setSearchLocation}
        haversineDistance={haversineDistance}
      />
      <hr className="my-4" />
      <h3 className="mb-4">Find Truck Along Route</h3>
      <form onSubmit={handleRouteSubmit}>
        <div className="mb-3">
          <label htmlFor="origin" className="form-label fw-bold">
            Starting Point
          </label>
          <input
            type="text"
            className="form-control"
            id="origin"
            placeholder="e.g., Jensen, UT"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="destination" className="form-label fw-bold">
            Destination
          </label>
          <input
            type="text"
            className="form-control"
            id="destination"
            placeholder="e.g., Vernal, UT"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Search Along Route
        </button>
      </form>
    </div>
  );
};

export default TSearch;
