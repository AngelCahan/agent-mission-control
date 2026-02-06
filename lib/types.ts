export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "working" | "error" | "offline";
  avatar: string;
  capabilities: string[];
  currentTask?: string;
  lastActivity: string;
}

export interface Task {
  id: string;
  title: string;
  agentId?: string;
  status: "pending" | "in_progress" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  description?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "agent" | "system";
  agentId?: string;
  agentName?: string;
  timestamp: string;
  targetAgentId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  status: "draft" | "active" | "completed" | "paused";
}

export interface WorkflowStep {
  id: string;
  agentId: string;
  action: string;
  input?: string;
  output?: string;
  nextSteps?: string[];
}
