"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Agent, Task } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  MessageSquare,
  GitBranch,
  Bot,
  Clock,
  Sparkles,
  Terminal,
  Cpu,
  Wifi,
  Database
} from "lucide-react";

interface ActivityFeedProps {
  agents: Agent[];
  tasks: Task[];
}

type ActivityType = "task" | "agent" | "system" | "chat" | "workflow";

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  agentAvatar?: string;
  metadata?: Record<string, string>;
}

const activityIcons: Record<ActivityType, typeof Activity> = {
  task: CheckCircle2,
  agent: Bot,
  system: Cpu,
  chat: MessageSquare,
  workflow: GitBranch,
};

const activityColors: Record<ActivityType, string> = {
  task: "text-green-400",
  agent: "text-violet-400",
  system: "text-blue-400",
  chat: "text-amber-400",
  workflow: "text-fuchsia-400",
};

const activityBgColors: Record<ActivityType, string> = {
  task: "bg-green-500/10",
  agent: "bg-violet-500/10",
  system: "bg-blue-500/10",
  chat: "bg-amber-500/10",
  workflow: "bg-fuchsia-500/10",
};

// Generate realistic activities
const generateActivities = (agents: Agent[], tasks: Task[]): ActivityItem[] => {
  const activities: ActivityItem[] = [];
  
  // Add task-related activities
  tasks.forEach((task, i) => {
    const agent = agents.find((a) => a.id === task.agentId);
    activities.push({
      id: `task-${task.id}`,
      type: "task",
      title: task.status === "completed" ? "Task Completed" : "Task Updated",
      description: `"${task.title}" ${task.status === "completed" ? "finished successfully" : `is now ${task.status}`}`,
      timestamp: new Date(Date.now() - i * 1000 * 60 * 5),
      agentId: agent?.id,
      agentName: agent?.name,
      agentAvatar: agent?.avatar,
      metadata: { priority: task.priority },
    });
  });

  // Add agent activities
  agents.forEach((agent, i) => {
    if (agent.status === "working") {
      activities.push({
        id: `agent-${agent.id}-working`,
        type: "agent",
        title: `${agent.name} Started Task`,
        description: agent.currentTask || "Processing assigned work",
        timestamp: new Date(Date.now() - i * 1000 * 60 * 3),
        agentId: agent.id,
        agentName: agent.name,
        agentAvatar: agent.avatar,
      });
    }
  });

  // Add system activities
  activities.push(
    {
      id: "system-1",
      type: "system",
      title: "System Health Check",
      description: "All systems operational. Response time: 42ms",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: "system-2",
      type: "system",
      title: "Gemini 3 API Connected",
      description: "AI inference endpoint responding normally",
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
    },
    {
      id: "system-3",
      type: "system",
      title: "Database Sync Complete",
      description: "Task state synchronized across all nodes",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    }
  );

  // Add chat activities
  activities.push(
    {
      id: "chat-1",
      type: "chat",
      title: "Team Channel Activity",
      description: 'New message from Angel: "Great progress today team!"',
      timestamp: new Date(Date.now() - 1000 * 60 * 4),
      agentName: "Angel",
      agentAvatar: "👼",
    },
    {
      id: "chat-2",
      type: "chat",
      title: "Direct Message",
      description: "Cipher responded to workflow query",
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      agentName: "Cipher",
      agentAvatar: "💻",
    }
  );

  // Add workflow activities
  activities.push(
    {
      id: "wf-1",
      type: "workflow",
      title: "Workflow Executed",
      description: "Content Creation Pipeline completed 3/3 steps",
      timestamp: new Date(Date.now() - 1000 * 60 * 6),
    },
    {
      id: "wf-2",
      type: "workflow",
      title: "Workflow Created",
      description: "New Code Review Workflow drafted",
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    }
  );

  // Sort by timestamp (newest first)
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 15);
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export function ActivityFeed({ agents, tasks }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLive, setIsLive] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize activities
  useEffect(() => {
    setActivities(generateActivities(agents, tasks));
  }, [agents, tasks]);

  // Live update simulation
  useEffect(() => {
    if (!isLive) return;

    intervalRef.current = setInterval(() => {
      setActivities((prev) => {
        const randomAgent = agents[Math.floor(Math.random() * agents.length)];
        const newActivity: ActivityItem = {
          id: `live-${Date.now()}`,
          type: Math.random() > 0.5 ? "system" : "agent",
          title: Math.random() > 0.5 ? "Metric Update" : "Heartbeat Received",
          description: Math.random() > 0.5 
            ? `CPU usage: ${Math.floor(Math.random() * 30 + 20)}% • Memory: ${Math.floor(Math.random() * 20 + 40)}%`
            : `${randomAgent?.name || "Agent"} reported status: ${randomAgent?.status || "idle"}`,
          timestamp: new Date(),
          agentId: randomAgent?.id,
          agentName: randomAgent?.name,
          agentAvatar: randomAgent?.avatar,
        };
        return [newActivity, ...prev].slice(0, 20);
      });
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, agents]);

  // Auto-scroll to top when new items added
  useEffect(() => {
    if (scrollRef.current && isLive) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activities, isLive]);

  const activityCounts = activities.reduce((acc, act) => {
    acc[act.type] = (acc[act.type] || 0) + 1;
    return acc;
  }, {} as Record<ActivityType, number>);

  return (
    <Card className="h-[600px] bg-slate-900/50 backdrop-blur-sm border-slate-800/50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-violet-400" />
            <h3 className="font-semibold text-white">Live Activity Feed</h3>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              isLive 
                ? "bg-green-500/20 text-green-400" 
                : "bg-slate-700 text-slate-400"
            }`}
          >
            {isLive ? "● LIVE" : "⏸ PAUSED"}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {(["task", "agent", "system", "chat", "workflow"] as ActivityType[]).map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className={`text-xs capitalize cursor-pointer transition-colors ${
                activityBgColors[type]
              } ${activityColors[type]} border-none hover:opacity-80`}
            >
              {type.replace("_", " ")}
              <span className="ml-1 opacity-60">({activityCounts[type] || 0})</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Activity List */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const colorClass = activityColors[activity.type];
              const bgClass = activityBgColors[activity.type];
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.02 }}
                  className="group"
                >
                  <div className="flex gap-3 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700/50">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${colorClass}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{activity.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{activity.description}</p>
                          
                          {activity.agentName && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-sm">{activity.agentAvatar}</span>
                              <span className="text-xs text-violet-400">{activity.agentName}</span>
                            </div>
                          )}
                        </div>
                        
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>

                      {activity.metadata?.priority && (
                        <Badge 
                          variant="outline" 
                          className={`text-[10px] mt-2 ${
                            activity.metadata.priority === "high" 
                              ? "border-amber-500/30 text-amber-400" 
                              : activity.metadata.priority === "critical"
                              ? "border-red-500/30 text-red-400"
                              : "border-slate-600 text-slate-400"
                          }`}
                        >
                          {activity.metadata.priority.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {activities.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/30">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-violet-400">
              <Wifi className="w-3 h-3" />
              <span className="text-lg font-bold">{agents.filter(a => a.status !== "offline").length}</span>
            </div>
            <p className="text-xs text-slate-500">Connected</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-green-400">
              <Database className="w-3 h-3" />
              <span className="text-lg font-bold">{activities.length}</span>
            </div>
            <p className="text-xs text-slate-500">Events</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-amber-400">
              <Clock className="w-3 h-3" />
              <span className="text-lg font-bold">42ms</span>
            </div>
            <p className="text-xs text-slate-500">Latency</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
