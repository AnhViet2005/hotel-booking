"use client";

import { useState } from "react";
import { forgotPassword } from "@/utils/api";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const msg = await forgotPassword(email);
      setMessage(msg);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (text: string) => {
    if (!text) return `Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến ${email}. Vui lòng kiểm tra hộp thư đến của bạn.`;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} className="block mt-4 w-full text-center py-3 bg-accent-500 hover:bg-accent-600 text-white font-black rounded-xl shadow-lg transition-all" target="_blank" rel="noopener noreferrer">
            Đặt lại mật khẩu trực tiếp
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-background rounded-[40px] shadow-2xl border border-border overflow-hidden">
        <div className="p-10">
          <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent-500 transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại đăng nhập
          </Link>

          {!submitted ? (
            <>
              <h1 className="text-3xl font-heading font-black text-foreground mb-4">Quên mật khẩu?</h1>
              <p className="text-muted-foreground mb-8">Đừng lo lắng, hãy nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/70 ml-2">Email của bạn</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      className="w-full pl-12 pr-4 py-4 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-accent-500 transition-all outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-sm font-medium">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-lg shadow-accent-500/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gửi yêu cầu khôi phục"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-foreground mb-4">Kiểm tra Email!</h2>
              <div className="text-muted-foreground mb-8 text-sm whitespace-pre-line text-left bg-muted/30 p-5 rounded-2xl border border-border">
                {renderMessageContent(message)}
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="text-accent-500 font-bold hover:underline"
              >
                Không nhận được email? Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
