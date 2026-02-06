"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Agent, Task, ChatMessage, Workflow } from "@/lib/types";
import { AgentCard } from "@/components/agent-card";
import { TaskQueue } from "@/components/task-queue";
import { TeamChat } from "@/components/team-chat";
import { WorkflowBuilder } from "@/components/workflow-builder";
import { StatusBar } from "@/components/status-bar";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { ActivityFeed } from "@/components/activity-feed";
import { LiveTerminal } from "@/components/live-terminal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Zap, 
  MessageSquare, 
  GitBranch, 
  Plus, 
  Activity,
  Sparkles,
  Terminal,
  BarChart3,
  Radio,
  Cpu,
  Wifi,
  Menu,
  X
} from "lucide-react";

// Demo agents with more detail
const initialAgents: Agent[] = [
  {
    id: "echo",
    name: "Echo",
    role: "Research Specialist",
    status: "idle",
    avatar: "🔍",
    capabilities: ["web_search", "data_analysis", "reporting", "fact_checking"],
    lastActivity: "2 min ago",
  },
  {
    id: "cipher",
    name: "Cipher",
    role: "Code Developer",
    status: "working",
    avatar: "💻",
    capabilities: ["code_generation", "architecture", "debugging", "refactoring"],
    currentTask: "Building dashboard UI components",
    lastActivity: "Just now",
  },
  {
    id: "angel",
    name: "Angel",
    role: "Squad Lead",
    status: "working",
    avatar: "👼",
    capabilities: ["coordination", "strategy", "decision_making", "conflict_resolution"],
    currentTask: "Reviewing hackathon strategy",
    lastActivity: "5 min ago",
  },
  {
    id: "nova",
    name: "Nova",
    role: "Creative Designer",
    status: "working",
    avatar: "✨",
    capabilities: ["ui_design", "branding", "prototyping", "animation"],
    currentTask: "Creating visual assets",
    lastActivity: "1 hour ago",
  },
];

const initialTasks: Task[] = [
  { id: "1", title: "Scaffold Next.js project", agentId: "cipher", status: "completed", priority: "high" },
  { id: "2", title: "Design dashboard layout", agentId: "nova", status: "in_progress", priority: "high" },
  { id: "3", title: "Research Gemini 3 API", agentId: "echo", status: "completed", priority: "medium" },
  { id: "4", title: "Record demo video", agentId: "angel", status: "pending", priority: "high" },
  { id: "5", title: "Write documentation", agentId: "echo", status: "in_progress", priority: "medium" },
  { id: "6", title: "Optimize performance", agentId: "cipher", status: "pending", priority: "medium" },
];

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newAgentName, setNewAgentName] = useState("");
  const [uptime, setUptime] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const systemStatus = {
    activeAgents: agents.filter(a => a.status === "working").length,
    pendingTasks: tasks.filter(t => t.status === "pending").length,
    completedTasks: tasks.filter(t => t.status === "completed").length,
    uptime: formatUptime(uptime),
  };

  // Format uptime
  function formatUptime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Uptime counter
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate real-time agent updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          // Random status changes
          if (Math.random() > 0.85) {
            const statuses: Array<"idle" | "working" | "error" | "offline"> = ["idle", "working", "error", "offline"];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            return {
              ...agent,
              status: newStatus,
              currentTask: newStatus === "working" ? getRandomTask() : undefined,
              lastActivity: "Just now",
            };
          }
          return agent;
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getRandomTask = () => {
    const tasks = [
      "Processing data...",
      "Analyzing request...",
      "Generating response...",
      "Syncing with API...",
      "Compiling results...",
      "Optimizing performance...",
    ];
    return tasks[Math.floor(Math.random() * tasks.length)];
  };

  const addAgent = () => {
    if (!newAgentName) return;
    const avatars = ["🤖", "🎯", "🚀", "💡", "🔧", "📊", "🎨", "⚡"];
    const roles = ["Specialist", "Analyst", "Coordinator", "Developer", "Researcher"];
    
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: "idle",
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      capabilities: ["learning", "adaptation"],
      lastActivity: "Just created",
    };
    setAgents([...agents, newAgent]);
    setNewAgentName("");
  };

  const sendMessage = useCallback((content: string, targetAgentId?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
      targetAgentId,
    };
    setMessages((prev) => [...prev, newMessage]);

    // Simulate agent response with typing delay
    setTimeout(() => {
      const agent = targetAgentId
        ? agents.find((a) => a.id === targetAgentId)
        : agents[Math.floor(Math.random() * agents.length)];
      
      const responses = [
        `Roger that! ${agent?.name} here. I'll handle that for you. 💪`,
        `Copy that! Working on it now. Give me a moment... ⚡`,
        `Got it! ${agent?.name} reporting for duty. 🫡`,
        `Affirmative! Processing your request... 🔄`,
        `On it! This should take just a few moments. ⏱️`,
      ];
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: "agent",
        agentId: agent?.id,
        agentName: agent?.name,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, response]);
    }, 800 + Math.random() * 1000);
  }, [agents]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25"
              >
                <Bot className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  Agent Mission Control
                </h1>
                <p className="text-xs text-slate-500">Powered by Gemini 3 • DnA Inc</p>
              </div>
            </div>

            {/* Desktop Status */}
            <div className="hidden lg:flex items-center gap-4">
              <StatusBar status={systemStatus} />
              <Button
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-500/20"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Gemini 3
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mt-4 pt-4 border-t border-slate-800/50"
              >
                <StatusBar status={systemStatus} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          {/* Tabs Navigation */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1 inline-flex w-auto min-w-full sm:w-auto">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-800 whitespace-nowrap">
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800 whitespace-nowrap">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="workflows" className="data-[state=active]:bg-slate-800 whitespace-nowrap">
                <GitBranch className="w-4 h-4 mr-2" />
                Workflows
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-slate-800 whitespace-nowrap">
                <MessageSquare className="w-4 h-4 mr-2" />
                Team Chat
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-slate-800 whitespace-nowrap">
                <Terminal className="w-4 h-4 mr-2" />
                Logs
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Agents & Tasks */}
              <div className="xl:col-span-2 space-y-6">
                {/* Add Agent Bar */}
                <div className="flex gap-3">
                  <Input
                    placeholder="Create new agent..."
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAgent()}
                    className="bg-slate-900/50 border-slate-800/50 max-w-sm"
                  />
                  <Button onClick={addAgent} variant="outline" className="border-slate-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Agent Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {agents.map((agent, index) => (
                      <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <AgentCard agent={agent} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Task Queue */}
                <TaskQueue tasks={tasks} agents={agents} />
              </div>

              {/* Right Column - Activity Feed */}
              <div className="xl:col-span-1">
                <ActivityFeed agents={agents} tasks={tasks} />
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard agents={agents} tasks={tasks} />
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows">
            <WorkflowBuilder agents={agents} />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <div className="max-w-4xl mx-auto">
              <TeamChat
                messages={messages}
                agents={agents}
                onSendMessage={sendMessage}
              />
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <div className="max-w-6xl mx-auto">
              <LiveTerminal />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12 py-6">
        <div className="max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © 2026 DnA Inc • Built for Gemini 3 Hackathon
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Wifi className="w-3 h-3" />
              <span>Connected</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Cpu className="w-3 h-3" />
              <span>{systemStatus.uptime}</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
