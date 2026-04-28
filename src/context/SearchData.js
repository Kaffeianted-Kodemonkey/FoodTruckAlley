import React, { createContext, useState, useContext, useMemo } from 'react';

const SearchDataContext = createContext();

// Helper: Distance calculation for the Radius filter
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3958.8; // Miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const SearchDataProvider = ({ children, rawTrucks = [], rawEvents = [] }) => {
    const [activeTab, setActiveTab] = useState('Trucks');
    const [filters, setFilters] = useState({
        query: '',
        cuisine: 'all',
        dietary: [],
        radius: 25,
        centerCoords: null,
        locationLabel: 'Your current view'
    });

    // The Filter Engine
    const filteredResults = useMemo(() => {
        const list = activeTab === 'Trucks' ? rawTrucks : rawEvents;
        
        return list.filter(item => {
            // 1. Keyword Check
            const matchesQuery = !filters.query || 
                item.title.toLowerCase().includes(filters.query.toLowerCase()) ||
                item.description?.toLowerCase().includes(filters.query.toLowerCase());

            // 2. Cuisine Check
            const matchesCuisine = filters.cuisine === 'all' || item.cuisine === filters.cuisine;

            // 3. Dietary Check
            const matchesDietary = filters.dietary.length === 0 ||
                filters.dietary.every(tag => item.menu?.some(m => m.diet?.includes(tag)));

            // 4. Distance Check
            let matchesDistance = true;
            if (filters.centerCoords && item.lat && item.lng) {
                const dist = calculateDistance(filters.centerCoords.lat, filters.centerCoords.lng, item.lat, item.lng);
                matchesDistance = dist <= filters.radius;
            }

            return matchesQuery && matchesCuisine && matchesDietary && matchesDistance;
        });
    }, [filters, rawTrucks, rawEvents, activeTab]);

    const value = {
        trucks: rawTrucks,
        events: rawEvents,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        filteredResults
    };

    return (
        <SearchDataContext.Provider value={value}>
            {children}
        </SearchDataContext.Provider>
    );
};

// Hook to use this data in any component
export const useSearchData = () => {
  const context = React.useContext(SearchDataContext);
  if (!context) {
    // This is a great debug safety net
    console.error("useSearchData must be used within a SearchDataProvider");
  }
  return context;
};
