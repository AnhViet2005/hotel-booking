import Image from "next/image";
import Link from "next/link";

const FEATURED_HOTELS = [
  { name: "The Azure Resort", location: "Maldives", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80", link: "/hotel/h1" },
  { name: "Eiffel View Boutique", location: "Paris", img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80", link: "/hotel/h5" },
  { name: "Villa Serenity", location: "Bali", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80", link: "/hotel/h3" },
  { name: "Santorini Cliff", location: "Santorini", img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80", link: "/hotel/h4" },
];

export default function FeaturedDestinations() {
  return (
    <section className="py-24 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">Trải nghiệm đẳng cấp</div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Khách Sạn Nổi Bật</h2>
          </div>
          <Link href="/search" className="hidden sm:flex items-center gap-2 text-foreground font-bold hover:text-accent-500 transition-colors bg-muted px-6 py-3 rounded-2xl border border-border">
            Xem tất cả <span className="text-accent-500">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_HOTELS.map((hotel, i) => (
            <Link href={hotel.link} key={i} className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block">
              <Image src={hotel.img} alt={hotel.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-heading font-bold text-white mb-1">{hotel.name}</h3>
                <p className="text-white/80 text-sm font-medium">{hotel.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
