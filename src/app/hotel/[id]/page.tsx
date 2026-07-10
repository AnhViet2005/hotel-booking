"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { Star, MapPin, Check, Wifi, Coffee, Car, Dumbbell, Loader2, MessageSquare, ChevronLeft, ChevronRight, X, Image as ImageIcon, User, Info, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getPublicHotelById, getHotelReviews, HotelReview, updateReview, deleteReview, getUser } from "@/utils/api";
import { formatCurrency } from "@/utils/format";
import { Hotel } from "@/types/hotel";
import ChatWidget from "@/components/chat/ChatWidget";

export default function HotelDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const checkInParam = searchParams.get("checkIn");
  const checkOutParam = searchParams.get("checkOut");
  const adultsParam = searchParams.get("adults") || "2";
  const childrenParam = searchParams.get("children") || "0";
  const roomsParam = searchParams.get("rooms") || "1";

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState<Record<number, number>>({});
  const [reviews, setReviews] = useState<HotelReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [viewingRoom, setViewingRoom] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Edit Review State
  const [editingReview, setEditingReview] = useState<HotelReview | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    setCurrentUser(getUser());
  }, []);

  useEffect(() => {
    setLoading(true);
    getPublicHotelById(id, checkInParam || undefined, checkOutParam || undefined)
      .then(setHotel)
      .catch((err) => {
        console.error(err);
        setHotel(null);
      })
      .finally(() => setLoading(false));
  }, [id, checkInParam, checkOutParam]);

  const fetchReviews = () => {
    setReviewsLoading(true);
    getHotelReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-accent-500" />
      </div>
    );
  }

  if (!hotel) {
    notFound();
  }

  const handleBooking = (roomId?: number) => {
    const idToBook = roomId || Object.keys(selectedRooms)[0];
    if (!idToBook) {
      alert("Vui lòng chọn ít nhất một phòng.");
      return;
    }
    
    // If specific roomId provided, it's a single room booking
    if (roomId) {
        const qty = selectedRooms[roomId] || 1;
        window.location.href = `/checkout?hotelId=${hotel.id}&rooms=${roomId}:${qty}${checkInParam ? `&checkIn=${checkInParam}` : ''}${checkOutParam ? `&checkOut=${checkOutParam}` : ''}&adults=${adultsParam}&children=${childrenParam}`;
    } else {
        // Multi-room booking from the summary widget
        const selections = selectedRoomsList.map(s => `${s.room!.id}:${s.quantity}`).join(',');
        window.location.href = `/checkout?hotelId=${hotel.id}&rooms=${selections}${checkInParam ? `&checkIn=${checkInParam}` : ''}${checkOutParam ? `&checkOut=${checkOutParam}` : ''}&adults=${adultsParam}&children=${childrenParam}`;
    }
  };

  const getAmenityIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "free wifi": return <Wifi className="w-5 h-5" />;
      case "restaurant": return <Coffee className="w-5 h-5" />;
      case "fitness center": return <Dumbbell className="w-5 h-5" />;
      case "valet parking": return <Car className="w-5 h-5" />;
      default: return <Check className="w-5 h-5" />;
    }
  };

  const formatDate = (dateStr: string | null, isCheckIn: boolean) => {
    if (!dateStr) return isCheckIn ? "Hôm nay" : "Ngày mai";
    try {
      const date = new Date(dateStr);
      return `${date.getDate()} thg ${date.getMonth() + 1}`;
    } catch {
      return isCheckIn ? "Hôm nay" : "Ngày mai";
    }
  };

  const getNights = () => {
    if (!checkInParam || !checkOutParam) return 1;
    const diff = new Date(checkOutParam).getTime() - new Date(checkInParam).getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const updateRoomQuantity = (roomId: number, quantity: number) => {
    setSelectedRooms(prev => {
        const room = hotel?.rooms?.find(r => r.id === roomId);
        const available = room?.availableRooms ?? 10;
        
        const next = Math.max(0, quantity);
        if (next > available) return prev;

        const newSelections = { ...prev };
        if (next === 0) delete newSelections[roomId];
        else newSelections[roomId] = next;
        return newSelections;
    });
  };

  const getSelectedRoomsList = () => {
    if (!hotel || !hotel.rooms) return [];
    return Object.entries(selectedRooms).map(([id, qty]) => {
        const room = hotel.rooms?.find(r => r.id === Number(id));
        return { room, quantity: qty };
    }).filter(item => item.room !== undefined);
  };

  const nights = getNights();
  const roomCount = parseInt(roomsParam);
  const selectedRoomsList = getSelectedRoomsList();
  const subtotal = selectedRoomsList.reduce((sum, item) => sum + (item.room!.price * item.quantity), 0) * nights;
  const tax = 100000;
  const totalPrice = subtotal + tax;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewingRoom?.imageUrls) {
      setCurrentImageIndex((prev) => (prev + 1) % viewingRoom.imageUrls.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewingRoom?.imageUrls) {
      setCurrentImageIndex((prev) => (prev - 1 + viewingRoom.imageUrls.length) % viewingRoom.imageUrls.length);
    }
  };

  // Prepare showcase gallery: 1 big hotel image + all room types
  const hotelMainItem = { 
    url: hotel.image || (hotel.gallery && hotel.gallery[0]), 
    room: undefined, 
    type: 'hotel' 
  };

  const roomItems = (hotel.rooms || [])
    .map(r => ({ url: r.imageUrls?.[0], room: r, type: 'room' }))
    .filter(item => !!item.url);
    
  const otherGalleryItems = (hotel.gallery || [])
    .filter(img => img !== hotelMainItem.url)
    .map(img => ({ url: img, room: undefined, type: 'gallery' }));

  // Final list of items for the top grid
  const galleryItems: any[] = [hotelMainItem];
  const seenUrls = new Set([hotelMainItem.url]);

  // Add rooms first
  for (const item of roomItems) {
    if (galleryItems.length >= 5) break; // Limit to 5 for a clean mosaic
    galleryItems.push(item);
    if (item.url) seenUrls.add(item.url);
  }

  // Fill remaining slots with gallery images
  for (const item of otherGalleryItems) {
    if (galleryItems.length >= 5) break;
    if (!seenUrls.has(item.url)) {
      galleryItems.push(item);
      seenUrls.add(item.url);
    }
  }

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://hotel-backend-production-222c.up.railway.app";
  const getImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    // Đảm bảo luôn trỏ về Railway backend, không bao giờ về Vercel
    const base = BACKEND_URL.replace(/\/api$/, "");
    return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="bg-background min-h-screen pt-20 transition-colors">
      {/* Header & Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {hotel.address}
              </span>
              <span className="flex items-center gap-1 text-foreground font-medium bg-muted px-2 rounded-full text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {hotel.rating} ({hotel.reviews} đánh giá)
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Gallery Grid (Mosaic) */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[60vh] md:h-[75vh] rounded-[40px] overflow-hidden mb-12 shadow-2xl relative">
          {galleryItems.length > 0 ? (
            <>
              {/* Hotel Main Image - Adjusts size based on count */}
              <div className={`relative cursor-pointer group overflow-hidden shadow-inner ${
                galleryItems.length === 1 ? 'col-span-4 row-span-2' : 
                galleryItems.length === 2 ? 'col-span-2 row-span-2' :
                'col-span-2 row-span-2'
              }`}>
                <img 
                  src={getImageUrl(galleryItems[0].url)} 
                  alt="Hotel Main" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 ease-out" 
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-6 left-6 z-10">
                  <span className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white border border-white/20 uppercase tracking-widest">
                    Ảnh khách sạn
                  </span>
                </div>
              </div>

              {/* Dynamic Slots for Rooms/Gallery */}
              {galleryItems.slice(1).map((item, idx) => {
                let gridClass = "";
                // Logic for 4 items total (1 big, 3 small)
                if (galleryItems.length === 4) {
                   if (idx === 0) gridClass = "col-span-2 row-span-1";
                   else gridClass = "col-span-1 row-span-1";
                } 
                // Logic for 5 items total (1 big, 4 small)
                else if (galleryItems.length === 5) {
                   gridClass = "col-span-1 row-span-1";
                }
                // Logic for 2 items
                else if (galleryItems.length === 2) {
                   gridClass = "col-span-2 row-span-2";
                }
                // Logic for 3 items
                else if (galleryItems.length === 3) {
                   gridClass = "col-span-2 row-span-1";
                }

                return (
                  <div 
                    key={idx} 
                    className={`${gridClass} relative cursor-pointer group overflow-hidden border-2 border-transparent hover:border-accent-500 transition-all shadow-md`}
                    onClick={() => {
                        if (item.room) {
                          setViewingRoom(item.room);
                          setCurrentImageIndex(0);
                        }
                    }}
                  >
                    <img 
                      src={getImageUrl(item.url)} 
                      alt={item.room?.name || "Gallery image"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 text-center">
                       <span className="bg-accent-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-xl border border-white/20 whitespace-nowrap">
                         Xem chi tiết {item.room ? item.room.name : "phòng"}
                       </span>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
             <div className="col-span-4 row-span-2 bg-muted flex items-center justify-center h-full">
                <ImageIcon className="w-12 h-12 text-muted-foreground/30 animate-pulse" />
             </div>
          )}
          
          {/* Total Photos Badge */}
          <button className="absolute bottom-8 right-8 bg-white dark:bg-zinc-900 border border-border text-foreground px-6 py-3 rounded-2xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2 z-20 group">
             <Star className="w-4 h-4 text-accent-500" />
             Xem tất cả {hotel.gallery?.length || 0} ảnh
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <div className="flex-1">
            <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Về chỗ nghỉ này</h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-10">{hotel.description}</p>

            <h2 className="font-heading text-2xl font-bold mb-4 text-foreground">Tiện nghi phổ biến</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {hotel.amenities?.map(amenity => (
                <div key={amenity} className="flex items-center gap-3 text-muted-foreground font-medium">
                  <div className="p-2 bg-card rounded-full text-foreground shadow-sm border border-border">
                    {getAmenityIcon(amenity)}
                  </div>
                  {amenity === "Free WiFi" ? "WiFi miễn phí" : 
                   amenity === "Swimming Pool" ? "Hồ bơi" : 
                   amenity === "Spa" ? "Spa" : 
                   amenity === "Fitness Center" ? "Phòng Gym" : 
                   amenity === "Restaurant" ? "Nhà hàng" : 
                   amenity === "Ocean View" ? "View biển" : 
                   amenity === "City View" ? "View thành phố" : amenity}
                </div>
              ))}
            </div>

            {/* Rooms */}
            <h2 className="font-heading text-2xl font-bold mb-6 text-foreground">Chọn phòng của bạn</h2>
            <div className="space-y-8">
              {hotel.rooms?.map(room => {
                const isSoldOut = room.availableRooms !== undefined && room.availableRooms <= 0;
                const quantity = selectedRooms[room.id as number] || 0;
                
                return (
                <div 
                  key={room.id}
                  className={`bg-white dark:bg-zinc-900 rounded-xl border border-blue-100 dark:border-zinc-800 overflow-hidden shadow-sm transition-all duration-300 ${isSoldOut ? 'opacity-60 grayscale-[30%]' : 'hover:shadow-md'}`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px]">
                    {/* Left Column: Room Info & Image */}
                    <div className="p-5 border-r border-blue-50 dark:border-zinc-800">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden group mb-4">
                        {room.imageUrls && room.imageUrls.length > 0 ? (
                           <img 
                              src={getImageUrl(room.imageUrls[0])} 
                              alt={room.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           />
                        ) : (
                          <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-zinc-400" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                           1/{room.imageUrls?.length || 1}
                        </div>
                        {isSoldOut && (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
                            <span className="bg-destructive text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg mb-2">Hết phòng</span>
                            {room.nextAvailableDate && (
                              <div className="bg-white/90 backdrop-blur-sm text-zinc-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                                Trống trở lại: {new Date(room.nextAvailableDate).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <button 
                        onClick={() => { setViewingRoom(room); setCurrentImageIndex(0); }}
                        className="text-blue-600 dark:text-blue-400 text-xs font-semibold mb-3 flex items-center gap-1 hover:underline"
                      >
                        Xem ảnh và chi tiết
                      </button>
                      
                      <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-100 mb-1 leading-tight">{room.name}</h3>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                        <p>Tối đa {room.capacity} người lớn, {Math.floor(room.capacity/2)} trẻ em</p>
                        <p>{room.bedType === "King Bed" ? "1 giường King" : room.bedType === "Queen Bed" ? "1 giường Queen" : room.bedType}</p>
                      </div>
                      
                      {!isSoldOut && room.availableRooms !== undefined && room.availableRooms <= 5 && (
                        <div className="mt-4 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-1 rounded inline-block">
                           {room.availableRooms} phòng cuối cùng của chúng tôi!
                        </div>
                      )}
                    </div>

                    {/* Middle Column: Features/Policies */}
                    <div className="flex flex-col">
                      <div className="bg-[#B92D27] text-white px-4 py-1.5 font-bold text-xs">
                        Giá thấp nhất!
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <ul className="space-y-3">
                          <li className="flex items-start gap-2.5 text-sm">
                            <User className="w-4 h-4 mt-0.5 text-zinc-700 dark:text-zinc-300" />
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                               {room.capacity} người lớn & {Math.floor(room.capacity/2)} trẻ em (0-11 tuổi) <Info className="w-3 h-3 inline ml-1 opacity-60" />
                            </span>
                          </li>
                          <li className="flex items-start gap-2.5 text-sm">
                            <Star className="w-4 h-4 mt-0.5 text-green-600 fill-green-600" />
                            <span className="font-bold text-green-600 dark:text-green-500">Con của quý khách được ở MIỄN PHÍ!</span>
                          </li>
                          <li className="flex items-start gap-2.5 text-sm">
                            <Coffee className="w-4 h-4 mt-0.5 text-zinc-700 dark:text-zinc-300" />
                            <span className="text-zinc-700 dark:text-zinc-300">Có bữa sáng rất ngon (630.000 ₫ / người) <Info className="w-3 h-3 inline ml-1 opacity-60" /></span>
                          </li>
                          <li className="flex items-start gap-2.5 text-sm">
                            <Check className="w-4 h-4 mt-0.5 text-zinc-600" />
                            <span className="text-zinc-700 dark:text-zinc-300">Không hoàn tiền (Giá thấp!) <Info className="w-3 h-3 inline ml-1 opacity-60" /></span>
                          </li>
                          <li className="flex items-start gap-2.5 text-sm">
                            <Check className="w-4 h-4 mt-0.5 text-zinc-600" />
                            <span className="text-zinc-700 dark:text-zinc-300">Đặt và trả tiền ngay</span>
                          </li>
                          {room.features?.slice(0, 3).map(f => (
                            <li key={f} className="flex items-start gap-2.5 text-sm">
                              <Check className="w-4 h-4 mt-0.5 text-zinc-600" />
                              <span className="text-zinc-700 dark:text-zinc-300">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={() => { setViewingRoom(room); setCurrentImageIndex(0); }}
                          className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-bold text-left hover:underline"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Pricing & Selection */}
                    <div className="bg-zinc-50/50 dark:bg-zinc-800/30 p-5 flex flex-col justify-between border-l border-blue-50 dark:border-zinc-800">
                      <div className="text-right">
                        <del className="text-zinc-400 text-xs font-medium">{formatCurrency(room.price * 1.15)}</del>
                        <div className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 leading-tight">
                           Giá sau Thưởng Hoàn tiền mặt
                        </div>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-[#E7F7EF] dark:bg-green-900/30 text-[#008234] dark:text-green-400 text-[11px] font-bold px-2 py-1 rounded">
                           <Check className="w-3 h-3" /> Đã áp dụng {formatCurrency(room.price * 0.05)}
                        </div>
                        <div className="mt-2">
                           <span className="text-3xl font-bold text-zinc-900 dark:text-white">{formatCurrency(room.price)}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">Mỗi đêm, trước thuế và phí</div>
                      </div>

                      {!isSoldOut ? (
                        <div className="mt-6 space-y-3">
                          <div className="relative group">
                            <select 
                              value={quantity}
                              onChange={(e) => updateRoomQuantity(room.id as number, parseInt(e.target.value))}
                              className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg py-3 px-4 pr-10 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                              {[...Array(Math.min(11, (room.availableRooms || 10) + 1))].map((_, i) => (
                                <option key={i} value={i}>{i === 0 ? "Số lượng phòng" : `${i} phòng`}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                          </div>

                          <Button 
                            disabled={quantity === 0}
                            onClick={() => handleBooking(room.id as number)}
                            className="w-full bg-[#006CE4] hover:bg-[#0057B8] text-white h-12 rounded-lg text-base font-bold shadow-md transition-all active:scale-[0.98]"
                          >
                            Đặt
                          </Button>
                          
                          <div className="text-[11px] text-center text-orange-600 dark:text-orange-400 font-bold">
                            Chỉ chừng 2 phút thôi!
                          </div>
                          
                          {room.availableRooms !== undefined && room.availableRooms <= 5 && (
                             <div className="text-[10px] text-center text-[#B92D27] font-bold">
                                {room.availableRooms} phòng cuối cùng của chúng tôi!
                             </div>
                          )}

                          <div className="flex items-center gap-2 pt-2 group cursor-pointer">
                             <div className="w-5 h-5 rounded border border-zinc-300 dark:border-zinc-700 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                <Check className="w-3 h-3 text-transparent group-hover:text-zinc-300" />
                             </div>
                             <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                                Tôi muốn phòng thông nhau hoặc phòng liền kề
                             </span>
                             <Info className="w-3 h-3 text-zinc-400 ml-auto" />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-dashed border-border text-center">
                           <p className="text-xs font-bold text-muted-foreground mb-1">Hiện tại không còn phòng trống</p>
                           {room.nextAvailableDate && (
                             <p className="text-sm font-bold text-accent-600">
                               Quay lại vào {new Date(room.nextAvailableDate).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                             </p>
                           )}
                           <button className="mt-3 text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-wider">
                              Xem các ngày khác
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {/* Reviews Section */}
            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-accent-500" />
                Đánh giá của khách hàng
                {reviews.length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {reviews.length} đánh giá
                  </span>
                )}
              </h2>

              {reviewsLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-muted rounded-3xl p-10 text-center">
                  <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground font-medium">Chưa có đánh giá nào</p>
                  <p className="text-sm text-muted-foreground mt-1">Hãy là người đầu tiên đánh giá khách sạn này!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const isOwner = currentUser && review.userEmail === currentUser.email;
                    
                    return (
                    <div key={review.id} className="bg-card rounded-2xl border border-border p-6 hover:border-accent-500/30 transition-colors relative group/review">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          {review.userAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getImageUrl(review.userAvatar)}
                              alt={review.userName}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-border"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-accent-500/10 flex items-center justify-center font-bold text-accent-500 text-sm flex-shrink-0">
                              {review.userName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-card-foreground">{review.userName || "Khách ẩn danh"}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                                day: "2-digit", month: "2-digit", year: "numeric"
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex gap-0.5 flex-shrink-0">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"}`}
                              />
                            ))}
                          </div>
                          
                          {/* User Actions */}
                          {isOwner && (
                            <div className="flex items-center gap-2 opacity-0 group-hover/review:opacity-100 transition-opacity">
                              <button 
                                onClick={() => {
                                  setEditingReview(review);
                                  setEditRating(review.rating);
                                  setEditComment(review.comment);
                                }}
                                className="p-1.5 rounded-lg hover:bg-accent-50 text-accent-600 transition-colors"
                                title="Sửa đánh giá"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={async () => {
                                  if (confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
                                    try {
                                      await deleteReview(review.id);
                                      fetchReviews();
                                    } catch (err: any) {
                                      alert(err.message || "Xóa thất bại");
                                    }
                                  }
                                }}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                title="Xóa đánh giá"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-muted-foreground text-sm leading-relaxed italic mb-3">
                          "{review.comment}"
                        </p>
                      )}
                      {/* Admin reply */}
                      {review.adminReply && (
                        <div className="mt-3 ml-4 border-l-2 border-accent-500/40 pl-4 bg-accent-50/50 dark:bg-accent-950/10 rounded-r-xl py-2">
                          <p className="text-xs font-bold text-accent-600 mb-1">Phản hồi từ khách sạn:</p>
                          <p className="text-sm text-foreground">{review.adminReply}</p>
                        </div>
                      )}
                    </div>
                  )})}
                </div>
              ) 
            }
            </div>
          </div>

          {/* Booking Widget */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-card rounded-[32px] p-8 border border-border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] sticky top-28">
              <h3 className="font-heading text-xl font-bold text-card-foreground mb-8 pb-4 border-b border-border">Tóm tắt đặt phòng</h3>
              
              <div className="space-y-4 mb-8">
                <div className="p-5 bg-muted rounded-2xl flex justify-between items-center border border-transparent hover:border-accent-500/20 transition-all">
                  <div className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Nhận phòng</div>
                  <div className="font-bold text-card-foreground">{formatDate(checkInParam, true)}</div>
                </div>
                <div className="p-5 bg-muted rounded-2xl flex justify-between items-center border border-transparent hover:border-accent-500/20 transition-all">
                  <div className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Trả phòng</div>
                  <div className="font-bold text-card-foreground">{formatDate(checkOutParam, false)}</div>
                </div>
                {roomCount > 1 && (
                  <div className="p-5 bg-accent-50/50 dark:bg-accent-950/20 rounded-2xl flex justify-between items-center border border-accent-100 dark:border-accent-900/50">
                    <div className="font-bold text-xs uppercase tracking-widest text-accent-600">Số lượng phòng</div>
                    <div className="font-bold text-accent-700 dark:text-accent-400">{roomCount} phòng</div>
                  </div>
                )}
              </div>

            <div className="space-y-4 mb-6">
              {selectedRoomsList.length > 0 ? (
                selectedRoomsList.map(({ room, quantity }) => (
                  <div key={room!.id} className="flex justify-between items-center bg-muted/30 p-3 rounded-xl border border-border/50">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{room!.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{quantity} phòng</span>
                    </div>
                    <span className="font-bold text-accent-600">{formatCurrency(room!.price * quantity)}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 bg-muted/20 rounded-2xl border-2 border-dashed border-border mb-6">
                  <p className="text-sm text-muted-foreground font-medium">Vui lòng chọn loại phòng</p>
                </div>
              )}
            </div>

            {selectedRoomsList.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Tạm tính (x{nights} đêm)</span>
                  <span className="font-bold text-card-foreground">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Thuế & Phí</span>
                  <span className="font-bold text-card-foreground">{formatCurrency(tax)}</span>
                </div>
                <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
                  <span className="font-bold text-card-foreground">Tổng cộng</span>
                  <span className="text-3xl font-heading font-bold text-accent-500">{formatCurrency(totalPrice)}</span>
                </div>
                <Button 
                  className="w-full mt-6 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-accent-500/20 bg-[#006CE4] hover:bg-[#0057B8]"
                  onClick={() => handleBooking()}
                >
                  Tiến hành thanh toán
                </Button>
              </div>
            ) : null}
              <p className="text-center text-sm text-muted-foreground mt-6 font-medium">Bạn sẽ chưa bị trừ tiền ngay lúc này</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      {currentUser && hotel.ownerId && (
        <ChatWidget 
          receiverId={hotel.ownerId}
          receiverName={hotel.ownerName || hotel.name}
          currentUserId={currentUser.id || 0}
          currentUserEmail={currentUser.email}
        />
      )}

      {/* Room Detail Modal */}
      {viewingRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingRoom(null)} />
          <div className="bg-background w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setViewingRoom(null)}
              className="absolute top-6 right-6 z-10 bg-black/5 hover:bg-black/10 p-2 rounded-full backdrop-blur-md transition-all hover:rotate-90 duration-300"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Image Gallery */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-muted group">
                {viewingRoom.imageUrls && viewingRoom.imageUrls.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={getImageUrl(viewingRoom.imageUrls[currentImageIndex])} 
                      alt={viewingRoom.name}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    {viewingRoom.imageUrls.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white transition-colors shadow-lg backdrop-blur-sm group/nav"
                        >
                          <ChevronLeft className="w-5 h-5 text-accent-600" />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white transition-colors shadow-lg backdrop-blur-sm group/nav"
                        >
                          <ChevronRight className="w-5 h-5 text-accent-600" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {viewingRoom.imageUrls.map((_: any, i: number) => (
                            <div 
                              key={i} 
                              className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-4 bg-white' : 'bg-white/50'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground italic">Không có ảnh phòng</p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-8 md:p-10 overflow-y-auto">
                <div className="mb-6">
                   <h3 className="font-heading text-3xl font-bold text-foreground mb-2">{viewingRoom.name}</h3>
                   <div className="flex flex-wrap gap-3 text-sm">
                      <span className="bg-muted px-3 py-1 rounded-full font-medium">Sức chứa: {viewingRoom.capacity} khách</span>
                      <span className="bg-muted px-3 py-1 rounded-full font-medium">Diện tích: {viewingRoom.size}</span>
                      <span className="bg-muted px-3 py-1 rounded-full font-medium">{viewingRoom.bedType === "King Bed" ? "Giường King" : viewingRoom.bedType}</span>
                   </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Mô tả phòng</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {viewingRoom.description || "Chưa có mô tả chi tiết cho loại phòng này. Phòng được thiết kế hiện đại, đầy đủ tiện nghi đảm bảo mang lại sự thoải mái nhất cho khách lưu trú."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-foreground mb-2">Tiện ích trong phòng</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {viewingRoom.features?.map((f: string) => (
                        <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-accent-500" /> {f}
                        </div>
                      ))}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent-500" /> Máy lạnh
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent-500" /> TV màn hình phẳng
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-accent-500" /> Minibar
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Giá từ</div>
                      <div className="text-3xl font-heading font-bold text-foreground">{formatCurrency(viewingRoom.price)}</div>
                    </div>
                      <Button 
                        className="px-8 rounded-xl h-12 font-bold"
                        onClick={() => {
                          updateRoomQuantity(viewingRoom.id, 1);
                          setViewingRoom(null);
                        }}
                      >
                        Chọn phòng này
                      </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingReview(null)} />
          <div className="bg-background w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl relative p-8">
            <h3 className="font-heading text-2xl font-bold mb-2">Chỉnh sửa đánh giá</h3>
            <p className="text-sm text-muted-foreground mb-6">Bạn có thể thay đổi điểm xếp hạng và nhận xét bên dưới.</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3">Điểm xếp hạng</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setEditRating(s)}
                      className="transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-8 h-8 ${s <= editRating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3">Nhận xét của bạn</label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về nơi này..."
                  className="w-full bg-muted border-none rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-accent-500 outline-none text-sm leading-relaxed"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 rounded-xl font-bold"
                  onClick={() => setEditingReview(null)}
                >
                  Hủy
                </Button>
                <Button 
                  className="flex-1 h-12 rounded-xl font-bold bg-accent-500 hover:bg-accent-600 text-white"
                  onClick={async () => {
                    setEditLoading(true);
                    try {
                      await updateReview(editingReview.id, { rating: editRating, comment: editComment });
                      setEditingReview(null);
                      fetchReviews();
                    } catch (err: any) {
                      alert(err.message || "Cập nhật thất bại");
                    } finally {
                      setEditLoading(false);
                    }
                  }}
                  disabled={editLoading}
                >
                  {editLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
