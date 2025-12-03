// filter.js
import React, { useState, useEffect } from 'react';

const Filter = ({ foodTrucks, setFilteredTrucks }) => {
  const [truckName, setTruckName] = useState('');
  const [vegan, setVegan] = useState(false);
  const [gf, setGf] = useState(false);
  const [cuisineFilters, setCuisineFilters] = useState([]);

  // Available cuisines
  const cuisines = ['American', 'Italian', 'Mexican'];

  // Apply filters
  const applyFilters = (trucks) => {
    if (!trucks || trucks.length === 0) {
      console.log('No food trucks available for filtering');
      setFilteredTrucks([]);
      return;
    }

    console.log('Filter input:', { truckName, vegan, gf, cuisineFilters });
    console.log('Sample truck data:', trucks[0]);

    const filtered = trucks.filter((truck) => {
      const matchesName = truckName
        ? truck.name?.toLowerCase().includes(truckName.toLowerCase())
        : true;
      const matchesCuisine =
        cuisineFilters.length === 0 ||
        cuisineFilters.some((cuisine) => truck.cuisine?.includes(cuisine));
      const matchesVegan = vegan
        ? truck.menu?.some((item) => item.dietary?.includes('Vegan'))
        : true;
      const matchesGf = gf
        ? truck.menu?.some((item) => item.dietary?.includes('Gluten-Free'))
        : true;
      console.log(`Truck ${truck.name || 'Unnamed'}:`, {
        matchesName,
        matchesCuisine,
        matchesVegan,
        matchesGf,
        cuisine: truck.cuisine,
        menu: truck.menu?.map(m => m.dietary),
      });
      return matchesName && matchesCuisine && matchesVegan && matchesGf;
    });

    console.log('Filtered trucks:', filtered);
    setFilteredTrucks(filtered);
  };

  // Handle cuisine checkbox changes
  const handleCuisineChange = (cuisine) => {
    setCuisineFilters((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setTruckName('');
    setVegan(false);
    setGf(false);
    setCuisineFilters([]);
    setFilteredTrucks(foodTrucks);
  };

  // Apply filters automatically
  useEffect(() => {
    applyFilters(foodTrucks);
  }, [truckName, vegan, gf, cuisineFilters, foodTrucks, setFilteredTrucks]);

  return (
    <div className="filter-section">
      <form>
        <div className="mb-3">
          <label htmlFor="truckName" className="form-label fw-bold">
            Food Truck Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="truckName"
            placeholder="e.g., Taco King"
            value={truckName}
            onChange={(e) => setTruckName(e.target.value)}
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
                onChange={(e) => setVegan(e.target.checked)}
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
                onChange={(e) => setGf(e.target.checked)}
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
              onChange={() => handleCuisineChange(cuisine)}
            />
            <label className="form-check-label" htmlFor={`cuisine${cuisine}`}>
              {cuisine}
            </label>
          </div>
        ))}
        <button type="button" className="btn btn-secondary w-100 mt-3" onClick={resetFilters}>
          Reset Filters
        </button>
      </form>
      {foodTrucks.length === 0 && (
        <div className="alert alert-warning mt-3">
          No food trucks loaded. Check your database connection.
        </div>
      )}
    </div>
  );
};

export default Filter;
