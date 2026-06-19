"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Star } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Filters {
  location: string;
  priceRange: [number, number];
  amenities: string[];
  stars: number | null;
}

interface SearchFilterProps {
  location?: string;
  onFilterChange?: (filters: Filters) => void;
}

const AMENITIES = ["Free WiFi", "Swimming Pool", "Spa", "Fitness Center", "Restaurant", "Ocean View", "City View"];

export default function SearchFilter({ location = "", onFilterChange }: SearchFilterProps) {
  const [filters, setFilters] = useState<Filters>({
    location: location,
    priceRange: [0, 2000],
    amenities: [],
    stars: null
  });

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      
      const updated = { ...prev, amenities: newAmenities };
      if (onFilterChange) onFilterChange(updated);
      return updated;
    });
  };

  const handleStarToggle = (star: number) => {
    setFilters(prev => {
      const newStar = prev.stars === star ? null : star;
      const updated = { ...prev, stars: newStar };
      if (onFilterChange) onFilterChange(updated);
      return updated;
    });
  };

  return (
    <div className="bg-card rounded-[32px] shadow-sm border border-border p-8 sticky top-28">
      <h3 className="font-heading font-bold text-xl mb-8 flex items-center gap-3 text-card-foreground">
        <Search className="w-5 h-5 text-accent-500" />
        Bộ lọc tìm kiếm
      </h3>

      {/* Location */}
      <div className="mb-8">
        <label className="block text-xs font-black text-muted-foreground tracking-[0.2em] uppercase mb-3">Địa điểm</label>
        <Input 
          icon={<MapPin className="w-4 h-4 text-accent-500" />}
          placeholder="Bạn muốn đi đâu?"
          className="rounded-2xl bg-muted border-transparent focus:border-accent-500/30 transition-all h-12"
          value={filters.location}
          onChange={(e) => {
            const updated = { ...filters, location: e.target.value };
            setFilters(updated);
            if (onFilterChange) onFilterChange(updated);
          }}
        />
      </div>

      {/* Price Range (Simplified) */}
      <div className="mb-8">
        <label className="block text-xs font-black text-muted-foreground tracking-[0.2em] uppercase mb-4">Giá tối đa / Đêm</label>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-heading font-bold text-card-foreground">${filters.priceRange[1]}</span>
          <span className="text-[10px] text-muted-foreground font-bold">USD</span>
        </div>
        <input 
          type="range" 
          min="50" 
          max="2000" 
          step="50"
          value={filters.priceRange[1]}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            const updated = { ...filters, priceRange: [0, val] as [number, number] };
            setFilters(updated);
            if (onFilterChange) onFilterChange(updated);
          }}
          className="w-full accent-accent-500 cursor-pointer"
        />
      </div>

      {/* Star Rating */}
      <div className="mb-8">
        <label className="block text-xs font-black text-muted-foreground tracking-[0.2em] uppercase mb-4">Xếp hạng sao</label>
        <div className="flex gap-3">
          {[5, 4, 3].map(star => (
            <button
              key={star}
              onClick={() => handleStarToggle(star)}
              className={`flex-1 py-3 text-sm font-bold rounded-2xl border-2 flex items-center justify-center gap-2 transition-all ${
                filters.stars === star 
                  ? 'border-accent-500 bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400' 
                  : 'border-border bg-muted text-muted-foreground hover:border-accent-500/30'
              }`}
            >
              {star} <Star className={`w-4 h-4 ${filters.stars === star ? 'fill-accent-500 text-accent-500' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-8">
        <label className="block text-xs font-black text-muted-foreground tracking-[0.2em] uppercase mb-4">Tiện nghi</label>
        <div className="grid grid-cols-1 gap-3">
          {AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                filters.amenities.includes(amenity) ? 'bg-accent-500 border-accent-500 shadow-lg shadow-accent-500/20' : 'border-border bg-muted group-hover:border-accent-500/30'
              }`}>
                {filters.amenities.includes(amenity) && (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {amenity}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button className="w-full h-14 rounded-2xl shadow-xl shadow-accent-500/20 font-bold mt-4" onClick={() => {
        if (onFilterChange) onFilterChange(filters);
      }}>
        Áp dụng bộ lọc
      </Button>
    </div>
  );
}
