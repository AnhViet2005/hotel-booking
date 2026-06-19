import { Hotel, Booking } from "@/types/hotel";

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "B-129381",
    hotelId: "h1",
    roomId: "r1-1",
    checkIn: "2026-05-10",
    checkOut: "2026-05-15",
    status: "Sắp tới",
    price: 22500000,
  },
  {
    id: "B-847291",
    hotelId: "h2",
    roomId: "r2-1",
    checkIn: "2025-12-01",
    checkOut: "2025-12-05",
    status: "Đã hoàn thành",
    price: 12800000,
  }
];

export const HOTELS: Hotel[] = [
  {
    id: "h1",
    name: "The Azure Resort & Spa",
    location: "Maldives",
    address: "Baa Atoll, Maldives",
    price: 4500000,
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
      "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1200&q=80"
    ],
    description: "Trải nghiệm sự sang trọng tột bậc tại The Azure Resort & Spa. Được bao quanh bởi làn nước trong vắt, các biệt thự trên mặt nước của chúng tôi mang đến tầm nhìn ngoạn mục và sự riêng tư vô song. Thưởng thức ẩm thực đẳng cấp thế giới, các liệu pháp spa trẻ hóa và các hoạt động dưới nước vô tận.",
    amenities: ["Free WiFi", "Infinity Pool", "Spa & Wellness", "Private Beach", "Fitness Center", "Airport Shuttle", "Restaurant", "Bar"],
    rooms: [
      {
        id: "r1-1",
        name: "Biệt thự hồ bơi hướng biển",
        capacity: 2,
        size: "150 m2",
        bedType: "King Bed",
        price: 4500000,
        features: ["Hồ bơi riêng", "Hướng biển", "Tiếp cận biển trực tiếp", "Dịch vụ quản gia"]
      },
      {
        id: "r1-2",
        name: "Khu vực Grand Water Pavilion",
        capacity: 4,
        size: "300 m2",
        bedType: "2 King Beds",
        price: 8500000,
        features: ["Hồ bơi vô cực riêng", "Hướng hoàng hôn", "Hai phòng ngủ", "Khu vực bếp"]
      }
    ]
  },
  {
    id: "h2",
    name: "Grand Plaza Hotel",
    location: "New York",
    address: "Đại lộ số 5, Manhattan, NY",
    price: 3200000,
    rating: 4.8,
    reviews: 342,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80"
    ],
    description: "Tọa lạc tại trung tâm Manhattan, Grand Plaza mang đến sự sang trọng vượt thời gian và sự thoải mái hiện đại. Chỉ cách Công viên Trung tâm và các điểm mua sắm hàng đầu vài bước chân, đây là cơ sở hoàn hảo cho hành trình khám phá thành phố của bạn.",
    amenities: ["Free WiFi", "City View", "Fitness Center", "Room Service", "Valet Parking", "Restaurant", "Business Center"],
    rooms: [
      {
        id: "r2-1",
        name: "Phòng Deluxe hướng thành phố",
        capacity: 2,
        size: "40 m2",
        bedType: "Queen Bed",
        price: 3200000,
        features: ["Hướng thành phố", "Phòng tắm đá cẩm thạch", "Mini bar"]
      },
      {
        id: "r2-2",
        name: "Phòng Executive Suite",
        capacity: 3,
        size: "75 m2",
        bedType: "1 King Bed, 1 Sofa Bed",
        price: 5500000,
        features: ["Khu vực phòng khách", "Tầng cao", "Sử dụng Lounge", "Bồn tắm"]
      }
    ]
  },
  {
    id: "h3",
    name: "Villa Serenity",
    location: "Bali",
    address: "Ubud, Bali, Indonesia",
    price: 2800000,
    rating: 4.9,
    reviews: 215,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80",
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80"
    ],
    description: "Tìm lại sự bình yên trong tâm hồn tại Villa Serenity, nép mình giữa khu rừng nhiệt đới tươi tốt và những ruộng bậc thang của Ubud. Một khu nghỉ dưỡng thân thiện với môi trường với hồ bơi riêng, ẩm thực hữu cơ và các lớp học yoga hàng ngày.",
    amenities: ["Free WiFi", "Private Pool", "Yoga Pavilion", "Organic Restaurant", "Spa", "Bicycle Rental", "Airport Shuttle"],
    rooms: [
      {
        id: "r3-1",
        name: "Phòng Jungle Villa",
        capacity: 2,
        size: "120 m2",
        bedType: "King Bed",
        price: 2800000,
        features: ["Hồ bơi riêng nhỏ", "Vòi sen ngoài trời", "Hướng rừng", "Bao gồm bữa sáng"]
      },
      {
        id: "r3-2",
        name: "Phòng Valley Suite",
        capacity: 2,
        size: "80 m2",
        bedType: "King Bed",
        price: 3500000,
        features: ["Tầm nhìn toàn cảnh thung lũng", "Ban công", "Massage miễn phí", "Bao gồm bữa sáng"]
      }
    ]
  },
  {
    id: "h4",
    name: "Santorini Cliff Retreat",
    location: "Santorini",
    address: "Oia, Santorini, Hy Lạp",
    price: 3900000,
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80",
      "https://images.unsplash.com/photo-1506509538350-93a0d5e1bca7?w=1200&q=80",
      "https://images.unsplash.com/photo-1510469176377-3e11765c7117?w=1200&q=80"
    ],
    description: "Được tạc vào những vách đá núi lửa ở Oia, khu nghỉ dưỡng của chúng tôi mang đến những tầm nhìn hoàng hôn mang tính biểu tượng nhất trên thế giới. Tận hưởng kiến trúc Cycladic tối giản, hồ bơi vô cực tuyệt đẹp và lòng hiếu khách chân thành kiểu Hy Lạp.",
    amenities: ["Free WiFi", "Infinity Pool", "Caldera View", "Restaurant", "Bar", "Room Service", "Concierge"],
    rooms: [
      {
        id: "r4-1",
        name: "Phòng Cave Suite",
        capacity: 2,
        size: "60 m2",
        bedType: "King Bed",
        price: 3900000,
        features: ["Hướng Caldera", "Sân hiên", "Kiến trúc hang động", "Hồ bơi riêng có sưởi"]
      },
      {
        id: "r4-2",
        name: "Biệt thự Honeymoon",
        capacity: 2,
        size: "100 m2",
        bedType: "King Bed",
        price: 6500000,
        features: ["Tầm nhìn hoàng hôn không bị che khuất", "Hồ bơi riêng rộng lớn", "Bồn sục Jacuzzi trong nhà", "Ăn tối riêng tư"]
      }
    ]
  },
  {
    id: "h5",
    name: "Eiffel View Boutique",
    location: "Paris",
    address: "Quận 7, Paris, Pháp",
    price: 2500000,
    rating: 4.6,
    reviews: 275,
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=1200&q=80",
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
      "https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=1200&q=80"
    ],
    description: "Một khách sạn boutique quyến rũ mang đến trải nghiệm đậm chất Paris. Các phòng của chúng tôi có tầm nhìn tuyệt đẹp ra Tháp Eiffel và được thiết kế thanh lịch để kết hợp giữa sự sang trọng cổ điển với sự thoải mái hiện đại.",
    amenities: ["Free WiFi", "Eiffel Tower View", "Bar", "Coffee Shop", "Room Service", "Airport Transfer"],
    rooms: [
      {
        id: "r5-1",
        name: "Phòng Classic",
        capacity: 2,
        size: "25 m2",
        bedType: "Double Bed",
        price: 2500000,
        features: ["Hướng sân trong", "Máy pha cà phê Nespresso", "Đồ vệ sinh cá nhân cao cấp"]
      },
      {
        id: "r5-2",
        name: "Phòng Eiffel Balcony Suite",
        capacity: 2,
        size: "45 m2",
        bedType: "King Bed",
        price: 4200000,
        features: ["Ban công hướng Tháp Eiffel", "Khu vực ngồi nghỉ", "Rượu Champagne chào mừng"]
      }
    ]
  }

];
