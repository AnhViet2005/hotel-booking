/**
 * Chuyển đổi URL ảnh tương đối (/uploads/...) thành URL tuyệt đối trỏ về Railway backend.
 * Nếu URL đã là tuyệt đối (http/https), giữ nguyên.
 * Đây là hàm duy nhất nên dùng để xử lý URL ảnh trong toàn bộ dự án.
 */
const BACKEND_BASE =
  (process.env.NEXT_PUBLIC_BACKEND_URL || "https://hotel-backend-production-222c.up.railway.app/api")
    .replace(/\/api\/?$/, "");

export function getImageUrl(url?: string | null, fallback?: string): string {
  if (!url) return fallback || "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // Relative path like /uploads/xxx.jpg → prepend backend base
  return `${BACKEND_BASE}${url.startsWith("/") ? url : `/${url}`}`;
}
