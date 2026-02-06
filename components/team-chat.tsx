"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatMessage, Agent } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Volume2, Radio } from "lucide-react";

interface TeamChatProps {
  messages: ChatMessage[];
  agents: Agent[];
  onSendMessage: (content: string, targetAgentId?: string) => void;
}

export function TeamChat({ messages, agents, onSendMessage }: TeamChatProps) {
  const [input, setInput] = useState("");
  const [targetAgent, setTargetAgent] = useState<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input, targetAgent);
    setInput("");
  };

  return (
    <Card className="h-[600px] bg-slate-900/50 backdrop-blur-sm border-slate-800/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-violet-400" />
          <span className="font-semibold text-white">Team Channel</span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-none">
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {agents.slice(0, 3).map((agent) => (
            <button
              key={agent.id}
              onClick={() => setTargetAgent(targetAgent === agent.id ? undefined : agent.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                targetAgent === agent.id
                  ? "bg-violet-600 ring-2 ring-violet-400"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
              title={agent.name}
            >
              {agent.avatar}
            </button>
          ))}
          {agents.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
              +{agents.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-slate-500 py-12">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Team Chat</p>
              <p className="text-sm">Send a message to your agent team</p>
              <p className="text-xs mt-2 opacity-70">Click an agent avatar to DM them directly</p>
            </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.sender === "user"
                      ? "bg-violet-600"
                      : msg.agentId
                      ? "bg-slate-700"
                      : "bg-slate-800"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-sm">
                      {agents.find((a) => a.id === msg.agentId)?.avatar || "🤖"}
                    </span>
                  )}
                </div>

                <div className={`max-w-[70%] ${msg.sender === "user" ? "text-right" : ""}`}>
                  {msg.agentName && (
                    <span className="text-xs text-slate-500 mb-1 block">{msg.agentName}</span>
                  )}
                  <div
                    className={`inline-block px-4 py-2 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-violet-600 text-white rounded-br-md"
                        : "bg-slate-800 text-slate-200 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-slate-600 mt-1 block">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-slate-800/50">
        {targetAgent && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-slate-500">Messaging:</span>
            <Badge
              variant="secondary"
              className="text-xs bg-violet-500/20 text-violet-300 cursor-pointer"
              onClick={() => setTargetAgent(undefined)}
            >
              {agents.find((a) => a.id === targetAgent)?.name} ✕
            </Badge>
          </div>
        )}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={targetAgent ? "Send a direct message..." : "Message your team..."}
            className="bg-slate-800/50 border-slate-700"
          />
          <Button onClick={handleSend} size="icon" className="bg-violet-600 hover:bg-violet-500">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
