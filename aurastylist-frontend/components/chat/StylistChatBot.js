"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Image as ImageIcon, Mic, Loader2 } from "lucide-react";

export default function StylistChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hi! I'm your AI Stylist. Ask me anything or upload an image for style advice." }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textOverride) => {
    const text = textOverride || inputVal;
    if (!text.trim()) return;

    // Add user message immediately
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInputVal("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setMessages([...newMessages, { role: "bot", content: data.reply || "I'm having trouble connecting to my stylist brain." }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "bot", content: "Sorry, I am offline right now!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate sending image to backend
    setMessages([...messages, { role: "user", content: `[Uploaded Image: ${file.name}]` }]);
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", content: "That looks like a great piece! It definitely fits a Dark Academia aesthetic if you pair it with tailored wool trousers and loafers." }]);
      setIsTyping(false);
    }, 2000);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate stopping recording and sending audio
      setIsTyping(true);
      setMessages([...messages, { role: "user", content: "🎤 [Voice Memo]" }]);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "bot", content: "I heard you! As Nova Sonic, I'd suggest pairing those shoes with a bright summer dress." }]);
        setIsTyping(false);
      }, 2500);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <>
      {/* Floating Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-500 group"
        >
          <MessageSquare size={26} className="group-hover:text-primary transition-colors" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black shadow-lg border-2 border-white dark:border-zinc-900">1</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[620px] w-[400px] flex-col rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.6)] overflow-hidden animate-in slide-in-from-bottom-5 transition-all duration-500">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                <MessageSquare size={20} className="text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-base tracking-tight">AI Stylist</h3>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#D4AF37]">Live Now</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-2.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-sm leading-relaxed transition-all ${
                  msg.role === "user" 
                    ? "bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-zinc-900 dark:text-white rounded-br-sm" 
                    : "bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-[1.25rem] px-5 py-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-bl-sm shadow-sm animate-pulse">
                  <Loader2 size={16} className="animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-full px-4 py-2 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/10 transition-all shadow-inner">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-zinc-400 hover:text-[#D4AF37] transition-colors"
                title="Upload Inspiration"
              >
                <ImageIcon size={20} />
              </button>
              
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask your stylist..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none py-3 px-1 focus:outline-none text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
                rows={1}
              />
              
              <button 
                onClick={toggleRecording}
                className={`p-2 transition-colors ${isRecording ? "text-[#D4AF37] animate-pulse" : "text-zinc-400 hover:text-[#D4AF37]"}`}
                title="Voice Request"
              >
                <Mic size={20} />
              </button>
              
              <button 
                onClick={() => handleSend()}
                disabled={!inputVal.trim()}
                className="flex h-10 w-10 items-center justify-center bg-[#D4AF37] text-black rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
