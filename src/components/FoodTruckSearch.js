// src/components/FoodTruckSearch.js
import React, { useState, useEffect, useRef } from 'react';
import { loadGoogleMaps } from '../utils/googleMapsLoader';

const haversineDistance = (c1, c2) => {
  const toRad = v => (v * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(c2.lat - c1.lat);
  const dLng = toRad(c2.lng - c1.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(c1.lat)) * Math.cos(toRad(c2.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const FoodTruckSearch = ({ foodTrucks = [], onFilterChange }) => {
  const [filteredTrucks, setFilteredTrucks] = useState(foodTrucks);
  const [searchLocation, setSearchLocation] = useState(null);
  const [travelPath, setTravelPath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [truckName, setTruckName] = useState('');
  const [vegan, setVegan] = useState(false);
  const [gf, setGf] = useState(false);
  const [cuisineFilters, setCuisineFilters] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const cuisines = ['Tacos', 'BBQ', 'Pizza', 'Burgers', 'Vegan', 'Sushi', 'Dessert', 'Seafood'];

  const prev = useRef({ filteredTrucks: [], searchLocation: null, travelPath: null });

  // === FILTER LOGIC ===
  useEffect(() => {
    if (!Array.isArray(foodTrucks)) return;

    const filtered = foodTrucks.filter(truck => {
      const name = !truckName || (truck.name && truck.name.toLowerCase().includes(truckName.toLowerCase()));
      const cuisine = cuisineFilters.length === 0 || (truck.cuisine && cuisineFilters.some(c => truck.cuisine.includes(c)));
      const v = !vegan || (truck.menu && truck.menu.some(m => m.dietary?.includes('Vegan')));
      const g = !gf || (truck.menu && truck.menu.some(m => m.dietary?.includes('Gluten-Free')));
      return name && cuisine && v && g;
    });

    setFilteredTrucks(filtered);
  }, [truckName, vegan, gf, cuisineFilters, foodTrucks]);

  // === CALL PARENT ONLY IF CHANGED ===
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

  // === NEAR ME ===
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

  // === LOCATION SEARCH ===
  const handleLocationSearch = async e => {
    e.preventDefault();
    if (!locationInput.trim()) return;
    try {
      const google = await loadGoogleMaps();
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationInput }, (res, status) => {
        if (status === 'OK') {
          setSearchLocation({ lat: res[0].geometry.location.lat(), lng: res[0].geometry.location.lng() });
        }
      });
    } catch {}
  };

  // === ROUTE SEARCH ===
  const handleRouteSearch = async e => {
    e.preventDefault();
    if (!origin || !destination) return;
    try {
      const google = await loadGoogleMaps();
      const ds = new google.maps.DirectionsService();
      ds.route({ origin, destination, travelMode: 'DRIVING' }, (res, status) => {
        if (status === 'OK') {
          const path = res.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
          setTravelPath({ origin, destination, path });
        }
      });
    } catch {}
  };

  // === RESET ===
  const reset = () => {
    setTruckName('');
    setVegan(false);
    setGf(false);
    setCuisineFilters([]);
    setLocationInput('');
    setOrigin('');
    setDestination('');
    setSearchLocation(null);
    setTravelPath(null);
    onFilterChange?.(foodTrucks, null, null);
  };

  return (
    <div className="p-3">
      {/* 1. TRUCK NAME */}
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

      {/* 2. LOCATION */}
      <div className="mb-4">
        <label className="form-label fw-bold text-primary">Location</label>
        <form onSubmit={handleLocationSearch} className="d-flex gap-2 mb-3">
          <input
            type="text"
            className="form-control rounded-3 shadow-sm"
            placeholder="City, State, ZIP"
            value={locationInput}
            onChange={e => setLocationInput(e.target.value)}
          />
        </form>
      </div>

      {/* 3. FILTERS */}
      <div className="mb-4">
        <h6 className="fw-bold text-primary mb-3">Dietary Options</h6>
        <div className="d-flex gap-3 flex-wrap">
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

      <div className="mb-4">
        <h6 className="fw-bold text-primary mb-3">Cuisine Type</h6>
        <div className="d-flex flex-wrap gap-2">
          {cuisines.map(c => (
            <span
              key={c}
              className={`badge rounded-pill px-4 py-2 fs-6 cursor-pointer transition ${
                cuisineFilters.includes(c) ? 'bg-primary text-white shadow-sm' : 'bg-light text-dark border'
              }`}
              onClick={() => setCuisineFilters(prev =>
                prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
              )}
              style={{ cursor: 'pointer' }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* 4. SEARCH BUTTONS */}
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
            type="submit"
            className="btn btn-outline-primary btn-lg w-100 rounded-3 shadow-sm"
            onClick={handleLocationSearch}
          >
            Search Location
          </button>
        </div>
      </div>

      <hr className="my-4" />

      {/* 5. ALONG ROUTE */}
      <div className="mb-4">
        <h6 className="fw-bold text-primary mb-3">Find Along Route</h6>
        <form onSubmit={handleRouteSearch}>
          <div className="row g-2">
            <div className="col-6">
              <input
                className="form-control rounded-3 shadow-sm"
                placeholder="Start"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
              />
            </div>
            <div className="col-6">
              <input
                className="form-control rounded-3 shadow-sm"
                placeholder="End"
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

      {/* 6. CLEAR */}
      <button className="btn btn-outline-secondary w-100 rounded-3 shadow-sm" onClick={reset}>
        Clear All Filters
      </button>
    </div>
  );
};

export default FoodTruckSearch;
