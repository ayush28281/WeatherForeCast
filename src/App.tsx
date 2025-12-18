import { useState, useEffect } from "react";

import {
  Send,
  CloudRain,
  User,
  Sparkles,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherInsights {
  temperature: string;
  rain: string;
  advice: string;
  clothing: string;
  caution: string;
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  insights?: WeatherInsights;
}

type WeatherType = "clear" | "rain" | "cloudy" | "smoke" | "snow" | "default";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [weatherType, setWeatherType] = useState<WeatherType>("default");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();

      setWeatherType(data.weather_type ?? "default");

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.success ? data.response : data.error,
        insights: data.insights,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "⚠️ Unable to reach backend.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setWeatherType("default");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const root = document.documentElement;
  
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);
  

  return (
    <div
  className={`min-h-screen relative overflow-hidden flex items-center justify-center px-4 transition-colors ${
    darkMode ? "dark" : ""
  }`}
>


      {/* 🌦 Dynamic Weather Background */}
      <div
        className={`absolute inset-0 -z-10 transition-all duration-700 ${
          weatherType === "clear"
            ? "bg-gradient-to-br from-orange-200 via-yellow-100 to-sky-200"
            : weatherType === "rain"
            ? "bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900"
            : weatherType === "cloudy"
            ? "bg-gradient-to-br from-gray-300 via-gray-200 to-slate-300"
            : weatherType === "smoke"
            ? "bg-gradient-to-br from-slate-400 via-slate-500 to-gray-600"
            : weatherType === "snow"
            ? "bg-gradient-to-br from-slate-100 via-white to-slate-200"
            : "bg-gradient-to-br from-sky-200 via-white to-blue-200"
        }`}
      />

      {/* 🌧 Rain Animation */}
      {weatherType === "rain" && <div className="rain" />}

      {/* Main Card */}
      <div className="w-full max-w-4xl rounded-3xl bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl border border-white/40 dark:border-slate-700 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CloudRain className="text-white w-8 h-8" />
            <div>
              <h1 className="text-white text-2xl font-bold">
                Weather Assistant
              </h1>
              <p className="text-blue-100 text-sm">
                AI-powered weather insights
              </p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-white/90 hover:text-white transition"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* Chat Area */}
        <div className="h-[520px] overflow-y-auto px-6 py-6 space-y-5">

          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400"
            >
              <CloudRain className="w-20 h-20 text-blue-300 mb-4" />
              <p className="text-lg font-semibold">
                No conversations yet
              </p>
              <p className="text-sm mt-1">
                Ask about the weather in any city
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-3 ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!msg.isUser && (
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow">
                    <Sparkles size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                    msg.isUser
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 dark:bg-slate-700 dark:text-gray-100 border border-gray-200 dark:border-slate-600"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {/* 🌟 Insight Cards */}
                  {msg.insights && (
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs opacity-90">
                      <div>🌡 {msg.insights.temperature}</div>
                      <div>☔ {msg.insights.rain}</div>
                      <div>👕 {msg.insights.clothing}</div>
                      <div>🚨 {msg.insights.caution}</div>
                    </div>
                  )}

                  <p className="text-xs mt-2 opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {msg.isUser && (
                  <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-600 flex items-center justify-center shadow">
                    <User size={18} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-center"
            >
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4 text-blue-600" />
                <span className="text-sm">Fetching weather…</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-5 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 sticky bottom-0">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about the weather…"
              className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium flex items-center gap-2 hover:bg-blue-700 transition shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <Send size={18} />
              )}
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
