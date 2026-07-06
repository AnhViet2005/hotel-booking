"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublicPostById } from "@/utils/api";
import { Loader2, ArrowLeft, Calendar, User, MapPin, Star, ExternalLink, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await getPublicPostById(id as string);
      setPost(data);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-accent-500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">{error || "Không tìm thấy bài viết"}</h1>
        <Link href="/" className="text-accent-500 hover:underline">Về trang chủ</Link>
      </div>
    );
  }

  const paragraphs = post.content ? post.content.split("\n").filter((p: string) => p.trim() !== "") : [];
  const hotels = post.hotels || [];

  return (
    <div className="bg-background min-h-screen pb-24 transition-colors overflow-x-hidden">
      {/* Immersive Hero Header */}
      <div className="relative h-[70vh] min-h-[550px] w-full overflow-hidden">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-background"></div>
        
        <div className="absolute inset-0 flex flex-col justify-end pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full border-white/0 border">
          <Link href="/posts" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-all mb-10 group bg-white/5 w-fit px-4 py-2 rounded-2xl backdrop-blur-md border border-white/5">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1" /> Quay lại
          </Link>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-accent-500">
              <span className="bg-accent-500/10 px-4 py-1.5 rounded-full border border-accent-500/20">TRẢI NGHIỆM</span>
              <span className="text-white/30">•</span>
              <span className="text-white/50">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-heading font-black text-white leading-[1] drop-shadow-2xl max-w-5xl">
              {post.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium border-l-4 border-accent-500 pl-8">
              {post.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-20">
            {/* Left Column: Continuous Content */}
            <div className="flex-1 max-w-3xl">
                <div className="prose prose-xl dark:prose-invert prose-p:my-0 text-foreground/85 leading-[1.8] font-medium space-y-6">
                    {paragraphs.map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>
            </div>

            {/* Right Column: Sidebar Hotels */}
            {hotels.length > 0 && (
                <div className="lg:w-[500px] flex-shrink-0">
                    <div className="sticky top-24 space-y-12">
                        <div className="pb-4 border-b border-border mb-8">
                            <h2 className="text-2xl font-black font-heading text-foreground">Khách sạn lý tưởng</h2>
                            <p className="text-muted-foreground text-sm">Những đề xuất tốt nhất dựa trên bài viết</p>
                        </div>
                        
                        {hotels.map((h: any) => (
                            <Link key={h.id} href={`/hotel/${h.id}`} className="group block">
                                <div className="bg-card rounded-[32px] overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:border-accent-500/30 transition-all duration-500 flex h-44 w-full">
                                    <div className="w-40 flex-shrink-0 h-full overflow-hidden relative">
                                        <img 
                                            src={h.image} 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                            alt={h.name}
                                        />
                                        <div className="absolute top-2 left-2 bg-accent-500 text-white px-2 py-0.5 rounded-lg text-[9px] font-bold">
                                            ★ {Number(h.rating || 4.5).toFixed(1)}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 p-5 flex flex-col justify-between bg-gradient-to-r from-card to-muted/5">
                                        <div>
                                            <div className="flex items-center gap-1 text-accent-500 text-[8px] font-black uppercase mb-1">
                                                <MapPin className="w-3 h-3" /> {h.location}
                                            </div>
                                            <h3 className="text-lg font-heading font-black text-foreground group-hover:text-accent-500 transition-colors line-clamp-1">
                                                {h.name}
                                            </h3>
                                            <p className="text-muted-foreground text-[11px] line-clamp-2 mt-1 leading-relaxed">
                                                Lựa chọn tuyệt vời cho kỳ nghỉ của bạn.
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                            <div>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase block">Từ</span>
                                                <span className="text-lg font-black text-foreground">
                                                    {typeof h.price === 'number' ? h.price.toLocaleString('vi-VN') + ' ₫' : h.price}
                                                </span>
                                            </div>
                                            <div className="bg-accent-500 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-accent-600 transition-colors">
                                                <ExternalLink className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
