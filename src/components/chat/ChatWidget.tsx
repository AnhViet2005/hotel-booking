"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, Minus } from "lucide-react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken, getChatHistory } from "@/utils/api";
import { cn } from "@/utils/cn";

interface Message {
  id?: number;
  senderId: number;
  senderName: string;
  receiverId: number;
  content: string;
  createdAt?: string;
}

interface ChatWidgetProps {
  receiverId: number;
  receiverName: string;
  currentUserId: number;
  currentUserEmail: string;
}

export default function ChatWidget({ receiverId, receiverName, currentUserId, currentUserEmail }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const stompClient = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isConnected) {
      connect();
      fetchHistory();
    }
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      const history = await getChatHistory(receiverId);
      setMessages(history);
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  const connect = () => {
    const token = getToken();
    const backendBase = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://hotel-backend-production-222c.up.railway.app/api").replace('/api', '');
    const wsUrl = backendBase + "/ws";
    const socket = new SockJS(wsUrl);
    
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      onConnect: () => {
        setIsConnected(true);
        console.log("Connected to WebSocket");
        
        // Đăng ký nhận tin nhắn cá nhân
        client.subscribe(`/user/${currentUserEmail}/queue/messages`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => {
            // Tránh tin nhắn trùng lặp nếu người gửi cũng nhận được confirmation qua socket
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      }
    });

    client.activate();
    stompClient.current = client;
  };

  const sendMessage = () => {
    if (!input.trim() || !stompClient.current?.connected) return;

    const messageData = {
      senderId: currentUserId,
      receiverId: receiverId,
      content: input.trim()
    };

    stompClient.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(messageData)
    });

    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute left-full ml-3 bg-card text-foreground px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border">
          Chat với chủ khách sạn
        </span>
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 left-6 w-80 md:w-96 bg-card border shadow-2xl rounded-2xl overflow-hidden flex flex-col transition-all z-50",
      isMinimized ? "h-14" : "h-[500px]"
    )}>
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex items-center justify-between cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
           <span className="font-bold text-sm truncate max-w-[150px]">{receiverName}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1 hover:bg-white/20 rounded">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.length === 0 && (
              <div className="text-center py-10 opacity-50 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto" />
                <p className="text-xs">Hãy bắt đầu cuộc trò chuyện</p>
              </div>
            )}
            {messages.map((msg, idx) => {
              const isMe = msg.senderId === currentUserId;
              return (
                <div key={idx} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                    isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-white dark:bg-zinc-800 text-foreground rounded-tl-none border"
                  )}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-card border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-muted border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !input.trim()}
                className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
