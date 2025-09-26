import React, { useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Haversine formula to calculate distance between two points (in miles)
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
  const [truckName, setTruckName] = useState('');
  const [location, setLocation] = useState('');
  const [vegan, setVegan] = useState(false);
  const [gf, setGf] = useState(false);
  const [cuisineFilters, setCuisineFilters] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  // Available cuisines
  const cuisines = ['American', 'Italian', 'Mexican'];

  // Apply filters (truck name, cuisine, dietary)
  const applyFilters = (trucks) => {
    return trucks.filter((truck) => {
      const matchesName = truckName
        ? truck.name.toLowerCase().includes(truckName.toLowerCase())
        : true;
      const matchesCuisine =
        cuisineFilters.length === 0 ||
        cuisineFilters.some((cuisine) => truck.cuisine.includes(cuisine));
      const matchesVegan = vegan ? truck.cuisine.includes('Vegan') : true;
      const matchesGf = gf ? truck.cuisine.includes('Gluten-Free') : true;
      return matchesName && matchesCuisine && matchesVegan && matchesGf;
    });
  };

  // Handle current location search
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const searchCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setSearchLocation(searchCoords);

          // Filter trucks by proximity (50 miles), no cuisine/dietary filters
          const filtered = foodTrucks.filter((truck) => {
            const truckCoords = truck.isAtEvent ? truck.eventLocation : truck.mainLocation;
            if (!truckCoords || !truckCoords.lat || !truckCoords.lng) {
              console.log(`Invalid coordinates for truck: ${truck.name}`);
              return false;
            }
            const distance = haversineDistance(searchCoords, {
              lat: truckCoords.lat,
              lng: truckCoords.lng,
            });
            return distance <= 50;
          });

          console.log('Current location filtered trucks:', filtered);
          setFilteredTrucks(filtered);
          setTravelPath(null);
        },
        () => {
          console.log('Geolocation not available');
          setFilteredTrucks(foodTrucks);
        }
      );
    } else {
      console.log('Geolocation not supported');
      setFilteredTrucks(foodTrucks);
    }
  };

  // Handle main search (truck name, location, filters)
  const handleMainSearch = async (e) => {
    e.preventDefault();
    let filtered = applyFilters(foodTrucks);

    if (location) {
      const loader = new Loader({ apiKey: process.env.GATSBY_GOOGLE_MAPS_API_KEY });
      const google = await loader.load();
      const geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address: location }, (results, status) => {
        if (status === 'OK') {
          const { lat, lng } = results[0].geometry.location;
          const searchCoords = { lat: lat(), lng: lng() };
          setSearchLocation(searchCoords);

          // Filter by proximity (50 miles)
          filtered = filtered.filter((truck) => {
            const truckCoords = truck.isAtEvent ? truck.eventLocation : truck.mainLocation;
            if (!truckCoords || !truckCoords.lat || !truckCoords.lng) {
              console.log(`Invalid coordinates for truck: ${truck.name}`);
              return false;
            }
            const distance = haversineDistance(searchCoords, {
              lat: truckCoords.lat,
              lng: truckCoords.lng,
            });
            return distance <= 50;
          });

          console.log('Location search filtered trucks:', filtered);
          setFilteredTrucks(filtered);
          setTravelPath(null);
        } else {
          console.log('Geocoding failed:', status);
          setFilteredTrucks(filtered);
          setSearchLocation(null);
        }
      });
    } else {
      console.log('Main search filtered trucks:', filtered);
      setFilteredTrucks(filtered);
      setSearchLocation(null);
    }
  };

  // Handle route search
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
              lng: results[0].geometry.location.lng,
            });
          } else {
            resolve(null);
          }
        });
      });

    const originCoords = await geocodeAddress(origin);
    const destCoords = await geocodeAddress(destination);
    if (originCoords && destCoords) {
      // Filter trucks by proximity to route (50 miles from origin or destination)
      const filtered = foodTrucks.filter((truck) => {
        const truckCoords = truck.isAtEvent ? truck.eventLocation : truck.mainLocation;
        if (!truckCoords || !truckCoords.lat || !truckCoords.lng) {
          console.log(`Invalid coordinates for truck: ${truck.name}`);
          return false;
        }
        const distToOrigin = haversineDistance(originCoords, {
          lat: truckCoords.lat,
          lng: truckCoords.lng,
        });
        const distToDest = haversineDistance(destCoords, {
          lat: truckCoords.lat,
          lng: truckCoords.lng,
        });
        return distToOrigin <= 50 || distToDest <= 50;
      });

      console.log('Route search filtered trucks:', filtered);
      setTravelPath({ origin: originCoords, destination: destCoords });
      setSearchLocation(null);
      setFilteredTrucks(filtered);
    } else {
      console.log('Geocoding failed for route');
    }
  };

  // Handle cuisine filter changes
  const handleCuisineChange = (cuisine) => {
    setCuisineFilters((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  return (
    <div className="sidebar bg-light p-3 h-100">
      <h3 className="mb-4">Find Food Trucks</h3>
      {/* 1. Current Location Button */}
      <button
        type="button"
        className="btn btn-primary w-100 mb-4"
        onClick={handleCurrentLocation}
      >
        Find Trucks at My Location
      </button>
      {/* 2. Main Search Form (Truck Name, Location, Filters) */}
      <form onSubmit={handleMainSearch}>
        <div className="mb-3">
          <label htmlFor="truckName" className="form-label fw-bold">
            Truck Name
          </label>
          <input
            type="text"
            className="form-control"
            id="truckName"
            placeholder="e.g., Taco King"
            value={truckName}
            onChange={(e) => {
              setTruckName(e.target.value);
              handleMainSearch({ preventDefault: () => {} });
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label fw-bold">
            Location (City, State, Zip, or Place)
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            placeholder="e.g., Jensen, UT or St. Peter's Basilica"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <h5 className="mb-2">Dietary Filters</h5>
        <div className="row">
          <div className="col-md-6">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="vegan"
                checked={vegan}
                onChange={(e) => {
                  setVegan(e.target.checked);
                  handleMainSearch({ preventDefault: () => {} });
                }}
              />
              <label className="form-check-label" htmlFor="vegan">
                Vegan
              </label>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="gf"
                checked={gf}
                onChange={(e) => {
                  setGf(e.target.checked);
                  handleMainSearch({ preventDefault: () => {} });
                }}
              />
              <label className="form-check-label" htmlFor="gf">
                Gluten-Free
              </label>
            </div>
          </div>
        </div>
        <h5 className="mb-2">Cuisine Filters</h5>
        {cuisines.map((cuisine) => (
          <div key={cuisine} className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              value={cuisine}
              id={`cuisine${cuisine}`}
              checked={cuisineFilters.includes(cuisine)}
              onChange={() => {
                handleCuisineChange(cuisine);
                handleMainSearch({ preventDefault: () => {} });
              }}
            />
            <label className="form-check-label" htmlFor={`cuisine${cuisine}`}>
              {cuisine}
            </label>
          </div>
        ))}
        <button type="submit" className="btn btn-primary w-100 mt-3">
          Search
        </button>
      </form>
      <hr className="my-4" />
      {/* 3. Route Search Form */}
      <h3 className="mb-4">Find Trucks Along a Route</h3>
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
