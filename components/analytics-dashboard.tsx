"use client";

import { motion } from "framer-motion";
import { Agent, Task } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Zap,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface AnalyticsDashboardProps {
  agents: Agent[];
  tasks: Task[];
}

const COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

// Generate sample trend data
const generateTrendData = () => [
  { time: "00:00", tasks: 12, agents: 3, efficiency: 85 },
  { time: "04:00", tasks: 8, agents: 2, efficiency: 78 },
  { time: "08:00", tasks: 24, agents: 4, efficiency: 92 },
  { time: "12:00", tasks: 32, agents: 4, efficiency: 88 },
  { time: "16:00", tasks: 28, agents: 4, efficiency: 90 },
  { time: "20:00", tasks: 18, agents: 3, efficiency: 86 },
];

const generateAgentPerformance = (agents: Agent[]) => {
  return agents.map((agent, i) => ({
    name: agent.name,
    tasks: Math.floor(Math.random() * 50) + 10,
    efficiency: Math.floor(Math.random() * 30) + 70,
    avatar: agent.avatar,
    color: COLORS[i % COLORS.length],
  }));
};

const generateTaskDistribution = (tasks: Task[]) => {
  const status = { pending: 0, in_progress: 0, completed: 0, failed: 0 };
  tasks.forEach((t) => status[t.status]++);
  return [
    { name: "Completed", value: status.completed, color: "#10b981" },
    { name: "In Progress", value: status.in_progress, color: "#8b5cf6" },
    { name: "Pending", value: status.pending, color: "#f59e0b" },
    { name: "Failed", value: status.failed, color: "#ef4444" },
  ].filter((d) => d.value > 0);
};

export function AnalyticsDashboard({ agents, tasks }: AnalyticsDashboardProps) {
  const trendData = generateTrendData();
  const agentPerformance = generateAgentPerformance(agents);
  const taskDistribution = generateTaskDistribution(tasks);
  
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const activeAgents = agents.filter((a) => a.status === "working").length;
  const avgEfficiency = Math.round(agentPerformance.reduce((acc, a) => acc + a.efficiency, 0) / agentPerformance.length);
  const systemHealth = Math.round((completedTasks / (tasks.length || 1)) * 100);

  const stats = [
    { 
      label: "Active Agents", 
      value: activeAgents, 
      total: agents.length,
      icon: Users, 
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      trend: "+2 this hour"
    },
    { 
      label: "Tasks Completed", 
      value: completedTasks, 
      total: tasks.length,
      icon: CheckCircle2, 
      color: "text-green-400",
      bg: "bg-green-500/10",
      trend: "+8 today"
    },
    { 
      label: "Avg Efficiency", 
      value: `${avgEfficiency}%`, 
      icon: Target, 
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      trend: "+5% vs yesterday"
    },
    { 
      label: "System Health", 
      value: `${systemHealth}%`, 
      icon: Activity, 
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      trend: "Optimal"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  {stat.total && (
                    <span className="text-sm text-slate-500">/ {stat.total}</span>
                  )}
                </div>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                <h3 className="font-semibold text-white">Task Velocity</h3>
              </div>
              <Badge variant="secondary" className="bg-violet-500/20 text-violet-300">
                Last 24h
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#0f172a", 
                      border: "1px solid #1e293b",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorTasks)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Agent Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Agent Performance</h3>
              </div>
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">
                Tasks Completed
              </Badge>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis type="number" stroke="#475569" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={60} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#0f172a", 
                      border: "1px solid #1e293b",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Bar dataKey="tasks" radius={[0, 4, 4, 0]}>
                    {agentPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Task Distribution</h3>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#0f172a", 
                      border: "1px solid #1e293b",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {taskDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-400">{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* System Efficiency Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                <h3 className="font-semibold text-white">System Efficiency</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-xs text-slate-400">Efficiency %</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400">Active Agents</span>
                </div>
              </div>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#475569" fontSize={12} />
                  <YAxis stroke="#475569" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#0f172a", 
                      border: "1px solid #1e293b",
                      borderRadius: "8px"
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="agents" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
