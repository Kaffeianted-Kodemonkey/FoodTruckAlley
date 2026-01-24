// src/components/FoodTruckSearch.js
import React, { useState, useEffect, useMemo } from 'react';
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
  const [geocodeError, setGeocodeError] = useState(null);

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

  // Derive unique cuisines and specialties
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

    let filtered = foodTrucks.filter(truck => {
      const nameMatch = !truckName || truck.name?.toLowerCase().includes(truckName.toLowerCase());
      const cuisineMatch = selectedCuisines.length === 0 ||
        selectedCuisines.some(selectedName => truck.cuisines?.some(c => c.name === selectedName));
      const specialtyMatch = selectedSpecialties.length === 0 ||
        selectedSpecialties.some(selectedName => truck.specialties?.some(s => s.name === selectedName));
      const hasVegan = truck.menu?.some(m => m.dietary?.includes('Vegan')) ?? false;
      const hasGf = truck.menu?.some(m => m.dietary?.includes('Gluten-Free')) ?? false;
      const dietMatch = (!vegan || hasVegan) && (!gf || hasGf);

      return nameMatch && cuisineMatch && specialtyMatch && dietMatch;
    });

    // Location filter + sort
    if (searchLocation) {
      filtered = filtered.filter(truck => {
        const truckCoords = truck.location?.coordinates
          ? { lat: truck.location.coordinates[1], lng: truck.location.coordinates[0] }
          : null;
        if (!truckCoords) return false;
        const distance = haversineDistance(searchLocation, truckCoords);
        return distance <= maxDistanceMiles;
      });

      filtered.sort((a, b) => {
        const aCoords = a.location?.coordinates ? { lat: a.location.coordinates[1], lng: a.location.coordinates[0] } : null;
        const bCoords = b.location?.coordinates ? { lat: b.location.coordinates[1], lng: b.location.coordinates[0] } : null;
        const distA = aCoords ? haversineDistance(searchLocation, aCoords) : Infinity;
        const distB = bCoords ? haversineDistance(searchLocation, bCoords) : Infinity;
        return distA - distB;
      });
    }

    // Route filter + sort
    if (travelPath?.path) {
      filtered = filtered.filter(truck => {
        const truckCoords = truck.location?.coordinates
          ? { lat: truck.location.coordinates[1], lng: truck.location.coordinates[0] }
          : null;
        if (!truckCoords) return false;
        return travelPath.path.some(p => haversineDistance(p, truckCoords) <= 5);
      });

      filtered.sort((a, b) => {
        const aCoords = a.location?.coordinates ? { lat: a.location.coordinates[1], lng: a.location.coordinates[0] } : null;
        const bCoords = b.location?.coordinates ? { lat: b.location.coordinates[1], lng: b.location.coordinates[0] } : null;
        const minDistA = aCoords ? Math.min(...travelPath.path.map(p => haversineDistance(p, aCoords))) : Infinity;
        const minDistB = bCoords ? Math.min(...travelPath.path.map(p => haversineDistance(p, bCoords))) : Infinity;
        return minDistA - minDistB;
      });
    }

    setFilteredTrucks(filtered);
  }, [
    truckName, vegan, gf,
    selectedCuisines, selectedSpecialties,
    searchLocation, travelPath, maxDistanceMiles,
    foodTrucks
  ]);

  // Notify parent
  useEffect(() => {
    onFilterChange?.(filteredTrucks, searchLocation, travelPath);
  }, [filteredTrucks, searchLocation, travelPath, onFilterChange]);

  // Near Me
  const handleNearMe = () => {
    setIsLoading(true);
    setGeocodeError(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSearchLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLoading(false);
        },
        (err) => {
          setGeocodeError("Unable to get your location. Please allow access or enter a manual location.");
          setIsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setGeocodeError("Geolocation not supported in this browser.");
      setIsLoading(false);
    }
  };

  // Location geocoding (used by button, Enter, blur)
  const handleLocationSearch = async () => {
    if (!locationInput.trim()) return;

    setIsLoading(true);
    setGeocodeError(null);

    try {
      const google = await loadGoogleMaps();
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationInput }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const loc = results[0].geometry.location;
          setSearchLocation({ lat: loc.lat(), lng: loc.lng() });
        } else {
          setGeocodeError(`Location not found: ${status}. Try a more specific address (e.g., "Rangely, CO").`);
        }
        setIsLoading(false);
      });
    } catch (err) {
      setGeocodeError("Failed to search location. Check your connection and try again.");
      setIsLoading(false);
    }
  };

  // Route search
  const handleRouteSearch = async (e) => {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) return;

    setIsLoading(true);
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
          } else {
            setGeocodeError(`Route not found: ${status}`);
          }
          setIsLoading(false);
        }
      );
    } catch (err) {
      setGeocodeError("Failed to calculate route. Try again.");
      setIsLoading(false);
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
    setGeocodeError(null);
    onFilterChange?.(foodTrucks, null, null);
  };

  return (
    <div>
      <h3 className="fw-bold text-success mb-1">Filters</h3>
      {/* Dietary Options */}
      <div className="ms-0">
        <h6 className="fw-bold text-primary mb-3">Dietary Options</h6>
        <div className="d-flex gap-4 flex-wrap ms-4 mb-3">
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

      {/* Cuisine Type */}
      <div className="ms-0">
        <h6 className="fw-bold text-primary mb-3">Cuisine Type</h6>
        {uniqueCuisines.length === 0 ? (
          <p className="text-muted small">No cuisines available</p>
        ) : (
          <div className="d-flex flex-column gap-2  ms-4 mb-3">
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
                <label className="form-check-label" htmlFor={`cuisine-${cuisine.name}`}>
                  {cuisine.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Specialties */}
      <div className="ms-0">
        <h6 className="fw-bold text-primary mb-3">Specialties (Desserts & Drinks)</h6>
        {uniqueSpecialties.length === 0 ? (
          <p className="text-muted small">No specialties available</p>
        ) : (
          <div className="d-flex flex-column gap-2 ms-4 mb-3">
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
                <label className="form-check-label" htmlFor={`specialty-${specialty.name}`}>
                  {specialty.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr />

      {/* Truck Name */}
      <div className="mb-4">
        <label className="form-label fw-bold text-primary">Truck Name</label>
        <input
          type="text"
          className="form-control rounded-3 shadow-sm"
          placeholder="e.g., Taco Tornado"
          value={truckName}
          onChange={e => setTruckName(e.target.value)}
        />
      </div>

      {/* Location Search - input only */}
      <div className="mb-4">
        <label className="form-label fw-bold text-primary">Location Search</label>
        <input
          type="text"
          className="form-control rounded-3 shadow-sm"
          placeholder="City, State, ZIP or Address"
          value={locationInput}
          onChange={e => setLocationInput(e.target.value)}
          onBlur={handleLocationSearch}           // Trigger on blur
          onKeyDown={(e) => { if (e.key === 'Enter') handleLocationSearch(); }}  // Trigger on Enter
        />

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

        {geocodeError && (
          <div className="alert alert-danger mt-2 small">
            {geocodeError}
          </div>
        )}
      </div>

      {/* Search Buttons */}
      <div className="row g-3 mb-4">
        <div className="col">
          <button
            className="btn btn-success btn-md w-100 rounded-3 shadow-sm"
            onClick={handleNearMe}
            disabled={isLoading}
          >
            {isLoading ? 'Finding...' : 'Near Me'}
          </button>
        </div>
      </div>

      <hr />
      {/* Find Along Route */}
      <div className="mb-4">
        <h3 className="fw-bold text-primary mb-3">Find Along Route</h3>
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
          <button type="submit" className="btn btn-primary w-100 mt-3 rounded-3 shadow-sm" disabled={isLoading}>
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
