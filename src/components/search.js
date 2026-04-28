import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useSearchData } from '../context/SearchData';

const Search = ({ onClose }) => {
  // 1. TUNE IN TO CONTEXT
  const { 
    trucks, 
    events, 
    activeTab, 
    filters: globalFilters, 
    setFilters: setGlobalFilters 
  } = useSearchData();

  // 2. LOCAL STATE FOR FORM (Synced with Global)
  const [localFilters, setLocalFilters] = useState(globalFilters);
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef(null);
  const placesLibrary = useMapsLibrary('places');

  // Sync local state if global state changes
  useEffect(() => {
    setLocalFilters(globalFilters);
  }, [globalFilters]);

  // 3. DYNAMIC PILL SCANNER
  const { availableCuisines, availableDietary } = useMemo(() => {
    const list = activeTab === 'Trucks' ? trucks : events;
    const cuisines = new Set();
    const dietary = new Set();

    if (list && list.length > 0) {
      list.forEach(item => {
        if (item.cuisine) cuisines.add(item.cuisine);
        item.menu?.forEach(m => {
          if (m.diet) {
            m.diet.split(',').forEach(tag => {
              const cleanTag = tag.trim();
              if (cleanTag) dietary.add(cleanTag);
            });
          }
        });
      });
    }
    return {
      availableCuisines: Array.from(cuisines).sort(),
      availableDietary: Array.from(dietary).sort()
    };
  }, [trucks, events, activeTab]);

  // 4. GOOGLE PLACES AUTOCOMPLETE
  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;
    const autocomplete = new placesLibrary.Autocomplete(inputRef.current, {
      types: ['(regions)'],
      componentRestrictions: { country: "us" }
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        setLocalFilters(prev => ({
          ...prev,
          centerCoords: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
          locationLabel: place.formatted_address
        }));
      }
    });
  }, [placesLibrary]);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocalFilters(prev => ({
          ...prev,
          centerCoords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          locationLabel: 'My Current Location'
        }));
        setIsLocating(false);
      }, () => setIsLocating(false));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalFilters(localFilters); // Push local changes to global context
    onClose();
  };

  return (
    <div className="d-flex flex-column h-100 p-4 bg-white shadow overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h5 className="mb-0 fw-bold">Filter {activeTab}</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>

      <form className="flex-grow-1 d-flex flex-column" onSubmit={handleSubmit}>
        
        {/* Cuisine Pills */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted mb-2">Cuisine</label>
          <div className="d-flex flex-wrap gap-2">
            <button 
              type="button" 
              className={`btn btn-sm rounded-pill px-3 ${localFilters.cuisine === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} 
              onClick={() => setLocalFilters({ ...localFilters, cuisine: 'all' })}
            >
              All
            </button>
            {availableCuisines.map(c => (
              <button 
                key={c} 
                type="button" 
                className={`btn btn-sm rounded-pill px-3 ${localFilters.cuisine === c ? 'btn-primary' : 'btn-outline-secondary'}`} 
                onClick={() => setLocalFilters({ ...localFilters, cuisine: c === localFilters.cuisine ? 'all' : c })}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Pills */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-muted mb-2">Dietary Restrictions</label>
          <div className="d-flex flex-wrap gap-2">
            {availableDietary.length > 0 ? (
              availableDietary.map(tag => (
                <button 
                  key={tag} 
                  type="button" 
                  className={`btn btn-sm rounded-pill px-3 ${localFilters.dietary.includes(tag) ? 'btn-success text-white border-0' : 'btn-outline-secondary'}`} 
                  onClick={() => setLocalFilters(prev => ({ 
                    ...prev, 
                    dietary: prev.dietary.includes(tag) ? prev.dietary.filter(t => t !== tag) : [...prev.dietary, tag] 
                  }))}
                >
                  {tag}
                </button>
              ))
            ) : (
              <small className="text-muted fst-italic">No dietary tags found.</small>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="mb-3 pt-3 border-top">
          <button type="button" className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2 fw-bold" onClick={handleUseCurrentLocation}>
            {isLocating ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-crosshair"></i>}
            Use My Location
          </button>
        </div>

        <div className="mb-4">
          <label className="form-label small fw-bold text-muted">Heading To</label>
          <input 
            ref={inputRef} 
            type="text" 
            className="form-control bg-light border-0 shadow-sm mb-2" 
            placeholder="City or Zip..." 
            defaultValue={localFilters.locationLabel === 'Your current view' ? '' : localFilters.locationLabel} 
          />
          <label className="form-label small fw-bold text-muted d-flex justify-content-between mt-2">
            <span>Radius</span>
            <span className="text-primary">{localFilters.radius} miles</span>
          </label>
          <input 
            type="range" 
            className="form-range" 
            min="1" max="50" step="1" 
            value={localFilters.radius} 
            onChange={(e) => setLocalFilters({ ...localFilters, radius: e.target.value })} 
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mt-auto py-3 rounded-4 fw-bold shadow">Update Results</button>
      </form>
    </div>
  );
};

export default Search;
