"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import HotelCard from "@/components/room/HotelCard";
import SearchFilter from "@/components/room/SearchFilter";
import { Button } from "@/components/ui/Button";
import { getPublicHotels } from "@/utils/api";
import { Hotel } from "@/types/hotel";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") || "";
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPublicHotels(location)
      .then((data) => {
        setHotels(data);
        setFilteredHotels(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [location]);

  const handleFilterChange = (filters: any) => {
    let results = [...hotels];
    
    if (filters.priceRange) {
      results = results.filter(h => h.price <= filters.priceRange[1]);
    }
    
    if (filters.stars) {
      results = results.filter(h => h.rating >= filters.stars);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      results = results.filter(h => 
        filters.amenities.every((amenity: string) => h.amenities.includes(amenity))
      );
    }
    
    setFilteredHotels(results);
  };

  return (
    <div className="bg-brand-50 dark:bg-brand-950 min-h-screen pt-32 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-12 border-b border-brand-100 dark:border-brand-900 pb-12">
          <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">
            {loading ? "Đang tìm kiếm..." : `Tìm thấy ${filteredHotels.length} kết quả`}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-brand-900 dark:text-white mb-4">
            Kết Quả Tìm Kiếm {location && `tại "${location}"`}
          </h1>
          <p className="text-brand-600 dark:text-brand-400 text-lg">Tìm thấy những lựa chọn tốt nhất cho kỳ nghỉ sắp tới của bạn.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <SearchFilter location={location} onFilterChange={handleFilterChange} />
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-accent-500" />
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-brand-900 rounded-[32px] p-20 text-center shadow-xl border border-brand-100 dark:border-brand-800">
                <div className="w-20 h-20 bg-brand-50 dark:bg-brand-950 rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-100 dark:border-brand-800">
                  <Search className="w-10 h-10 text-brand-300" />
                </div>
                <h3 className="text-2xl font-bold text-brand-900 dark:text-white mb-3">Không tìm thấy khách sạn nào</h3>
                <p className="text-brand-500 dark:text-brand-400 max-w-sm mx-auto">Chúng tôi không tìm thấy kết quả phù hợp với tiêu chí của bạn. Vui lòng thử thay đổi bộ lọc.</p>
                <Button 
                  variant="outline" 
                  className="mt-10 rounded-2xl border-accent-500/20 text-accent-600 h-12 px-8"
                  onClick={() => setFilteredHotels(hotels)}
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-accent-500" /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
