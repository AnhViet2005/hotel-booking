"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { Star, MapPin, Check, Wifi, Coffee, Car, Dumbbell, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";
import { getPublicHotelById, getHotelReviews, HotelReview } from "@/utils/api";
import { Hotel } from "@/types/hotel";

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
  const [selectedRoomId, setSelectedRoomId] = useState<string | number | null>(null);
  const [reviews, setReviews] = useState<HotelReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [viewingRoom, setViewingRoom] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    getPublicHotelById(id)
      .then(setHotel)
      .catch((err) => {
        console.error(err);
        setHotel(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setReviewsLoading(true);
    getHotelReviews(id)
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
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

  const handleBooking = () => {
    if (!selectedRoomId) {
      alert("Please select a room first.");
      return;
    }
    window.location.href = `/checkout?hotelId=${hotel.id}&roomId=${selectedRoomId}`;
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

  const nights = getNights();
  const roomCount = parseInt(roomsParam);
  const selectedRoom = hotel?.rooms?.find(r => r.id === selectedRoomId);
  const roomPrice = (selectedRoom?.price || 0) * nights * roomCount;
  const tax = 100000;
  const totalPrice = roomPrice + tax;

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

        {/* Gallery Grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[50vh] md:h-[60vh] rounded-3xl overflow-hidden mb-12">
          {hotel.gallery && hotel.gallery.length > 0 ? (
            <>
              <div className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer group shadow-2xl">
                {hotel.gallery[0].startsWith("http") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={hotel.gallery[0]} alt="Main" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <Image src={hotel.gallery[0]} alt="Main" fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
                )}
              </div>
              {hotel.gallery.slice(1, 4).map((img, idx) => (
                <div key={idx} className={`relative cursor-pointer group hidden md:block ${idx === 2 && hotel.gallery.length < 4 ? 'col-span-2' : ''} shadow-xl`}>
                  {img.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                </div>
              ))}
            </>
          ) : (
             <div className="col-span-4 row-span-2 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">No images available</p>
             </div>
          )}
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
            <div className="space-y-6">
              {hotel.rooms?.map(room => {
                const isSoldOut = room.availableRooms !== undefined && room.availableRooms <= 0;
                
                return (
                <div 
                  key={room.id}
                  className={`bg-card rounded-2xl p-6 border-2 transition-all ${isSoldOut ? 'opacity-60 cursor-not-allowed border-border grayscale-[30%]' : 'cursor-pointer hover:border-accent-500/30'} ${!isSoldOut && selectedRoomId === room.id ? 'border-accent-500 shadow-lg shadow-accent-500/10' : ''}`}
                  onClick={() => { if (!isSoldOut) setSelectedRoomId(room.id) }}
                >
                  <div className="flex flex-col md:flex-row justify-between lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-heading text-xl font-bold text-card-foreground">{room.name}</h3>
                        {isSoldOut && (
                          <div className="flex flex-col items-start gap-1">
                             <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded-md">
                              Hết phòng
                            </span>
                            {room.nextAvailableDate && (
                              <span className="text-[10px] text-muted-foreground font-medium">
                                Sẵn sàng từ: {new Date(room.nextAvailableDate).toLocaleDateString("vi-VN")}
                              </span>
                            )}
                          </div>
                        )}
                        {!isSoldOut && room.availableRooms !== undefined && room.availableRooms <= 3 && (
                          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-md">
                            Chỉ còn {room.availableRooms} phòng
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                        <span className="bg-muted px-3 py-1 rounded-full">Tối đa {room.capacity} khách</span>
                        <span className="bg-muted px-3 py-1 rounded-full">{room.size}</span>
                        <span className="bg-muted px-3 py-1 rounded-full">{room.bedType === "King Bed" ? "Giường King" : room.bedType === "Queen Bed" ? "Giường Queen" : room.bedType}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {room.features?.map(f => (
                          <span key={f} className="text-xs font-medium text-accent-700 bg-accent-50 px-2 py-1 rounded-md flex items-center gap-1">
                            <Check className="w-3 h-3" /> {f}
                          </span>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-accent-600 font-bold p-0 h-auto hover:bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingRoom(room);
                          setCurrentImageIndex(0);
                        }}
                      >
                        Xem chi tiết & ảnh phòng
                      </Button>
                    </div>
                    <div className="text-left md:text-right flex flex-col justify-end">
                      <div className="text-sm text-muted-foreground font-medium mb-1">Giá mỗi đêm</div>
                      <div className="font-heading text-3xl font-bold text-card-foreground mb-4">{formatCurrency(room.price)}</div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center self-start md:self-end ${!isSoldOut && selectedRoomId === room.id ? 'border-accent-500 bg-accent-500 shadow-md shadow-accent-500/20' : 'border-border'}`}>
                        {!isSoldOut && selectedRoomId === room.id && <Check className="w-4 h-4 text-white" />}
                      </div>
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
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-card rounded-2xl border border-border p-6 hover:border-accent-500/30 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          {review.userAvatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={review.userAvatar.startsWith("http") ? review.userAvatar : `http://localhost:8080${review.userAvatar}`}
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
                        <div className="flex gap-0.5 flex-shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground/30"}`}
                            />
                          ))}
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
                  ))}
                </div>
              )}
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

              {selectedRoomId ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>{selectedRoom?.name}</span>
                    <span className="font-bold text-card-foreground">
                      {formatCurrency(selectedRoom?.price || 0)} × {roomCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Thời gian</span>
                    <span className="font-bold text-card-foreground">{nights} đêm</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground font-medium">
                    <span>Thuế & Phí</span>
                    <span className="font-bold text-card-foreground">{formatCurrency(tax)}</span>
                  </div>
                  <div className="pt-6 mt-6 border-t border-border flex justify-between items-center">
                    <span className="font-bold text-card-foreground">Tổng cộng</span>
                    <span className="text-3xl font-heading font-bold text-accent-500">{formatCurrency(totalPrice)}</span>
                  </div>
                  <Link 
                    href={`/checkout?hotelId=${hotel.id}&roomId=${selectedRoomId}${checkInParam ? `&checkIn=${checkInParam}` : ''}${checkOutParam ? `&checkOut=${checkOutParam}` : ''}&adults=${adultsParam}&children=${childrenParam}&rooms=${roomsParam}`} 
                    className="block"
                  >
                    <Button className="w-full mt-6 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-accent-500/20">Tiến hành thanh toán</Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-2xl border-2 border-dashed border-border">
                  Chọn một phòng để xem giá
                </div>
              )}
              <p className="text-center text-sm text-muted-foreground mt-6 font-medium">Bạn sẽ chưa bị trừ tiền ngay lúc này</p>
            </div>
          </div>
        </div>
      </div>

      {/* Room Detail Modal */}
      {viewingRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingRoom(null)} />
          <div className="bg-background w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setViewingRoom(null)}
              className="absolute top-6 right-6 z-10 bg-black/10 hover:bg-black/20 p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <Check className="w-6 h-6 text-foreground rotate-45" />
            </button>

            <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
              {/* Image Gallery */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-muted group">
                {viewingRoom.imageUrls && viewingRoom.imageUrls.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={viewingRoom.imageUrls[currentImageIndex]} 
                      alt={viewingRoom.name}
                      className="w-full h-full object-cover transition-all duration-500"
                    />
                    {viewingRoom.imageUrls.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white transition-colors"
                        >
                          <Loader2 className="w-5 h-5 rotate-180" />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white transition-colors"
                        >
                          <Loader2 className="w-5 h-5" />
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
                        setSelectedRoomId(viewingRoom.id);
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
    </div>
  );
}
