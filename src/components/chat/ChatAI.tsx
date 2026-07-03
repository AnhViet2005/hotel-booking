"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Minus, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getPublicHotels } from "@/utils/api";
import { Hotel } from "@/types/hotel";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  data?: any; // To store hotel objects for rendering
}

export default function ChatAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Xin chào! Tôi là trợ lý ảo của Cybertron Hotel. Tôi có thể giúp bạn tìm khách sạn tại mọi tỉnh thành. Bạn muốn tìm khách sạn ở đâu?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPublicHotels()
      .then(setHotels)
      .catch((err) => console.error("Chat AI failed to load hotels", err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const normalizeText = (text: string | null | undefined) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim().toLowerCase();
    const normalizedInput = normalizeText(currentInput);
    setInput("");
    setIsLoading(true);

    // AI Logic with Multi-criteria Search
    setTimeout(() => {
        let aiContent = "";
        let foundHotels: Hotel[] = [];
        let aiMessageData: any = null;
        
        // 1. Search by City
        const cities = ["hà nội", "đà nẵng", "hồ chí minh", "quảng ninh", "nha trang", "phú quốc", "đà lạt", "vũng tàu"];
        const matchedCity = cities.find(city => normalizedInput.includes(normalizeText(city)));

        // 2. Search by Hotel Name (Improved token-based search)
        const matchedByName = hotels.filter(h => {
            const normalizedName = normalizeText(h.name);
            const nameTokens = normalizedName.split(/\s+/).filter(t => t.length > 1); 
            return normalizedName !== "" && (
                normalizedName.includes(normalizedInput) || 
                normalizedInput.includes(normalizedName) ||
                nameTokens.some(token => normalizedInput.includes(token))
            );
        });

        // Intent Detection
        const isAskingForRoomCount = normalizedInput.includes("loai phong") || normalizedInput.includes("nhieu phong") || normalizedInput.includes("phong gi") || normalizedInput.includes("con bao nhieu");
        const isAskingForRating = normalizedInput.includes("tot nhat") || normalizedInput.includes("danh gia cao") || normalizedInput.includes("sao");
        const isAskingForPrice = normalizedInput.includes("gia") || normalizedInput.includes("bao nhieu tien") || normalizedInput.includes("re nhat");
        const isAskingForImages = normalizedInput.includes("anh") || normalizedInput.includes("hinh") || normalizedInput.includes("xem");
        const isAskingForDetails = normalizedInput.includes("thong tin") || normalizedInput.includes("chi tiet") || normalizedInput.includes("gioi thieu");

        // Helper to find specific room type
        const roomKeywords = ["don", "doi", "vip", "couple", "double", "single", "family"];
        const matchedRoomKeyword = roomKeywords.find(k => normalizedInput.includes(k));

        // ─── EXECUTION BRANCHES ───────────────────────────────────────────────
        
        // Detailed Inquiry about a specific hotel
        if (matchedByName.length > 0 && (isAskingForDetails || normalizedInput.length < 30)) {
            const h = matchedByName[0];
            const roomInfo = h.rooms?.map(r => `• ${r.name}: ${formatCurrency(r.price)}/đêm (còn ${r.availableRooms ?? 10} phòng)`).join("\n") || "Chưa có thông tin phòng.";
            
            aiContent = `Thông tin chi tiết về ${h.name.toUpperCase()}:\n\n` +
                        `⭐ Đánh giá: ${h.rating}/5 (${h.reviews} lượt)\n` +
                        `📍 Địa chỉ: ${h.address}, ${h.location}\n\n` +
                        `🏠 Danh sách phòng đang có:\n${roomInfo}\n\n` +
                        `Bạn có muốn xem ảnh cụ thể của loại phòng nào không?`;
            foundHotels = [h];
        } 
        // Specific Room Availability Search
        else if (isAskingForRoomCount && matchedRoomKeyword) {
            let roomSearch: any[] = [];
            const searchScope = matchedByName.length > 0 ? matchedByName : hotels;
            searchScope.forEach(h => {
                h.rooms?.forEach(r => {
                    if (normalizeText(r.name).includes(matchedRoomKeyword)) {
                        roomSearch.push({ ...r, hotelName: h.name, hotelId: h.id });
                    }
                });
            });

            if (roomSearch.length > 0) {
                const results = roomSearch.map(r => `- ${r.hotelName}: còn ${r.availableRooms ?? 10} phòng ${r.name}`).join("\n");
                aiContent = `Thông tin về tình trạng ${matchedRoomKeyword.toUpperCase()} hiện tại:\n${results}\n\nBạn có muốn đặt ngay tại khách sạn nào không?`;
                aiMessageData = { type: 'room', items: roomSearch.slice(0, 2) };
            } else {
                aiContent = `Tôi hiện chưa tìm thấy thông tin phòng ${matchedRoomKeyword.toUpperCase()} nào đang trống.`;
            }
        } 
        // Image Inquiry
        else if (isAskingForImages) {
            const roomKeywords = ["don", "doi", "vip", "couple", "double", "single", "family"];
            const matchedKeyword = roomKeywords.find(k => normalizedInput.includes(k));
            const searchScope = matchedByName.length > 0 ? matchedByName : hotels;

            let matchedRooms: any[] = [];
            searchScope.forEach(h => {
                h.rooms?.forEach(r => {
                    if (normalizeText(r.name).includes(matchedKeyword || "") || matchedKeyword === undefined) {
                        matchedRooms.push({ ...r, hotelName: h.name, hotelId: h.id });
                    }
                });
            });

            if (matchedRooms.length > 0) {
                const room = matchedRooms[0];
                aiContent = matchedByName.length > 0 
                  ? `Đây là hình ảnh ${room.name} tại ${matchedByName[0].name} mà bạn yêu cầu:` 
                  : `Tôi tìm thấy một số ${matchedKeyword || 'phòng'} đẹp cho bạn. Đây là ảnh từ ${room.hotelName}:`;
                aiMessageData = { type: 'room', items: matchedRooms.slice(0, 2) };
            } else {
                aiContent = "Tôi chưa tìm thấy ảnh của loại phòng này trong hệ thống.";
                foundHotels = hotels.slice(0, 1);
            }
        }
        // General Ratings / Best Hotel
        else if (isAskingForRating) {
            const bestHotel = [...hotels].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
            if (bestHotel) {
                aiContent = `Khách sạn được đánh giá cao nhất hiện nay là ${bestHotel.name} với ${bestHotel.rating} sao. Đây là lựa chọn tuyệt vời cho kỳ nghỉ của bạn!`;
                foundHotels = [bestHotel];
            } else {
                aiContent = "Hiện tại tôi đang cập nhật đánh giá cho các khách sạn.";
            }
        } 
        // City Search
        else if (matchedCity) {
            foundHotels = hotels.filter(h => h.location && normalizeText(h.location).includes(normalizeText(matchedCity)));
            if (foundHotels.length > 0) {
                aiContent = `Tôi tìm thấy ${foundHotels.length} khách sạn tại ${matchedCity.toUpperCase()}. Dưới đây là những lựa chọn tốt nhất:`;
            } else {
                aiContent = `Rất tiếc, hiện tại tôi chưa có khách sạn nào ở ${matchedCity.toUpperCase()}.`;
            }
        } 
        // fallback / List Featured
        else if (normalizedInput.includes("khách sạn") || normalizedInput.includes("danh sách") || normalizedInput.includes("tất cả")) {
            foundHotels = hotels.slice(0, 3);
            aiContent = "Cybertron Hotel đang đề xuất những khách sạn tuyệt vời sau đây:";
        } else if (isAskingForPrice) {
            foundHotels = [...hotels].sort((a, b) => (a.price || 0) - (b.price || 0)).slice(0, 3);
            aiContent = "Tôi đã lọc ra những khách sạn có mức giá tốt nhất dành cho bạn:";
        } else {
            aiContent = "Tôi có thể giúp bạn tìm khách sạn, xem ảnh phòng, hoặc tư vấn về điểm đến. Bạn muốn biết thông tin gì ạ?";
        }

        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: aiContent,
            timestamp: new Date(),
            data: aiMessageData || (foundHotels.length > 0 ? foundHotels : undefined)
        };
        setMessages((prev) => [...prev, aiMessage]);
        setIsLoading(false);
    }, 1200);
  };

  const suggestions = [
    "Khách sạn tốt nhất?",
    "Hà Nội có bao nhiêu KS?",
    "Ảnh phòng Vip SBTC",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all z-50 group"
      >
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
      </button>
    );
  }

  return (
    <div 
      className={`fixed right-6 bottom-6 w-[380px] max-w-[calc(100vw-48px)] bg-card border border-border rounded-[24px] shadow-2xl z-50 flex flex-col transition-all duration-300 overflow-hidden ${
        isMinimized ? "h-[64px]" : "h-[600px] max-h-[calc(100vh-100px)]"
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-accent-500 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-none">Cybertron AI Assistant</h3>
            <span className="text-[10px] opacity-80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Đang trực tuyến
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 p-0 w-8 h-8 rounded-full"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/10 p-0 w-8 h-8 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    m.role === "user" ? "bg-accent-500 text-white" : "bg-card border border-border mt-1"
                  }`}>
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-accent-500" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                    m.role === "user" 
                      ? "bg-accent-500 text-white rounded-tr-none" 
                      : "bg-card border border-border text-foreground rounded-tl-none"
                  }`}>
                    {m.content}

                    {/* Room Cards / Images in Chat */}
                    {m.data?.type === 'room' && (
                      <div className="mt-3 grid grid-cols-1 gap-2">
                        {m.data.items.slice(0, 2).map((room: any, idx: number) => (
                          <div key={idx} className="bg-muted/50 rounded-xl overflow-hidden border border-border/50">
                            {room.imageUrls?.[0] && (
                              <div className="h-32 w-full">
                                <img 
                                  src={room.imageUrls[0].startsWith("http") ? room.imageUrls[0] : `http://localhost:8080${room.imageUrls[0]}`} 
                                  alt={room.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="p-2 space-y-1">
                               <div className="font-bold text-[10px]">{room.name}</div>
                               <div className="text-[9px] text-muted-foreground italic flex items-center gap-1">
                                  <Building2 className="w-2.5 h-2.5" /> {room.hotelName}
                               </div>
                               <Link href={`/hotel/${room.hotelId}`} className="text-[9px] font-bold text-accent-500 block mt-1">
                                 Xem phòng này →
                               </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Hotel Cards in Chat */}
                    {m.data && Array.isArray(m.data) && (
                      <div className="mt-3 space-y-2">
                        {m.data.map((hotel: Hotel) => (
                          <div key={hotel.id} className="bg-muted/50 rounded-xl overflow-hidden border border-border/50 group/item hover:bg-muted transition-all">
                             <div className="flex gap-2 p-2">
                               <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <img 
                                    src={hotel.image?.startsWith("http") ? hotel.image : `http://localhost:8080${hotel.image}`} 
                                    alt={hotel.name}
                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                  />
                               </div>
                               <div className="flex flex-col justify-between py-0.5">
                                 <div>
                                   <div className="font-bold text-[11px] line-clamp-1">{hotel.name}</div>
                                   <div className="flex items-center gap-1 text-[9px] text-muted-foreground italic">
                                      <MapPin className="w-2 h-2" /> {hotel.location}
                                   </div>
                                 </div>
                                 <Link 
                                   href={`/hotel/${hotel.id}`}
                                   className="text-[10px] font-bold text-accent-500 flex items-center gap-1 group/link"
                                 >
                                   Xem ngay <Building2 className="w-2.5 h-2.5 group-hover/link:translate-x-0.5 transition-transform" />
                                 </Link>
                               </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center">
                    <Bot className="w-4 h-4 text-accent-500" />
                  </div>
                  <div className="p-3 bg-card border border-border rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-accent-500" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length < 3 && !isLoading && (
            <div className="px-4 py-2 flex flex-wrap gap-2 bg-muted/10 border-t border-border/50">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  className="text-[10px] font-medium bg-card border border-border px-3 py-1.5 rounded-full hover:bg-accent-500 hover:text-white transition-all shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-card border-t border-border">
            <div className="relative flex items-center gap-2 bg-muted p-1.5 rounded-2xl border border-border focus-within:border-accent-500/50 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none border-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-accent-500 text-white rounded-xl flex items-center justify-center hover:bg-accent-600 disabled:opacity-30 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">
               <Sparkles className="w-3 h-3" /> Powered by Gemini AI
            </div>
          </div>
        </>
      )}
    </div>
  );
}
