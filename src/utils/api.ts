const API_BASE_URL = "http://localhost:8080/api";

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  hotelName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message || body?.error || "Đăng ký thất bại. Email có thể đã được sử dụng.";
    throw new Error(message);
  }

  return res.json();
}

export async function registerOwner(data: RegisterRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/register-owner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message || body?.error || "Đăng ký thất bại. Email có thể đã được sử dụng.";
    throw new Error(message);
  }

  return res.json();
}

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message || body?.error || "Đã có lỗi xảy ra. Vui lòng thử lại.";
    throw new Error(message);
  }

  return res.json();
}

export function saveAuth(data: AuthResponse) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify({ 
    email: data.email, 
    fullName: data.fullName, 
    role: data.role,
    phone: data.phone 
  }));
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function getUser(): { email: string; fullName: string; role: string; phone: string } | null {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// ─── User APIs (authenticated) ────────────────────────────────────────────────
async function authFetch(path: string, options?: RequestInit) {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      logout();
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    const text = await res.text().catch(() => null);
    if (text) {
      try {
        const body = JSON.parse(text);
        throw new Error(body?.message || body?.error || `HTTP ${res.status}`);
      } catch {
        throw new Error(text || `HTTP ${res.status}`);
      }
    }
    throw new Error(`HTTP ${res.status}`);
  }
  
  if (res.status === 204) return null;
  
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export async function getMyBookings(): Promise<UserBooking[]> {
  return authFetch("/user/bookings");
}

export async function getMyProfile(): Promise<UserProfile> {
  return authFetch("/user/profile");
}

export async function updateSettings(data: FormData): Promise<any> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/user/settings`, {
    method: "PUT",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: data,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.message || body?.error || "Cập nhật thất bại.";
    throw new Error(message);
  }

  return res.json();
}

export interface BookingRequest {
  hotelId: number;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  quantity?: number;
}

export async function createBooking(data: BookingRequest): Promise<number> {
  return authFetch("/user/bookings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function confirmBooking(id: number): Promise<void> {
  return authFetch(`/user/bookings/${id}/confirm`, {
    method: "PATCH",
  });
}

export interface UserBooking {
  id: number;
  bookingCode: string;
  hotelId: number;
  hotelName: string;
  hotelImage: string | null;
  hotelCity: string | null;
  roomTypeName: string | null;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  depositAmount: number;
  remainingAmount: number;
  status: string;
  remainingPaymentStatus: string;
  remainingPaymentMethod?: string | null;
  createdAt: string;
  hasReview?: boolean;
  reviewRating?: number;
  reviewComment?: string;
}

export async function createReview(data: { bookingId: number; rating: number; comment?: string }): Promise<any> {
  return authFetch("/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function payRemainingBooking(id: number, method = "CASH"): Promise<UserBooking> {
  return authFetch(`/user/bookings/${id}/pay-remaining`, {
    method: "PATCH",
    body: JSON.stringify({ method }),
  });
}

export async function cancelBooking(id: number): Promise<UserBooking> {
  return authFetch(`/user/bookings/${id}/cancel`, {
    method: "PATCH",
  });
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

// ─── Public APIs ─────────────────────────────────────────────────────────────
export async function getPublicHotels(keyword?: string): Promise<Hotel[]> {
  const url = new URL(`${API_BASE_URL}/public/hotels`);
  if (keyword) url.searchParams.append("keyword", keyword);
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch hotels");
  return res.json();
}

export async function getPublicHotelById(id: string | number): Promise<Hotel> {
  const res = await fetch(`${API_BASE_URL}/public/hotels/${id}`);
  if (!res.ok) throw new Error("Failed to fetch hotel details");
  return res.json();
}

export interface HotelReview {
  id: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  adminReply?: string;
  createdAt: string;
}

export async function getHotelReviews(hotelId: string | number): Promise<HotelReview[]> {
  const res = await fetch(`${API_BASE_URL}/reviews/hotel/${hotelId}`);
  if (!res.ok) return [];
  return res.json();
}

import { Hotel } from "@/types/hotel";


