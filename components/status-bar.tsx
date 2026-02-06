"use client";

import { motion } from "framer-motion";
import { Activity, CheckCircle2, Clock, Zap } from "lucide-react";

interface StatusBarProps {
  status: {
    activeAgents: number;
    pendingTasks: number;
    completedTasks: number;
    uptime: string;
  };
}

export function StatusBar({ status }: StatusBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 text-sm"
    >
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-green-400" />
          <span className="text-slate-400">Active:</span>
          <span className="text-white font-medium">{status.activeAgents}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-slate-400">Pending:</span>
          <span className="text-white font-medium">{status.pendingTasks}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-400">Done:</span>
          <span className="text-white font-medium">{status.completedTasks}</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-slate-400">Uptime:</span>
          <span className="text-white font-mono">{status.uptime}</span>
        </div>
      </div>
    </motion.div>
  );
}
