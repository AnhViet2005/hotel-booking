"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Hotel } from "@/types/hotel";
import { formatCurrency } from "@/utils/format";

interface HotelCardProps {
  hotel: Pick<Hotel, "id" | "name" | "location" | "price" | "rating" | "reviews" | "image">;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : "";

  return (
    <Link href={`/hotel/${hotel.id}${queryString}`} className="block group h-full">
      <div className="bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:shadow-accent-500/10 transition-all duration-500 cursor-pointer h-full flex flex-col group/card">
        <div className="relative h-72 overflow-hidden">
          {hotel.image && hotel.image.startsWith("http://localhost") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
            />
          ) : (
            <Image 
              src={hotel.image || "https://images.unsplash.com/photo-1542314831-c6a4d14d8c53?w=800&q=80"} 
              alt={hotel.name} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover/card:scale-110 transition-transform duration-700" 
            />
          )}
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur rounded-2xl px-3 py-1.5 flex items-center gap-1.5 shadow-lg border border-border">
            <Star className="w-4 h-4 text-accent-500 fill-accent-500" />
            <span className="font-bold text-sm text-card-foreground">{hotel.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({hotel.reviews})</span>
          </div>
        </div>
        <div className="p-8 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-2xl text-card-foreground mb-3 group-hover/card:text-accent-600 dark:group-hover/card:text-accent-400 transition-colors line-clamp-1">{hotel.name}</h3>
            <div className="flex items-center text-muted-foreground text-sm mb-6">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-accent-500" />
              <span className="line-clamp-1">{hotel.location}</span>
            </div>
          </div>
          <div className="mt-4 pt-6 border-t border-border flex items-end justify-between">
            <div>
              <span className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1 block">Chỉ từ</span>
              <div className="flex items-baseline">
                <span className="font-heading font-bold text-2xl text-card-foreground">{formatCurrency(hotel.price)}</span>
                <span className="text-muted-foreground text-sm ml-1.5">/đêm</span>
              </div>
            </div>
            <Button variant="outline" className="rounded-2xl border-accent-500/20 text-accent-600 dark:text-accent-400 hover:bg-accent-500 hover:text-white hover:border-accent-500 transition-all duration-300 px-6">
              Xem ưu đãi
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
