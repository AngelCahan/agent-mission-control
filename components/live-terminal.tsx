"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Terminal, 
  Download, 
  Trash2, 
  Pause,
  Play,
  AlertCircle,
  CheckCircle2,
  Info,
  Zap,
  Activity
} from "lucide-react";

type LogLevel = "INFO" | "SUCCESS" | "WARN" | "ERROR" | "DEBUG";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: string;
  message: string;
  metadata?: string;
}

const logColors: Record<LogLevel, string> = {
  INFO: "text-blue-400",
  SUCCESS: "text-green-400",
  WARN: "text-amber-400",
  ERROR: "text-red-400",
  DEBUG: "text-slate-400",
};

const logBgColors: Record<LogLevel, string> = {
  INFO: "bg-blue-500/10",
  SUCCESS: "bg-green-500/10",
  WARN: "bg-amber-500/10",
  ERROR: "bg-red-500/10",
  DEBUG: "bg-slate-500/10",
};

const logIcons: Record<LogLevel, typeof Info> = {
  INFO: Info,
  SUCCESS: CheckCircle2,
  WARN: AlertCircle,
  ERROR: AlertCircle,
  DEBUG: Zap,
};

// Generate initial logs
const generateInitialLogs = (): LogEntry[] => {
  const sources = ["AgentManager", "TaskQueue", "GeminiAPI", "WebSocket", "System", "WorkflowEngine"];
  const messages = [
    { level: "INFO" as LogLevel, msg: "Initializing agent coordination service..." },
    { level: "SUCCESS" as LogLevel, msg: "Agent 'Echo' registered successfully (id: echo-001)" },
    { level: "SUCCESS" as LogLevel, msg: "Agent 'Cipher' registered successfully (id: cipher-001)" },
    { level: "SUCCESS" as LogLevel, msg: "Agent 'Angel' registered successfully (id: angel-001)" },
    { level: "INFO" as LogLevel, msg: "Connecting to Gemini 3 API endpoint..." },
    { level: "SUCCESS" as LogLevel, msg: "Gemini 3 API connection established (latency: 42ms)" },
    { level: "INFO" as LogLevel, msg: "Task queue initialized with 4 pending tasks" },
    { level: "DEBUG" as LogLevel, msg: "WebSocket connection ready on port 3001" },
    { level: "INFO" as LogLevel, msg: "Workflow engine started - 2 workflows loaded" },
    { level: "SUCCESS" as LogLevel, msg: "All systems operational. Ready for commands." },
    { level: "INFO" as LogLevel, msg: "Heartbeat check: 3 agents responding" },
    { level: "DEBUG" as LogLevel, msg: "Memory usage: 234MB / 1024MB (22.8%)" },
  ];

  return messages.map((m, i) => ({
    id: `init-${i}`,
    timestamp: new Date(Date.now() - (messages.length - i) * 1000),
    level: m.level,
    source: sources[Math.floor(Math.random() * sources.length)],
    message: m.msg,
  }));
};

// Generate random live log
const generateLiveLog = (): LogEntry => {
  const sources = ["AgentManager", "TaskQueue", "GeminiAPI", "WebSocket", "System", "WorkflowEngine", "Analytics"];
  const levels: LogLevel[] = ["INFO", "INFO", "INFO", "SUCCESS", "DEBUG", "WARN"];
  const level = levels[Math.floor(Math.random() * levels.length)];
  
  const messages: Record<LogLevel, string[]> = {
    INFO: [
      "Processing task assignment...",
      "Agent status update received",
      "Syncing task state with database",
      "Heartbeat received from agent",
      "Analyzing workflow dependencies...",
      "Checking API rate limits...",
    ],
    SUCCESS: [
      "Task completed successfully",
      "Agent finished processing",
      "Workflow step executed",
      "Data synced successfully",
      "Cache invalidated",
    ],
    WARN: [
      "High memory usage detected (78%)",
      "API response time elevated (245ms)",
      "Agent idle for extended period",
      "Retry attempt 2/3 for task",
    ],
    ERROR: [
      "Failed to connect to agent",
      "Task execution timeout",
      "API rate limit exceeded",
    ],
    DEBUG: [
      "Memory stats: heap=156MB, external=23MB",
      "Event loop lag: 2.4ms",
      "Active connections: 5",
    ],
  };

  const msgList = messages[level];
  const message = msgList[Math.floor(Math.random() * msgList.length)];
  
  return {
    id: `live-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    level,
    source: sources[Math.floor(Math.random() * sources.length)],
    message,
    metadata: level === "DEBUG" ? `pid=${Math.floor(Math.random() * 9000 + 1000)}` : undefined,
  };
};

const formatTimestamp = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export function LiveTerminal() {
  const [logs, setLogs] = useState<LogEntry[]>(generateInitialLogs());
  const [isStreaming, setIsStreaming] = useState(true);
  const [filter, setFilter] = useState<LogLevel | "ALL">("ALL");
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (bottomRef.current && isStreaming) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isStreaming]);

  // Live log streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to add log
        setLogs((prev) => [...prev.slice(-100), generateLiveLog()]);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredLogs = filter === "ALL" 
    ? logs 
    : logs.filter((log) => log.level === filter);

  const clearLogs = () => {
    setLogs([]);
  };

  const downloadLogs = () => {
    const content = logs.map((log) => 
      `[${formatTimestamp(log.timestamp)}] [${log.level}] ${log.source}: ${log.message}`
    ).join("\n");
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-mission-control-logs-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const logCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<LogLevel, number>);

  return (
    <Card className="h-[600px] bg-slate-950 border-slate-800/50 flex flex-col font-mono">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-400" />
            <span className="font-semibold text-white">System Logs</span>
          </div>
          
          <motion.div
            animate={{ opacity: isStreaming ? [1, 0.3, 1] : 0.5 }}
            transition={{ duration: 1.5, repeat: isStreaming ? Infinity : 0 }}
            className="flex items-center gap-1.5"
          >
            <div className={`w-2 h-2 rounded-full ${isStreaming ? "bg-green-500" : "bg-amber-500"}`} />
            <span className={`text-xs ${isStreaming ? "text-green-400" : "text-amber-400"}`}>
              {isStreaming ? "STREAMING" : "PAUSED"}
            </span>
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsStreaming(!isStreaming)}
            className="h-8 px-2 text-slate-400 hover:text-white"
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadLogs}
            className="h-8 px-2 text-slate-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLogs}
            className="h-8 px-2 text-slate-400 hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-2 border-b border-slate-800/50 flex items-center gap-2 flex-wrap">
        <Badge
          variant={filter === "ALL" ? "default" : "secondary"}
          className={`cursor-pointer text-xs ${filter === "ALL" ? "bg-violet-600" : "bg-slate-800 hover:bg-slate-700"}`}
          onClick={() => setFilter("ALL")}
        >
          ALL ({logs.length})
        </Badge>
        
        {(["INFO", "SUCCESS", "WARN", "ERROR", "DEBUG"] as LogLevel[]).map((level) => (
          <Badge
            key={level}
            variant={filter === level ? "default" : "secondary"}
            className={`cursor-pointer text-xs ${
              filter === level 
                ? logBgColors[level].replace("/10", "").replace("bg-", "bg-").replace("blue", "blue-600").replace("green", "green-600").replace("amber", "amber-600").replace("red", "red-600").replace("slate", "slate-600")
                : `${logBgColors[level]} ${logColors[level]} hover:opacity-80`
            }`}
            onClick={() => setFilter(level)}
          >
            {level} ({logCounts[level] || 0})
          </Badge>
        ))}
      </div>

      {/* Log Output */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-1">
          <AnimatePresence initial={false}>
            {filteredLogs.map((log, index) => {
              const Icon = logIcons[log.level];
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="group flex items-start gap-3 py-1 hover:bg-slate-900/50 rounded px-2 -mx-2"
                >
                  <span className="text-slate-600 text-xs flex-shrink-0 w-20">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 h-4 flex-shrink-0 ${logBgColors[log.level]} ${logColors[log.level]} border-none`}
                  >
                    {log.level}
                  </Badge>
                  
                  <span className="text-slate-500 text-xs flex-shrink-0 w-28 truncate">
                    {log.source}
                  </span>
                  
                  <span className={`text-sm ${logColors[log.level]} flex-1`}>
                    {log.message}
                  </span>
                  
                  {log.metadata && (
                    <span className="text-slate-600 text-xs flex-shrink-0">
                      {log.metadata}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          <div ref={bottomRef} />
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-slate-600">
            <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No logs match the selected filter</p>
          </div>
        )}
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-3 border-t border-slate-800/50 bg-slate-900/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <span className="text-slate-500">
            Total: <span className="text-slate-300">{logs.length}</span>
          </span>
          <span className="text-slate-500">
            Showing: <span className="text-slate-300">{filteredLogs.length}</span>
          </span>
          <span className="text-slate-500">
            Rate: <span className="text-green-400">~75/min</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-green-400" />
            <span className="text-slate-400">System Healthy</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
