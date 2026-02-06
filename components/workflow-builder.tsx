"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Agent, Workflow, WorkflowStep } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GitBranch, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw,
  ArrowRight,
  Sparkles,
  Zap,
  Trash2,
  GripVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  Save,
  X
} from "lucide-react";

interface WorkflowBuilderProps {
  agents: Agent[];
}

const sampleWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Content Creation Pipeline",
    status: "completed",
    steps: [
      { id: "s1", agentId: "echo", action: "Research topic", input: "AI trends 2024", output: "Research findings compiled" },
      { id: "s2", agentId: "cipher", action: "Generate outline", input: "Research findings", output: "Outline created" },
      { id: "s3", agentId: "nova", action: "Create visuals", input: "Outline", output: "Visuals generated" },
    ],
  },
  {
    id: "2",
    name: "Code Review Workflow",
    status: "active",
    steps: [
      { id: "s1", agentId: "cipher", action: "Analyze code", input: "Pull request #42", output: "Analysis complete" },
      { id: "s2", agentId: "angel", action: "Review strategy", input: "Code analysis", output: "Pending..." },
    ],
  },
];

export function WorkflowBuilder({ agents }: WorkflowBuilderProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>(sampleWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionProgress, setExecutionProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStepAction, setNewStepAction] = useState("");
  const [newStepAgent, setNewStepAgent] = useState("");
  const [newStepInput, setNewStepInput] = useState("");

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

  const addStep = () => {
    if (!selectedWorkflow || !newStepAction || !newStepAgent) return;
    
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      agentId: newStepAgent,
      action: newStepAction,
      input: newStepInput || "Previous step output",
    };
    
    const updated = {
      ...selectedWorkflow,
      steps: [...selectedWorkflow.steps, newStep],
    };
    
    setSelectedWorkflow(updated);
    setWorkflows(workflows.map((w) => (w.id === updated.id ? updated : w)));
    
    // Reset form
    setNewStepAction("");
    setNewStepAgent("");
    setNewStepInput("");
    setShowAddStep(false);
  };

  const removeStep = (stepId: string) => {
    if (!selectedWorkflow) return;
    const updated = {
      ...selectedWorkflow,
      steps: selectedWorkflow.steps.filter((s) => s.id !== stepId),
    };
    setSelectedWorkflow(updated);
    setWorkflows(workflows.map((w) => (w.id === updated.id ? updated : w)));
  };

  const executeWorkflow = async () => {
    if (!selectedWorkflow || selectedWorkflow.steps.length === 0) return;
    
    setIsExecuting(true);
    setCurrentStep(0);
    setExecutionProgress(0);
    
    // Update status to active
    const updated = { ...selectedWorkflow, status: "active" as const };
    setSelectedWorkflow(updated);
    setWorkflows(workflows.map((w) => (w.id === updated.id ? updated : w)));

    // Simulate step-by-step execution
    for (let i = 0; i < selectedWorkflow.steps.length; i++) {
      setCurrentStep(i);
      const progress = ((i + 1) / selectedWorkflow.steps.length) * 100;
      setExecutionProgress(progress);
      
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // Mark as completed
    const completed = { 
      ...selectedWorkflow, 
      status: "completed" as const,
      steps: selectedWorkflow.steps.map((s, i) => ({
        ...s,
        output: s.output || `Step ${i + 1} completed successfully`,
      }))
    };
    setSelectedWorkflow(completed);
    setWorkflows(workflows.map((w) => (w.id === completed.id ? completed : w)));
    
    setIsExecuting(false);
    setCurrentStep(0);
  };

  const resetWorkflow = () => {
    if (!selectedWorkflow) return;
    const reset = { ...selectedWorkflow, status: "draft" as const };
    setSelectedWorkflow(reset);
    setWorkflows(workflows.map((w) => (w.id === reset.id ? reset : w)));
    setExecutionProgress(0);
    setCurrentStep(0);
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter((w) => w.id !== id));
    if (selectedWorkflow?.id === id) {
      setSelectedWorkflow(null);
    }
  };

  const getStatusIcon = (status: Workflow["status"]) => {
    switch (status) {
      case "active":
        return <Zap className="w-4 h-4 text-violet-400 animate-pulse" />;
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case "paused":
        return <Pause className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: Workflow["status"]) => {
    switch (status) {
      case "active":
        return "border-violet-500/30 text-violet-400";
      case "completed":
        return "border-green-500/30 text-green-400";
      case "paused":
        return "border-amber-500/30 text-amber-400";
      default:
        return "border-slate-600 text-slate-400";
    }
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

        <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {workflows.map((workflow) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group relative"
              >
                <button
                  onClick={() => setSelectedWorkflow(workflow)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedWorkflow?.id === workflow.id
                      ? "bg-violet-600/20 border border-violet-500/30"
                      : "bg-slate-800/50 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(workflow.status)}
                      <span className="font-medium text-white text-sm truncate">{workflow.name}</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(workflow.status)}`}
                    >
                      {workflow.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500">{workflow.steps.length} steps</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">
                      {workflow.steps.filter((s) => s.output).length} completed
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
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
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-white">{selectedWorkflow.name}</h3>
                  {isExecuting && (
                    <Badge className="bg-violet-500/20 text-violet-300 animate-pulse">
                      Executing...
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {isExecuting 
                    ? `Running step ${currentStep + 1} of ${selectedWorkflow.steps.length}`
                    : "Build your workflow by adding agent steps below"
                  }
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={resetWorkflow}
                  disabled={isExecuting}
                  className="border-slate-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                
                {isExecuting ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-amber-700 text-amber-400"
                    onClick={() => setIsExecuting(false)}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={executeWorkflow}
                    disabled={selectedWorkflow.steps.length === 0}
                    className="bg-green-600 hover:bg-green-500 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Workflow
                  </Button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            {isExecuting && (
              <div className="mb-6">
                <Progress value={executionProgress} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>{Math.round(executionProgress)}% complete</span>
                  <span>Step {currentStep + 1} of {selectedWorkflow.steps.length}</span>
                </div>
              </div>
            )}

            {/* Workflow Steps */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {selectedWorkflow.steps.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 border-2 border-dashed border-slate-800 rounded-xl"
                  >
                    <GitBranch className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-slate-500 font-medium">No steps yet</p>
                    <p className="text-sm text-slate-600 mt-1">Add agents to build your workflow</p>
                  </motion.div>
                ) : (
                  selectedWorkflow.steps.map((step, index) => {
                    const agent = agents.find((a) => a.id === step.agentId);
                    const isActive = isExecuting && currentStep === index;
                    const isCompleted = step.output || (isExecuting && currentStep > index);
                    
                    return (
                      <motion.div
                        key={step.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative"
                      >
                        <div 
                          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                            isActive 
                              ? "bg-violet-600/10 border-violet-500/30 shadow-lg shadow-violet-500/10" 
                              : isCompleted
                              ? "bg-green-500/5 border-green-500/20"
                              : "bg-slate-800/50 border-slate-700/50"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div 
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                isActive 
                                  ? "bg-violet-600 text-white animate-pulse" 
                                  : isCompleted
                                  ? "bg-green-600 text-white"
                                  : "bg-slate-700 text-slate-400"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            {index < selectedWorkflow.steps.length - 1 && (
                              <div className={`w-0.5 h-6 ${isCompleted ? "bg-green-500/30" : "bg-slate-700"}`} />
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{agent?.avatar || "🤖"}</div>
                              <div>
                                <p className="font-medium text-white">{step.action}</p>
                                <p className="text-sm text-slate-400">
                                  {agent?.name} • Input: {step.input}
                                </p>
                              </div>
                            </div>
                            
                            {step.output && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-2 p-2 rounded-lg bg-slate-900/50 border border-slate-700/50"
                              >
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Output: {step.output}
                                </p>
                              </motion.div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {isActive && (
                              <Zap className="w-5 h-5 text-violet-400 animate-pulse" />
                            )}
                            <button
                              onClick={() => removeStep(step.id)}
                              disabled={isExecuting}
                              className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Add Step Form */}
            <div className="mt-6 pt-6 border-t border-slate-800/50">
              {!showAddStep ? (
                <Button
                  variant="outline"
                  onClick={() => setShowAddStep(true)}
                  disabled={isExecuting}
                  className="w-full border-dashed border-slate-700 hover:border-violet-500/50 hover:bg-violet-500/5"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Workflow Step
                </Button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">Add New Step</span>
                    <button
                      onClick={() => setShowAddStep(false)}
                      className="p-1 rounded hover:bg-slate-700 text-slate-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Input
                      placeholder="Action name..."
                      value={newStepAction}
                      onChange={(e) => setNewStepAction(e.target.value)}
                      className="bg-slate-900/50 border-slate-700"
                    />
                    <select
                      value={newStepAgent}
                      onChange={(e) => setNewStepAgent(e.target.value)}
                      className="bg-slate-900/50 border border-slate-700 rounded-md px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                    >
                      <option value="">Select agent...</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.avatar} {agent.name}
                        </option>
                      ))}
                    </select>
                    
                    <Input
                      placeholder="Input data..."
                      value={newStepInput}
                      onChange={(e) => setNewStepInput(e.target.value)}
                      className="bg-slate-900/50 border-slate-700"
                    />
                  </div>
                  
                  <Button 
                    onClick={addStep}
                    disabled={!newStepAction || !newStepAgent}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-violet-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Workflow Builder</h3>
              <p className="text-slate-400 max-w-sm">
                Create multi-agent workflows by chaining tasks together. 
                Select a workflow to edit or create a new one.
              </p>
            </motion.div>
          </div>
        )}
      </Card>
    </div>
  );
}
