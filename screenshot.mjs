import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = 'D:\\HocDiThangDauBuoi\\TTTN\\image';
const BOOKING_URL = 'https://hotel-booking-inky-eta.vercel.app';
const ADMIN_URL   = 'https://hotel-admin-tau-olive.vercel.app';
const OWNER_URL   = 'https://hotel-owner.vercel.app';

const ADMIN_EMAIL    = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';
const OWNER_EMAIL    = 'long.le@gmail.com';
const OWNER_PASSWORD = '123456';
const USER_EMAIL     = 'user@gmail.com';
const USER_PASSWORD  = '123456';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function screenshot(page, filename, waitMs = 3000) {
  await delay(waitMs);
  const filepath = path.join(OUTPUT_DIR, filename + '.png');
  await page.screenshot({ path: filepath, fullPage: true });
  console.log('✓', filename + '.png');
}

async function navAndShot(page, url, filename, waitMs = 4000) {
  try {
    console.log('→ Navigating:', url);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await screenshot(page, filename, waitMs);
  } catch(e) {
    console.warn('⚠ Failed', filename, ':', e.message.slice(0, 80));
    try { await page.screenshot({ path: path.join(OUTPUT_DIR, filename + '.png'), fullPage: true }); } catch {}
  }
}

async function scrollAndShot(page, scrollY, filename) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), scrollY);
  await delay(1500);
  await page.screenshot({ path: path.join(OUTPUT_DIR, filename + '.png'), fullPage: false });
  console.log('✓', filename + '.png');
}

async function loginAdmin(page) {
  await page.goto(ADMIN_URL + '/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(2000);
  try {
    await page.type('input[type="email"]', ADMIN_EMAIL, { delay: 50 });
    await page.type('input[type="password"]', ADMIN_PASSWORD, { delay: 50 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await delay(2000);
    console.log('✓ Admin logged in, URL:', page.url());
  } catch(e) { console.warn('Admin login error:', e.message.slice(0,80)); }
}

async function loginOwner(page) {
  await page.goto(OWNER_URL + '/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(2000);
  try {
    await page.type('input[type="email"]', OWNER_EMAIL, { delay: 50 });
    await page.type('input[type="password"]', OWNER_PASSWORD, { delay: 50 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await delay(2000);
    console.log('✓ Owner logged in, URL:', page.url());
  } catch(e) { console.warn('Owner login error:', e.message.slice(0,80)); }
}

async function loginUser(page) {
  await page.goto(BOOKING_URL + '/login', { waitUntil: 'networkidle2', timeout: 30000 });
  await delay(2000);
  try {
    await page.type('input[type="email"]', USER_EMAIL, { delay: 50 });
    await page.type('input[type="password"]', USER_PASSWORD, { delay: 50 });
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
      page.click('button[type="submit"]'),
    ]);
    await delay(2000);
    console.log('✓ User logged in, URL:', page.url());
  } catch(e) { console.warn('User login error:', e.message.slice(0,80)); }
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN,vi']
  });

  // =====================================================
  // BOOKING FRONTEND
  // =====================================================
  console.log('\n========== BOOKING (hotel-booking) ==========');
  const bp = await browser.newPage();

  // Trang chủ - chụp viewport (banner)
  await bp.goto(BOOKING_URL, { waitUntil: 'networkidle2', timeout: 45000 });
  await delay(3000);
  await bp.screenshot({ path: path.join(OUTPUT_DIR, 'hinh_4.3.2_trangchu_banner.png'), fullPage: false });
  console.log('✓ hinh_4.3.2_trangchu_banner.png');

  // Scroll xuống danh sách khách sạn nổi bật
  await scrollAndShot(bp, 900, 'hinh_4.3.3_trangchu_khachsan_noibat');

  // Scroll xuống ưu đãi
  await scrollAndShot(bp, 1800, 'hinh_4.3.4_trangchu_uudai');

  // Scroll xuống bài viết
  await scrollAndShot(bp, 2700, 'hinh_4.3.5_trangchu_baiviet');

  // Tìm kiếm
  await navAndShot(bp, BOOKING_URL + '/search', 'hinh_4.3.6_timkiem_khachsan');

  // Danh sách khách sạn
  await navAndShot(bp, BOOKING_URL + '/featured-hotels', 'hinh_4.3.7_danhsach_khachsan');

  // Chi tiết khách sạn
  await navAndShot(bp, BOOKING_URL + '/hotel/1', 'hinh_4.3.8_chitiet_khachsan', 5000);

  // Scroll xuống chọn loại phòng
  await scrollAndShot(bp, 1200, 'hinh_4.3.9_chon_loaiphong');

  // Trang login (chụp trước khi đăng nhập)
  await navAndShot(bp, BOOKING_URL + '/login', 'hinh_4.3.15_dangnhap_dangky', 2500);

  // Forgot password
  await navAndShot(bp, BOOKING_URL + '/forgot-password', 'hinh_4.3.16_quenmatkhau', 2500);

  // Posts list
  await navAndShot(bp, BOOKING_URL + '/posts', 'hinh_4.3.18_danhsach_baiviet', 4000);

  // Post detail
  await navAndShot(bp, BOOKING_URL + '/post/1', 'hinh_4.3.19_chitiet_baiviet', 4000);

  // Special offers
  await navAndShot(bp, BOOKING_URL + '/special-offers', 'hinh_4.3.11_promotion', 3000);

  // Đăng nhập user để vào trang cần auth
  await loginUser(bp);

  // Dashboard/profile
  await navAndShot(bp, BOOKING_URL + '/dashboard', 'hinh_4.3.17_trang_canhan', 4000);

  // Lịch sử đặt phòng
  await navAndShot(bp, BOOKING_URL + '/dashboard/bookings', 'hinh_4.3.14_theodoi_datphong', 4000);

  // Payment result
  await navAndShot(bp, BOOKING_URL + '/payment-result', 'hinh_4.3.13_ketqua_thanhtoan', 3000);

  // Checkout
  await navAndShot(bp, BOOKING_URL + '/checkout', 'hinh_4.3.10_thanhtoan', 3000);

  // Wishlist (nếu có)
  await navAndShot(bp, BOOKING_URL + '/dashboard', 'hinh_4.3.21_wishlist', 3000);

  // Chat AI - scroll đến widget
  await navAndShot(bp, BOOKING_URL, 'hinh_4.3.20_chatai', 4000);

  console.log('\n========== ADMIN FRONTEND ==========');
  const ap = await browser.newPage();

  // Trang login admin
  await navAndShot(ap, ADMIN_URL + '/login', 'hinh_4.4.0_admin_login', 2500);

  await loginAdmin(ap);

  // Dashboard
  await navAndShot(ap, ADMIN_URL, 'hinh_4.4.2_admin_dashboard', 4000);

  // Quản lý khách sạn
  await navAndShot(ap, ADMIN_URL + '/hotels', 'hinh_4.4.3_admin_khachsan', 4000);

  // Quản lý đặt phòng
  await navAndShot(ap, ADMIN_URL + '/bookings', 'hinh_4.4.5_admin_datphong', 4000);

  // Quản lý người dùng
  await navAndShot(ap, ADMIN_URL + '/users', 'hinh_4.4.6_admin_nguoidung', 4000);

  // Quản lý bài viết
  await navAndShot(ap, ADMIN_URL + '/posts', 'hinh_4.4.8_admin_baiviet', 4000);

  // Quản lý banner
  await navAndShot(ap, ADMIN_URL + '/banner', 'hinh_4.4.9_admin_banner', 4000);

  // Quản lý đánh giá
  await navAndShot(ap, ADMIN_URL + '/reviews', 'hinh_4.4.10_admin_danhgia', 4000);

  // Chat / liên hệ
  await navAndShot(ap, ADMIN_URL + '/chat', 'hinh_4.4.11_admin_chat', 4000);

  // Settings admin
  await navAndShot(ap, ADMIN_URL + '/settings', 'hinh_4.4.12_admin_settings', 4000);

  console.log('\n========== OWNER FRONTEND ==========');
  const op = await browser.newPage();

  // Trang login owner
  await navAndShot(op, OWNER_URL + '/login', 'hinh_4.5.0_owner_login', 2500);

  await loginOwner(op);

  // Dashboard owner
  await navAndShot(op, OWNER_URL, 'hinh_4.5.2_owner_dashboard', 4000);

  // Khách sạn của owner
  await navAndShot(op, OWNER_URL + '/hotels', 'hinh_4.5.3_owner_khachsan', 4000);

  // Đặt phòng owner
  await navAndShot(op, OWNER_URL + '/bookings', 'hinh_4.5.5_owner_datphong', 4000);

  // Đánh giá owner
  await navAndShot(op, OWNER_URL + '/reviews', 'hinh_4.5.6_owner_danhgia', 4000);

  // Bài viết owner
  await navAndShot(op, OWNER_URL + '/users', 'hinh_4.5.7_owner_baiviet', 4000);

  // Banner owner
  await navAndShot(op, OWNER_URL + '/banner', 'hinh_4.5.8_owner_banner', 4000);

  // Settings owner
  await navAndShot(op, OWNER_URL + '/settings', 'hinh_4.5.9_owner_settings', 4000);

  await browser.close();
  console.log('\n✅ Xong! Ảnh đã lưu tại:', OUTPUT_DIR);
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
  console.log('Tổng số ảnh:', files.length);
})();
