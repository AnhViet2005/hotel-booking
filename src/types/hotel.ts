export interface Room {
  id: number | string;
  name: string;
  capacity: number;
  size: string;
  bedType: string;
  price: number;
  features: string[];
  imageUrls?: string[];
  description?: string;
  availableRooms?: number;
  nextAvailableDate?: string;
}

export interface Hotel {
  id: number | string;
  name: string;
  location: string;
  address: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  description: string;
  amenities: string[];
  rooms: Room[];
}

export interface Booking {
  id: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  price: number;
}
