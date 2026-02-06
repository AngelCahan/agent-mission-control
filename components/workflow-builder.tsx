"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Agent, Workflow } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";

interface WorkflowBuilderProps {
  agents: Agent[];
}

const sampleWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Content Creation Pipeline",
    status: "active",
    steps: [
      { id: "s1", agentId: "echo", action: "Research topic", input: "AI trends 2024" },
      { id: "s2", agentId: "cipher", action: "Generate outline", input: "Research findings" },
      { id: "s3", agentId: "nova", action: "Create visuals", input: "Outline" },
    ],
  },
  {
    id: "2",
    name: "Code Review Workflow",
    status: "draft",
    steps: [
      { id: "s1", agentId: "cipher", action: "Analyze code", input: "Pull request" },
      { id: "s2", agentId: "angel", action: "Review strategy", input: "Analysis" },
    ],
  },
];

export function WorkflowBuilder({ agents }: WorkflowBuilderProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [newWorkflowName, setNewWorkflowName] = useState("");

  const createWorkflow = () => {
    if (!newWorkflowName) return;
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflowName,
      status: "draft",
      steps: [],
    };
    setWorkflows([...workflows, newWorkflow]);
    setNewWorkflowName("");
    setSelectedWorkflow(newWorkflow);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Workflow List */}
      <Card className="p-4 bg-slate-900/50 backdrop-blur-sm border-slate-800/50 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Workflows</h3>
          <Badge variant="secondary" className="bg-slate-800">
            {workflows.length}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {workflows.map((workflow) => (
            <button
              key={workflow.id}
              onClick={() => setSelectedWorkflow(workflow)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedWorkflow?.id === workflow.id
                  ? "bg-violet-600/20 border border-violet-500/30"
                  : "bg-slate-800/50 hover:bg-slate-800 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-white text-sm">{workflow.name}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    workflow.status === "active"
                      ? "border-green-500/30 text-green-400"
                      : workflow.status === "draft"
                      ? "border-slate-600 text-slate-400"
                      : "border-violet-500/30 text-violet-400"
                  }`}
                >
                  {workflow.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1">{workflow.steps.length} steps</p>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="New workflow name..."
            value={newWorkflowName}
            onChange={(e) => setNewWorkflowName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createWorkflow()}
            className="bg-slate-800/50 border-slate-700 text-sm"
          />
          <Button onClick={createWorkflow} size="icon" variant="outline" className="border-slate-700">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Workflow Editor */}
      <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800/50 lg:col-span-2">
        {selectedWorkflow ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedWorkflow.name}</h3>
                <p className="text-sm text-slate-400">Drag agents to build your workflow</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-slate-700">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                {selectedWorkflow.status === "active" ? (
                  <Button variant="outline" size="sm" className="border-amber-700 text-amber-400">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button size="sm" className="bg-green-600 hover:bg-green-500">
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                )}
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-4">
              {selectedWorkflow.steps.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl">
                  <GitBranch className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <p className="text-slate-500">No steps yet</p>
                  <p className="text-sm text-slate-600">Add agents to build your workflow</p>
                </div>
              ) : (
                selectedWorkflow.steps.map((step, index) => {
                  const agent = agents.find((a) => a.id === step.agentId);
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="text-2xl">{agent?.avatar || "🤖"}</div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{step.action}</p>
                          <p className="text-sm text-slate-400">
                            {agent?.name} • Input: {step.input}
                          </p>
                        </div>
                        <Zap className="w-4 h-4 text-violet-400" />
                      </div>
                      
                      {index < selectedWorkflow.steps.length - 1 && (
                        <div className="flex justify-center py-2">
                          <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Available Agents */}
            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <p className="text-sm text-slate-500 mb-3">Available Agents</p>
              <div className="flex flex-wrap gap-2">
                {agents.map((agent) => (
                  <Button
                    key={agent.id}
                    variant="outline"
                    size="sm"
                    className="border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/10"
                  >
                    <span className="mr-2">{agent.avatar}</span>
                    {agent.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Workflow Builder</h3>
              <p className="text-slate-400 max-w-sm">
                Create multi-agent workflows by chaining tasks together. 
                Select a workflow to edit or create a new one.
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
