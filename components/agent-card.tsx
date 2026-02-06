"use client";

import { motion } from "framer-motion";
import { Agent } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, Circle } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
}

const statusConfig = {
  idle: { icon: Circle, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" },
  working: { icon: Loader2, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  error: { icon: AlertCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  offline: { icon: Circle, color: "text-slate-600", bg: "bg-slate-800/50", border: "border-slate-700" },
};

export function AgentCard({ agent }: AgentCardProps) {
  const config = statusConfig[agent.status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`p-4 bg-slate-900/50 backdrop-blur-sm border ${config.border} hover:border-slate-600 transition-all`}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${config.bg}`}>
            <StatusIcon className={`w-3 h-3 ${config.color} ${agent.status === "working" ? "animate-spin" : ""}`} />
            <span className={`text-xs font-medium ${config.color}`}>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </span>
          </div>
        </div>

        <h3 className="font-semibold text-white mb-0.5">{agent.name}</h3>
        <p className="text-sm text-slate-400 mb-3">{agent.role}</p>

        {agent.currentTask && (
          <div className="mb-3 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-xs text-slate-500 mb-1">Current Task</p>
            <p className="text-sm text-slate-300 truncate">{agent.currentTask}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {agent.capabilities.slice(0, 3).map((cap) => (
            <Badge
              key={cap}
              variant="secondary"
              className="text-xs bg-slate-800 text-slate-400 border-none"
            >
              {cap.replace("_", " ")}
            </Badge>
          ))}
        </div>

        <p className="text-xs text-slate-600 mt-3">Active {agent.lastActivity}</p>
      </Card>
    </motion.div>
  );
}
