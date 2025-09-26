import * as React from "react"
import { useState } from "react"
import { Loader } from '@googlemaps/js-api-loader';

const TSearch = ({ foodTrucks, setFilteredTrucks, setSearchLocation, setTravelPath }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cuisineFilters, setCuisineFilters] = useState([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  // Available cuisines (replace with dynamic data from CMS)
  const cuisines = ['Mexican', 'American', 'Asian', 'Vegan'];

  // Handle search and filtering
  const handleSearch = () => {
    const filtered = foodTrucks.filter((truck) => {
      const matchesSearch = searchQuery ? truck.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      const matchesCuisine = cuisineFilters.length === 0 || cuisineFilters.includes(truck.cuisine);
      return matchesSearch && matchesCuisine;
    });
    setFilteredTrucks(filtered);
  };

  // Handle cuisine filter changes
  const handleCuisineChange = (cuisine) => {
    setCuisineFilters((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
    handleSearch();
  };

  // Handle location search (town/city/state/event)
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!locationQuery) return;

    const loader = new Loader({ apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY });
    const google = await loader.load();
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: locationQuery }, (results, status) => {
      if (status === 'OK') {
        const { lat, lng } = results[0].geometry.location;
        setSearchLocation({ lat: lat(), lng: lng() });
        handleSearch();
      } else {
        console.log('Geocoding failed:', status);
      }
    });
  };

  // Handle nearby search
  const handleNearbySearch = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setSearchLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setTravelPath(null); // Clear travel path
          handleSearch();
        },
        () => {
          console.log('Geolocation not available');
        }
      );
    }
  };

  // Handle travel path search
  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    if (!origin || !destination) return;

    const loader = new Loader({ apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY });
    const google = await loader.load();
    const geocoder = new google.maps.Geocoder();

    const geocodeAddress = (address) =>
      new Promise((resolve) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            resolve({
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
            });
          } else {
            resolve(null);
          }
        });
      });

    const originCoords = await geocodeAddress(origin);
    const destCoords = await geocodeAddress(destination);
    if (originCoords && destCoords) {
      setTravelPath({ origin: originCoords, destination: destCoords });
      setSearchLocation(null); // Clear location search
      handleSearch();
    }
  };

  return (
    <div className="sidebar" style={{ backgroundColor: '#f8f9fa', padding: '1rem', height: '100%' }}>
      <h4 className="mb-3">Find Food Trucks</h4>
      {/* Name Search */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by truck name"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            handleSearch();
          }}
        />
        <button className="btn btn-primary" type="button" onClick={handleSearch}>
          Search
        </button>
      </div>
      {/* Location/Event Search */}
      <form onSubmit={handleLocationSearch} className="mb-3">
        <div className="mb-2">
          <label htmlFor="locationQuery" className="form-label">Town, City, State, or Event</label>
          <input
            type="text"
            className="form-control"
            id="locationQuery"
            placeholder="e.g., San Francisco, CA or Food Truck Festival"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search Location</button>
      </form>
      {/* Nearby Search */}
      <button className="btn btn-secondary mb-3" onClick={handleNearbySearch}>
        Find Trucks Nearby
      </button>
      {/* Travel Path Search */}
      <form onSubmit={handleRouteSubmit} className="mb-3">
        <div className="mb-2">
          <label htmlFor="origin" className="form-label">Starting Point</label>
          <input
            type="text"
            className="form-control"
            id="origin"
            placeholder="Enter starting address"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="destination" className="form-label">Destination</label>
          <input
            type="text"
            className="form-control"
            id="destination"
            placeholder="Enter destination address"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Find Trucks Along Route</button>
      </form>
      {/* Cuisine Filters */}
      <h5>Filters</h5>
      {cuisines.map((cuisine) => (
        <div key={cuisine} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={cuisine}
            id={`cuisine${cuisine}`}
            checked={cuisineFilters.includes(cuisine)}
            onChange={() => handleCuisineChange(cuisine)}
          />
          <label className="form-check-label" htmlFor={`cuisine${cuisine}`}>
            {cuisine}
          </label>
        </div>
      ))}
      {/* Featured Trucks */}
      <h5 className="mt-4">Featured Trucks</h5>
      <ul className="list-group">
        {foodTrucks.map((truck) => (
          <li key={truck.id} className="list-group-item">{truck.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default TSearch;
