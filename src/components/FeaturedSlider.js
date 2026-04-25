// src/components/FeaturedSlider.js
import * as React from 'react';
import { useRef } from 'react';
import FeaturedCard from './featured';

const FeaturedSlider = ({ items = [], title = "Local Spotlights" }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="featured-section bg-light py-2 position-relative">
      {/* Container spacing: px-4 adds that "smidge" of edge padding */}
      <div className="px-4 d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center gap-2">
           <i className="bi bi-stars text-warning"></i>
           <h6 className="text-uppercase fw-bold text-muted small mb-0">{title}</h6>
        </div>
        
        <div className="d-none d-md-flex gap-2">
          <button className="btn btn-sm btn-outline-dark rounded-circle" onClick={() => scroll('left')}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="btn btn-sm btn-outline-dark rounded-circle" onClick={() => scroll('right')}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="d-flex overflow-auto px-4 pb-3 no-scrollbar" 
        style={{ 
          gap: '12px', 
          scrollSnapType: 'x mandatory', 
          WebkitOverflowScrolling: 'touch' 
        }}
      >
        {items.map((item) => (
          <div 
            key={item.id} 
            style={{ minWidth: '80%', maxWidth: '350px', scrollSnapAlign: 'center' }} 
            className="flex-shrink-0"
          >
            <FeaturedCard item={item} />
          </div>
        ))}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default FeaturedSlider;
