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
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-black text-white shadow-2xl hover:scale-110 transition-transform dark:bg-white dark:text-black"
        >
          <MessageSquare size={28} />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">1</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] flex-col rounded-3xl bg-white shadow-2xl border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between bg-black px-6 py-4 text-white dark:bg-white dark:text-black">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/10 backdrop-blur-md">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-bold">AI Stylist</h3>
                <p className="text-xs opacity-70">Powered by Amazon Nova</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-white/20 dark:hover:bg-black/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-900">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === "user" 
                    ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-sm" 
                    : "bg-white border border-zinc-200 text-zinc-800 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-200 rounded-tl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 rounded-tl-sm shadow-sm">
                  <Loader2 size={16} className="animate-spin text-zinc-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
            <div className="flex items-end gap-2 bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-2 focus-within:ring-2 ring-black dark:ring-white transition-all">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-zinc-500 hover:text-black dark:hover:text-white transition-colors rounded-xl"
              >
                <ImageIcon size={20} />
              </button>
              
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask your stylist..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none py-3 px-1 focus:outline-none text-sm text-black dark:text-white"
                rows={1}
              />
              
              <button 
                onClick={toggleRecording}
                className={`p-3 transition-colors rounded-xl ${isRecording ? "text-red-500 animate-pulse bg-red-50 dark:bg-red-950/30" : "text-zinc-500 hover:text-black dark:hover:text-white"}`}
              >
                <Mic size={20} />
              </button>
              
              <button 
                onClick={() => handleSend()}
                disabled={!inputVal.trim()}
                className="p-3 bg-black text-white rounded-xl hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
