"use client";

import { useEffect, useState } from "react";
import { MapPin, ArrowRight, Loader2, Globe } from "lucide-react";
import Link from "next/link";

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://hotel-backend-production-222c.up.railway.app/api";
        const response = await fetch(`${apiUrl}/public/posts`);
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero - Identical to original style */}
      <div className="relative bg-gradient-to-br from-accent-600 to-accent-800 text-white py-20 mb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/20">
            <Globe className="w-4 h-4" /> Khám phá bài viết
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 italic">Cảm Hứng Du Lịch</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Khám phá những câu chuyện thú vị và bí quyết du lịch từ đội ngũ chuyên gia của CybertronHotel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-accent-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}
                className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.imageUrl || "https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=600&q=80"} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="font-heading text-2xl font-bold">{post.title}</h2>
                    <div className="flex items-center gap-1 text-sm text-white/80">
                      <MapPin className="w-3 h-3" /> {post.hotels && post.hotels.length > 0 ? post.hotels[0].location : "Hệ thống"}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.subtitle || "Khám phá những trải nghiệm nghỉ dưỡng tuyệt vời và dịch vụ đẳng cấp tại CybertronHotel."}
                  </p>
                  <div className="flex items-center gap-1 text-accent-500 font-semibold text-sm group-hover:gap-2 transition-all">
                    Khám phá ngay <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
