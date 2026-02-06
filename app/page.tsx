"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Agent, Task, ChatMessage, Workflow } from "@/lib/types";
import { AgentCard } from "@/components/agent-card";
import { TaskQueue } from "@/components/task-queue";
import { TeamChat } from "@/components/team-chat";
import { WorkflowBuilder } from "@/components/workflow-builder";
import { StatusBar } from "@/components/status-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Zap, 
  MessageSquare, 
  GitBranch, 
  Plus, 
  Activity,
  Sparkles,
  Terminal
} from "lucide-react";

// Demo agents
const initialAgents: Agent[] = [
  {
    id: "echo",
    name: "Echo",
    role: "Research Specialist",
    status: "idle",
    avatar: "🔍",
    capabilities: ["web_search", "data_analysis", "reporting"],
    lastActivity: "2 min ago",
  },
  {
    id: "cipher",
    name: "Cipher",
    role: "Code Developer",
    status: "working",
    avatar: "💻",
    capabilities: ["code_generation", "architecture", "debugging"],
    currentTask: "Building dashboard UI",
    lastActivity: "Just now",
  },
  {
    id: "angel",
    name: "Angel",
    role: "Squad Lead",
    status: "working",
    avatar: "👼",
    capabilities: ["coordination", "strategy", "decision_making"],
    currentTask: "Reviewing hackathon strategy",
    lastActivity: "5 min ago",
  },
  {
    id: "nova",
    name: "Nova",
    role: "Creative Designer",
    status: "idle",
    avatar: "✨",
    capabilities: ["ui_design", "branding", "prototyping"],
    lastActivity: "1 hour ago",
  },
];

const initialTasks: Task[] = [
  { id: "1", title: "Scaffold Next.js project", agentId: "cipher", status: "completed", priority: "high" },
  { id: "2", title: "Design dashboard layout", agentId: "nova", status: "in_progress", priority: "high" },
  { id: "3", title: "Research Gemini 3 API", agentId: "echo", status: "pending", priority: "medium" },
  { id: "4", title: "Record demo video", agentId: "angel", status: "pending", priority: "high" },
];

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newAgentName, setNewAgentName] = useState("");
  const [systemStatus, setSystemStatus] = useState({
    activeAgents: 2,
    pendingTasks: 2,
    completedTasks: 1,
    uptime: "00:15:32",
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) =>
          Math.random() > 0.9
            ? {
                ...agent,
                status: agent.status === "working" ? "idle" : "working",
                currentTask:
                  agent.status === "working" ? undefined : "Processing task...",
              }
            : agent
        )
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addAgent = () => {
    if (!newAgentName) return;
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: newAgentName,
      role: "New Agent",
      status: "idle",
      avatar: "🤖",
      capabilities: ["learning"],
      lastActivity: "Just created",
    };
    setAgents([...agents, newAgent]);
    setNewAgentName("");
  };

  const sendMessage = (content: string, targetAgentId?: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
      targetAgentId,
    };
    setMessages([...messages, newMessage]);

    // Simulate agent response
    setTimeout(() => {
      const agent = targetAgentId
        ? agents.find((a) => a.id === targetAgentId)
        : agents[Math.floor(Math.random() * agents.length)];
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `Roger that! ${agent?.name} here. I'll handle that for you.`,
        sender: "agent",
        agentId: agent?.id,
        agentName: agent?.name,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Agent Mission Control
              </h1>
              <p className="text-xs text-slate-500">Powered by Gemini 3 • DnA Inc</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBar status={systemStatus} />
            <Button
              size="sm"
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gemini 3
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-800/50 p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-slate-800">
              <Activity className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="workflows" className="data-[state=active]:bg-slate-800">
              <GitBranch className="w-4 h-4 mr-2" />
              Workflows
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-slate-800">
              <MessageSquare className="w-4 h-4 mr-2" />
              Team Chat
            </TabsTrigger>
            <TabsTrigger value="terminal" className="data-[state=active]:bg-slate-800">
              <Terminal className="w-4 h-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
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
                Add Agent
              </Button>
            </div>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </AnimatePresence>
            </div>

            {/* Task Queue */}
            <TaskQueue tasks={tasks} agents={agents} />
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows">
            <WorkflowBuilder agents={agents} />
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <TeamChat
              messages={messages}
              agents={agents}
              onSendMessage={sendMessage}
            />
          </TabsContent>

          {/* Terminal/Logs Tab */}
          <TabsContent value="terminal">
            <div className="bg-slate-950 border border-slate-800/50 rounded-xl p-4 font-mono text-sm">
              <div className="text-slate-500 mb-2">// System Logs</div>
              <div className="space-y-1 text-slate-400">
                <div><span className="text-green-500">[21:45:12]</span> System initialized successfully</div>
                <div><span className="text-blue-500">[21:45:15]</span> Agent "Echo" connected</div>
                <div><span className="text-blue-500">[21:45:16]</span> Agent "Cipher" connected</div>
                <div><span className="text-blue-500">[21:45:18]</span> Agent "Angel" connected</div>
                <div><span className="text-yellow-500">[21:46:02]</span> Task queue synchronized</div>
                <div><span className="text-violet-500">[21:50:00]</span> Gemini 3 API integration active</div>
                <div className="animate-pulse"><span className="text-green-500">[21:52:33]</span> Building dashboard components...</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
