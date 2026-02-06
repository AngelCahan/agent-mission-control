"use client";

import { Task, Agent } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

interface TaskQueueProps {
  tasks: Task[];
  agents: Agent[];
}

const priorityColors = {
  low: "bg-slate-600",
  medium: "bg-blue-600",
  high: "bg-amber-600",
  critical: "bg-red-600",
};

const statusIcons = {
  pending: Clock,
  in_progress: Loader2,
  completed: CheckCircle2,
  failed: AlertTriangle,
};

export function TaskQueue({ tasks, agents }: TaskQueueProps) {
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const progress = (completedCount / tasks.length) * 100;

  return (
    <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Task Queue</h3>
          <p className="text-sm text-slate-400">{tasks.length} tasks • {completedCount} completed</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
          <p className="text-xs text-slate-500">Complete</p>
        </div>
      </div>

      <Progress value={progress} className="mb-6 h-2" />

      <div className="space-y-3">
        {tasks.map((task) => {
          const agent = agents.find((a) => a.id === task.agentId);
          const StatusIcon = statusIcons[task.status];

          return (
            <div
              key={task.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/30 hover:border-slate-600 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
              
              <StatusIcon
                className={`w-4 h-4 ${
                  task.status === "in_progress" ? "animate-spin text-violet-400" : "text-slate-500"
                }`}
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{task.title}</p>
                <p className="text-xs text-slate-500">
                  {agent ? `Assigned to ${agent.name}` : "Unassigned"}
                </p>
              </div>

              <Badge
                variant="outline"
                className={`text-xs capitalize ${
                  task.status === "completed"
                    ? "border-green-500/30 text-green-400"
                    : task.status === "in_progress"
                    ? "border-violet-500/30 text-violet-400"
                    : "border-slate-600 text-slate-400"
                }`}
              >
                {task.status.replace("_", " ")}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
