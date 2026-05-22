"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  sources?: { title: string; price: number; similarity: string }[];
}

interface ChatAgentProps {
  agentName?: string;
  agentAvatar?: string;
  welcomeMessage?: string;
  onSendMessage?: (message: string) => Promise<string>;
  suggestions?: string[];
}

const ChatAgent: React.FC<ChatAgentProps> = ({
  agentName = "Travel Assistant",
  agentAvatar,
  welcomeMessage = "Hello! 👋 I'm your travel assistant. How can I help you plan your perfect trip today?",
  onSendMessage,
  suggestions = [
    "What tours do you recommend?",
    "Tell me about pricing",
    "Best time to visit?",
    "Group discounts available?",
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: welcomeMessage,
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendApiMessage = async (
    content: string,
    e?: React.FormEvent<HTMLFormElement>,
  ) => {
    e?.preventDefault();

    if (!content.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}`,
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    setInputValue("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userQuery: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: `${Date.now() + 1}`,
        content: data.answer,
        role: "assistant",
        timestamp: new Date(),
        sources: data.sources,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Fetch Error:", error);
      const errorMessage: Message = {
        id: `${Date.now() + 1}`,
        content:
          "Oops! I ran into an error fetching the recommendation. Check the console for details.",
        role: "assistant",
        timestamp: new Date(),
        sources: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendApiMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative group"
            >
              {/* Pulse Animation */}
              <span className="absolute inset-0 rounded-full bg-[#8EBD22]/30 animate-ping" />
              <span className="absolute inset-0 rounded-full bg-[#8EBD22]/20 animate-pulse" />

              {/* Button */}
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#8EBD22] to-[#8EBD22] shadow-lg shadow-[#8EBD22]/30">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <MessageCircle className="w-7 h-7 text-white" />
                </motion.div>
              </div>

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-card text-card-foreground px-4 py-2 rounded-xl shadow-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Chat with us! 💬
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-h-[80vh] flex flex-col bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative px-5 py-4 bg-gradient-to-r from-[#8EBD22] to-[#8EBD22]"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                    backgroundSize: "16px 16px",
                  }}
                />
              </div>

              <div className="relative z-40 flex items-center justify-between">
                <div className="flex z-40 items-center gap-3">
                  {/* Agent Avatar */}
                  <motion.div
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(255,255,255,0.4)",
                        "0 0 0 8px rgba(255,255,255,0)",
                        "0 0 0 0 rgba(255,255,255,0)",
                      ],
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="relative w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden"
                  >
                    {agentAvatar ? (
                      <img
                        src={agentAvatar}
                        alt={agentName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Bot className="w-6 h-6 text-white" />
                    )}
                    {/* Online Indicator */}
                    <span className="absolute z-50 bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#8EBD22]" />
                  </motion.div>

                  <div>
                    <h3 className="font-semibold text-white flex items-center gap-2">
                      {agentName}
                      <Sparkles className="w-4 h-4" />
                    </h3>
                    <p className="text-xs text-white/80">
                      Online • Ready to help
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "flex-row-reverse" : "flex-row",
                    )}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                        message.role === "user"
                          ? "bg-[#8EBD22] text-white"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-3",
                        message.role === "user"
                          ? "bg-[#8EBD22] text-white rounded-tr-md"
                          : "bg-muted text-foreground rounded-tl-md",
                      )}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>

                      <p
                        className={cn(
                          "text-[10px] mt-1",
                          message.role === "user"
                            ? "text-white/60"
                            : "text-muted-foreground",
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Bot className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ y: [0, -5, 0] }}
                              transition={{
                                repeat: Infinity,
                                duration: 0.6,
                                delay: i * 0.2,
                              }}
                              className="w-2 h-2 rounded-full bg-muted-foreground/50"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="px-4 pb-2"
              >
                <p className="text-xs text-muted-foreground mb-2">
                  Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => sendApiMessage(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-[#8EBD22] hover:text-white text-foreground transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-4 border-t border-border bg-background/50 backdrop-blur"
            >
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 rounded-full border-muted bg-muted/50 focus:bg-background"
                  disabled={isLoading}
                />
                <Button
                  onClick={() => sendApiMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  size="icon"
                  className="rounded-full bg-gradient-to-r from-[#8EBD22] to-[#8EBD22] hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAgent;
