"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicPosts } from "@/utils/api";

const STATIC_POSTS = [
  { id: 1, title: "Sapa", subtitle: "Lào Cai, Việt Nam", imageUrl: "https://images.unsplash.com/photo-1598285521151-c4391694f488?w=800&q=80" },
  { id: 2, title: "Đà Lạt", subtitle: "Lâm Đồng, Việt Nam", imageUrl: "https://images.unsplash.com/photo-1549474843-ed839ec15f91?w=800&q=80" },
  { id: 3, title: "Phú Quốc", subtitle: "Kiên Giang, Việt Nam", imageUrl: "https://images.unsplash.com/photo-1589394815804-964ed0bc2eb5?w=800&q=80" },
  { id: 4, title: "Hạ Long", subtitle: "Quảng Ninh, Việt Nam", imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80" },
];

export default function FeaturedDestinations() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPublicPosts();
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(STATIC_POSTS);
        }
      } catch (error) {
        setPosts(STATIC_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="py-24 bg-background transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <div className="text-accent-500 font-bold tracking-[0.2em] uppercase text-xs mb-3">Khám phá hành trình</div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">Bài viết nổi bật</h2>
          </div>
          <Link href="/posts" className="hidden sm:flex items-center gap-2 text-foreground font-bold hover:text-accent-500 transition-colors bg-muted px-6 py-3 rounded-2xl border border-border">
            Xem tất cả <span className="text-accent-500">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse"></div>
            ))
          ) : (
            posts.map((post, i) => {
              return (
                <Link 
                  href={`/post/${post.id}`} 
                  key={i} 
                  className="group relative h-80 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 block"
                >
                  <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-2xl font-heading font-bold text-white mb-1">{post.title}</h3>
                    <p className="text-white/80 text-sm font-medium line-clamp-1">{post.subtitle}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
