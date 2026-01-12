// src/components/tsearch.js
import React, { useState, useEffect } from 'react';
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

const TSearch = ({ foodTrucks, setFilteredTrucks, setSearchLocation, setTravelPath, cuisines = [], specialties = [] }) => {
  const [location, setLocation] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [searchError, setSearchError] = useState(null);

  // New: States for dynamic filters
  const [vegan, setVegan] = useState(false);
  const [gf, setGf] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);

  // Core filtering (integrated here to condense)
  useEffect(() => {
    const filtered = foodTrucks.filter(truck => {
      const nameMatch = true; // No name filter in this component, add if needed

      const cuisineMatch = selectedCuisines.length === 0 ||
        (truck.cuisines || []).some(id => selectedCuisines.includes(id.toString()));

      const specialtyMatch = selectedSpecialties.length === 0 ||
        (truck.specialties || []).some(id => selectedSpecialties.includes(id.toString()));

      const hasVegan = truck.menu?.some(m => m.dietary?.includes('Vegan')) ?? false;
      const hasGf = truck.menu?.some(m => m.dietary?.includes('Gluten-Free')) ?? false;
      const dietMatch = (!vegan || hasVegan) && (!gf || hasGf);

      return nameMatch && cuisineMatch && specialtyMatch && dietMatch;
    });

    setFilteredTrucks(filtered);
  }, [selectedCuisines, selectedSpecialties, vegan, gf, foodTrucks]);

  // Handle location search
  const handleMainSearch = async (e) => {
    e?.preventDefault();
    setSearchError(null);

    if (location) {
      try {
        const loader = new Loader({ apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY });
        const google = await loader.load();
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK') {
            const searchCoords = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
            setSearchLocation(searchCoords);

            const filtered = foodTrucks.filter((truck) => {
              const truckCoords = truck.location?.coordinates
                ? { lat: truck.location.coordinates[1], lng: truck.location.coordinates[0] }
                : null;
              if (!truckCoords) return false;
              const distance = haversineDistance(searchCoords, truckCoords);
              return distance <= 50;
            });

            setFilteredTrucks(filtered);
            setTravelPath(null);
            if (filtered.length === 0) {
              setSearchError('No food trucks found within 50 miles.');
            }
          } else {
            setSearchError('Invalid location. Please try again.');
            setFilteredTrucks(foodTrucks);
            setSearchLocation(null);
          }
        });
      } catch (error) {
        console.error('Geocode failed:', error);
        setSearchError('Failed to load map. Check your API key or connection.');
      }
    } else {
      setFilteredTrucks(foodTrucks);
      setSearchLocation(null);
    }
  };

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
            setTravelPath({ origin, destination, path: path });

            const filtered = foodTrucks.filter((truck) => {
              const truckCoords = truck.location?.coordinates
                ? { lat: truck.location.coordinates[1], lng: truck.location.coordinates[0] }
                : null;
              if (!truckCoords) return false;
              return path.some((point) => haversineDistance(point, truckCoords) <= 50);
            });

            setFilteredTrucks(filtered);
            setSearchLocation(null);

            if (filtered.length === 0) {
              setSearchError('No food trucks found along the route.');
            }
          } else {
            setSearchError('Failed to calculate route. Try again.');
          }
        }
      );
    } catch (error) {
      console.error('Route search failed:', error);
      setSearchError('Failed to load map. Check your API key or connection.');
    }
  };

  return (
    <div className="sidebar bg-light p-3 h-100">
      <h3 className="mb-4">Find Food Trucks</h3>

      <hr className="my-4" />

      {/* Location Input */}
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

      {/* Dietary Options */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Dietary Options</h6>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="vegan" checked={vegan} onChange={e => setVegan(e.target.checked)} />
          <label className="form-check-label fw-semibold" htmlFor="vegan">Vegan</label>
        </div>
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="gf" checked={gf} onChange={e => setGf(e.target.checked)} />
          <label className="form-check-label fw-semibold" htmlFor="gf">Gluten-Free</label>
        </div>
      </div>

      {/* Dynamic Cuisine Filter */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Cuisine Type</h6>
        {cuisines.length === 0 ? (
          <p className="text-muted small">Loading cuisines...</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {cuisines.map((cuisine) => (
              <div key={cuisine.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`cuisine-${cuisine.id}`}
                  value={cuisine.id}
                  checked={selectedCuisines.includes(cuisine.id.toString())}
                  onChange={(e) => {
                    const idStr = cuisine.id.toString();
                    setSelectedCuisines((prev) =>
                      e.target.checked ? [...prev, idStr] : prev.filter((id) => id !== idStr)
                    );
                  }}
                />
                <label className="form-check-label" htmlFor={`cuisine-${cuisine.id}`}>
                  {cuisine.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Specialties Filter */}
      <div className="mb-4">
        <h6 className="fw-bold mb-3">Specialties (Desserts & Drinks)</h6>
        {specialties.length === 0 ? (
          <p className="text-muted small">Loading specialties...</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {specialties.map((specialty) => (
              <div key={specialty.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`specialty-${specialty.id}`}
                  value={specialty.id}
                  checked={selectedSpecialties.includes(specialty.id.toString())}
                  onChange={(e) => {
                    const idStr = specialty.id.toString();
                    setSelectedSpecialties((prev) =>
                      e.target.checked ? [...prev, idStr] : prev.filter((id) => id !== idStr)
                    );
                  }}
                />
                <label className="form-check-label" htmlFor={`specialty-${specialty.id}`}>
                  {specialty.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LocationSearch */}
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
