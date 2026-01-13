// src/components/FoodTruckSearch.js
import React, { memo, useMemo } from 'react'; 
import { useState, useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../utils/googleMapsLoader';

// Haversine distance in miles
const haversineDistance = (c1, c2) => {
  const toRad = v => (v * Math.PI) / 180;
  const R = 3958.8; // Earth radius in miles
  const dLat = toRad(c2.lat - c1.lat);
  const dLng = toRad(c2.lng - c1.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const FoodTruckSearch = ({
  foodTrucks = [],
  onFilterChange
}) => {
  const [filteredTrucks, setFilteredTrucks] = useState(foodTrucks);
  const [searchLocation, setSearchLocation] = useState(null);
  const [travelPath, setTravelPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search states
  const [truckName, setTruckName] = useState('');
  const [vegan, setVegan] = useState(false);
  const [gf, setGf] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [maxDistanceMiles, setMaxDistanceMiles] = useState(50);

  const prev = useRef({ filteredTrucks: [], searchLocation: null, travelPath: null });

  // Derive unique cuisines and specialties from foodTrucks (since embedded)
  const uniqueCuisines = useMemo(() => {
    const allCuisines = foodTrucks.flatMap(truck => truck.cuisines || []);
    return [...new Map(allCuisines.map(c => [c.name, c])).values()];
  }, [foodTrucks]);

  const uniqueSpecialties = useMemo(() => {
    const allSpecialties = foodTrucks.flatMap(truck => truck.specialties || []);
    return [...new Map(allSpecialties.map(s => [s.name, s])).values()];
  }, [foodTrucks]);

  // Core filtering logic
  useEffect(() => {
    if (!Array.isArray(foodTrucks)) return;

    const filtered = foodTrucks.filter(truck => {
      // Name
      const nameMatch = !truckName || (truck.name?.toLowerCase().includes(truckName.toLowerCase()));

      // Cuisines
      const cuisineMatch = selectedCuisines.length === 0 ||
        selectedCuisines.some(selectedName => truck.cuisines?.some(c => c.name === selectedName));

      // Specialties
      const specialtyMatch = selectedSpecialties.length === 0 ||
        selectedSpecialties.some(selectedName => truck.specialties?.some(s => s.name === selectedName));

      // Dietary
      const hasVegan = truck.menu?.some(m => m.dietary?.includes('Vegan')) ?? false;
      const hasGf = truck.menu?.some(m => m.dietary?.includes('Gluten-Free')) ?? false;
      const dietMatch = (!vegan || hasVegan) && (!gf || hasGf);

      // Location / Distance
      let locationMatch = true;
      if (searchLocation && truck.location?.coordinates) {
        const [lng, lat] = truck.location.coordinates;
        const distance = haversineDistance(
          { lat: searchLocation.lat, lng: searchLocation.lng },
          { lat, lng }
        );
        locationMatch = distance <= maxDistanceMiles;
      }

      // Route proximity
      if (travelPath?.path && truck.location?.coordinates) {
        const [truckLng, truckLat] = truck.location.coordinates;
        const nearRoute = travelPath.path.some(p =>
          haversineDistance(
            { lat: truckLat, lng: truckLng },
            { lat: p.lat, lng: p.lng }
          ) <= 5
        );
        locationMatch = nearRoute;
      }

      return nameMatch && cuisineMatch && specialtyMatch && dietMatch && locationMatch;
    });

    setFilteredTrucks(filtered);
  }, [
    truckName, vegan, gf,
    selectedCuisines, selectedSpecialties,
    searchLocation, travelPath, maxDistanceMiles,
    foodTrucks
  ]);

  // Notify parent
  useEffect(() => {
    const changed =
      prev.current.filteredTrucks !== filteredTrucks ||
      prev.current.searchLocation !== searchLocation ||
      prev.current.travelPath !== travelPath;

    if (changed) {
      onFilterChange?.(filteredTrucks, searchLocation, travelPath);
      prev.current = { filteredTrucks, searchLocation, travelPath };
    }
  }, [filteredTrucks, searchLocation, travelPath, onFilterChange]);

  // Near Me
  const handleNearMe = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setSearchLocation({ lat: 40.4555, lng: -109.5287 });
      setIsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setSearchLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLoading(false);
      },
      () => {
        setSearchLocation({ lat: 40.4555, lng: -109.5287 });
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Location search
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    try {
      const google = await loadGoogleMaps();
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationInput }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          setSearchLocation({ lat: loc.lat(), lng: loc.lng() });
        }
      });
    } catch (err) {
      console.error("Geocode failed:", err);
    }
  };

  // Route search
  const handleRouteSearch = async (e) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    try {
      const google = await loadGoogleMaps();
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
        (result, status) => {
          if (status === 'OK') {
            const path = result.routes[0].overview_path.map(p => ({
              lat: p.lat(),
              lng: p.lng()
            }));
            setTravelPath({ origin, destination, path });
          }
        }
      );
    } catch (err) {
      console.error("Route search failed:", err);
    }
  };

  // Reset
  const reset = () => {
    setTruckName('');
    setVegan(false);
    setGf(false);
    setSelectedCuisines([]);
    setSelectedSpecialties([]);
    setLocationInput('');
    setOrigin('');
    setDestination('');
    setSearchLocation(null);
    setTravelPath(null);
    setMaxDistanceMiles(50);
    onFilterChange?.(foodTrucks, null, null);
  };

  return (
    <div className="p-3">
      {/* Truck Name */}
      <div className="mb-4">
        <label className="form-label fw-bold text-primary">Truck Name</label>
        <input
          type="text"
          className="form-control form-control-lg rounded-3 shadow-sm"
          placeholder="e.g., Taco Tornado"
          value={truckName}
          onChange={e => setTruckName(e.target.value)}
        />
      </div>

      {/* Location Search */}
      <div className="mb-4">
        <label className="form-label fw-bold text-primary">Location</label>
        <form onSubmit={handleLocationSearch} className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control rounded-3 shadow-sm"
            placeholder="City, State, ZIP or Address"
            value={locationInput}
            onChange={e => setLocationInput(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-primary">
            Go
          </button>
        </form>

        {searchLocation && (
          <div className="mt-2">
            <label className="form-label small fw-semibold">Search Radius: {maxDistanceMiles} miles</label>
            <input
              type="range"
              className="form-range"
              min="5"
              max="200"
              step="5"
              value={maxDistanceMiles}
              onChange={e => setMaxDistanceMiles(Number(e.target.value))}
            />
          </div>
        )}
      </div>

      {/* Dietary Options */}
      <div className="mb-4">
        <h6 className="fw-bold text-primary mb-3">Dietary Options</h6>
        <div className="d-flex gap-4 flex-wrap">
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="vegan" checked={vegan} onChange={e => setVegan(e.target.checked)} />
            <label className="form-check-label fw-semibold" htmlFor="vegan">Vegan</label>
          </div>
          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="gf" checked={gf} onChange={e => setGf(e.target.checked)} />
            <label className="form-check-label fw-semibold" htmlFor="gf">Gluten-Free</label>
          </div>
        </div>
      </div>

      {/* Cuisines */}
      <div className="mb-5">
        <h6 className="fw-bold text-primary mb-3">Cuisine Type</h6>
        {uniqueCuisines.length === 0 ? (
          <p className="text-muted small">No cuisines available</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {uniqueCuisines.map((cuisine) => (
              <div key={cuisine.name} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`cuisine-${cuisine.name}`}
                  value={cuisine.name}
                  checked={selectedCuisines.includes(cuisine.name)}
                  onChange={(e) => {
                    setSelectedCuisines(prev =>
                      e.target.checked
                        ? [...prev, cuisine.name]
                        : prev.filter(name => name !== cuisine.name)
                    );
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`cuisine-${cuisine.name}`}
                >
                  {cuisine.name}
                  {cuisine.description && (
                    <small className="text-muted d-block">
                      {cuisine.description}
                    </small>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specialties */}
      <div className="mb-5">
        <h6 className="fw-bold text-primary mb-3">Specialties (Desserts & Drinks)</h6>
        {uniqueSpecialties.length === 0 ? (
          <p className="text-muted small">No specialties available</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {uniqueSpecialties.map((specialty) => (
              <div key={specialty.name} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`specialty-${specialty.name}`}
                  value={specialty.name}
                  checked={selectedSpecialties.includes(specialty.name)}
                  onChange={(e) => {
                    setSelectedSpecialties(prev =>
                      e.target.checked
                        ? [...prev, specialty.name]
                        : prev.filter(name => name !== specialty.name)
                    );
                  }}
                />
                <label
                  className="form-check-label"
                  htmlFor={`specialty-${specialty.name}`}
                >
                  {specialty.name}
                  {specialty.description && (
                    <small className="text-muted d-block">
                      {specialty.description}
                    </small>
                  )}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <button
            className="btn btn-success btn-lg w-100 rounded-3 shadow-sm"
            onClick={handleNearMe}
            disabled={isLoading}
          >
            {isLoading ? 'Finding...' : 'Near Me'}
          </button>
        </div>
        <div className="col-6">
          <button
            className="btn btn-outline-primary btn-lg w-100 rounded-3 shadow-sm"
            onClick={handleLocationSearch}
          >
            Search Location
          </button>
        </div>
      </div>

      <hr className="my-4" />

      {/* Along Route */}
      <div className="mb-4">
        <h6 className="fw-bold text-primary mb-3">Find Along Route</h6>
        <form onSubmit={handleRouteSearch}>
          <div className="row g-2">
            <div className="col-6">
              <input
                className="form-control rounded-3 shadow-sm"
                placeholder="Starting point"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
              />
            </div>
            <div className="col-6">
              <input
                className="form-control rounded-3 shadow-sm"
                placeholder="Destination"
                value={destination}
                onChange={e => setDestination(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3 rounded-3 shadow-sm">
            Search Route
          </button>
        </form>
      </div>

      {/* Reset */}
      <button className="btn btn-outline-secondary w-100 rounded-3 shadow-sm" onClick={reset}>
        Clear All Filters
      </button>
    </div>
  );
};

export default FoodTruckSearch;
