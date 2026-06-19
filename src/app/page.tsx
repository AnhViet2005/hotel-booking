"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import TopHotels from "@/components/home/TopHotels";
import { getPublicHotels } from "@/utils/api";
import { Hotel } from "@/types/hotel";

export default function Home() {
  const [searchLocation, setSearchLocation] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const router = useRouter();

  useEffect(() => {
    getPublicHotels().then(setHotels).catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?location=${searchLocation}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeaturedDestinations />
      <TopHotels hotels={hotels} />
    </div>
  );
}
