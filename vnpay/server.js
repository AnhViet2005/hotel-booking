import express from "express";
import cors from "cors";
import "dotenv/config";
import { VNPay } from "vnpay";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE,
  secureSecret: process.env.VNP_HASH_SECRET,
  testMode: true,
});

app.get("/payment", (req, res) => {
  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";
  
  const amount = parseInt(req.query.amount) || 1000000;
  const orderInfo = req.query.orderInfo || "Thanh toan dat phong";
  const returnUrl = req.query.returnUrl || `http://localhost:3001/payment-result`;

  const vnpUrl = vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: ipAddr,
    vnp_TxnRef: Date.now().toString(),
    vnp_OrderInfo: orderInfo,
    vnp_ReturnUrl: returnUrl,
  });

  console.log("✅ Payment URL:", vnpUrl);
  res.json({ url: vnpUrl });
});

// API kiểm tra trả về từ VNPay
app.get("/", (req, res) => {
  const query = req.query;
  const verify = vnpay.verifyReturnUrl(query);

  console.log("VNPay return query:", query);

  if (verify && query.vnp_ResponseCode === "00") {
    res.send("Thanh toán thành công!");
  } else {
    res.send("Thanh toán thất bại!");
  }
});

app.listen(PORT, () => {
  console.log(`VNPay server running on http://localhost:${PORT}`);
});
