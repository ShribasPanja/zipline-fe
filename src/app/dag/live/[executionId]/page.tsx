"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  BackgroundVariant,
  Panel,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSocket } from "@/hooks";
import { usePipelineControl } from "@/hooks/usePipelineControl";
import { ArtifactsList } from "@/components/artifacts";
import {
  SpinnerIcon,
  CheckIcon,
  XIcon,
  CircleIcon,
  PackageIcon,
  BoltIcon,
  WrenchIcon,
  CheckCircleIcon,
  XCircleIcon,
  StopIcon,
  RefreshIcon,
  ClockIcon,
} from "@/components/icons";

interface DAGData {
  executionId: string;
  repoName: string;
  branch: string;
  nodes: Node[];
  edges: Edge[];
  totalSteps: number;
  pipelineConfig: {
    steps: Array<{
      name: string;
      image: string;
      depends_on: string[];
      run: string[];
    }>;
  };
  stats: {
    totalSteps: number;
    maxLevel: number;
    rootSteps: number;
    leafSteps: number;
    totalDependencies: number;
  };
}

interface StepStatus {
  [stepName: string]: {
    status: "pending" | "running" | "success" | "failed";
    startTime?: string;
    endTime?: string;
    logs?: Array<{
      id: string;
      level: string;
      message: string;
      timestamp: string;
    }>;
  };
}

const CustomLiveNode = ({ data }: { data: any }) => {
  const [expanded, setExpanded] = useState(false);

  // Get node status from data
  const status = data.status || "pending";

  // Define colors based on status
  const getNodeStyles = () => {
    switch (status) {
      case "running":
        return {
          bg: "bg-blue-900",
          border: "border-blue-400",
          text: "text-blue-400",
          icon: <SpinnerIcon className="w-5 h-5" />,
          animate: "animate-pulse",
        };
      case "success":
        return {
          bg: "bg-green-900",
          border: "border-green-400",
          text: "text-green-400",
          icon: <CheckIcon className="w-5 h-5" />,
          animate: "",
        };
      case "failed":
        return {
          bg: "bg-red-900",
          border: "border-red-400",
          text: "text-red-400",
          icon: <XIcon className="w-5 h-5" />,
          animate: "",
        };
      default: // pending
        return {
          bg: "bg-gray-900",
          border: "border-gray-600",
          text: "text-gray-400",
          icon: <CircleIcon className="w-5 h-5" />,
          animate: "",
        };
    }
  };

  const styles = getNodeStyles();

  return (
    <div
      className={`px-5 py-4 ${styles.bg} border-2 ${styles.border} rounded-lg ${styles.text} font-mono text-sm min-w-[280px] shadow-xl hover:shadow-2xl transition-all duration-200 ${styles.animate}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`font-bold ${styles.text} truncate flex-1 pr-2 flex items-center gap-2`}
        >
          <span className="flex-shrink-0">{styles.icon}</span>
          {data.label}
        </div>
        {data.commands && data.commands.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-yellow-400 hover:text-yellow-300 px-2 py-1 rounded hover:bg-gray-800"
          >
            {expanded ? "−" : "+"}
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-gray-400 text-xs flex items-center">
          <PackageIcon className="w-4 h-4 mr-2" />
          <span className="truncate">{data.image}</span>
        </div>

        {data.dependencies && data.dependencies.length > 0 && (
          <div className="text-blue-400 text-xs flex items-center">
            <BoltIcon className="w-4 h-4 mr-2" />
            <span>depends: {data.dependencies.length}</span>
          </div>
        )}

        {data.commands && data.commands.length > 0 && (
          <div className="text-yellow-400 text-xs flex items-center">
            <WrenchIcon className="w-4 h-4 mr-2" />
            <span>{data.commands.length} commands</span>
          </div>
        )}

        {/* Status and timing info */}
        <div className="flex flex-wrap gap-1 text-xs">
          <span
            className={`${styles.bg} ${styles.text} px-2 py-1 rounded border ${styles.border}`}
          >
            {status.toUpperCase()}
          </span>
          {data.isRoot && (
            <span className="bg-blue-900 text-blue-400 px-2 py-1 rounded border border-blue-600">
              START
            </span>
          )}
          {data.isLeaf && (
            <span className="bg-purple-900 text-purple-400 px-2 py-1 rounded border border-purple-600">
              END
            </span>
          )}
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded border border-gray-600">
            L{data.level}
          </span>
        </div>

        {/* Running indicator */}
        {status === "running" && (
          <div className="bg-blue-950 border border-blue-600 rounded p-2">
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
              <span>Executing...</span>
            </div>
          </div>
        )}

        {/* Timing info */}
        {data.stepStatus &&
          (data.stepStatus.metadata?.startTime ||
            data.stepStatus.metadata?.endTime) && (
            <div className="text-xs text-gray-500 space-y-1">
              {data.stepStatus.metadata?.startTime && (
                <div>
                  Started:{" "}
                  {new Date(
                    data.stepStatus.metadata.startTime
                  ).toLocaleTimeString()}
                </div>
              )}
              {data.stepStatus.metadata?.endTime && (
                <div>
                  Ended:{" "}
                  {new Date(
                    data.stepStatus.metadata.endTime
                  ).toLocaleTimeString()}
                </div>
              )}
              {data.stepStatus.metadata?.duration && (
                <div>Duration: {data.stepStatus.metadata.duration}ms</div>
              )}
            </div>
          )}

        {expanded && data.commands && data.commands.length > 0 && (
          <div className="mt-3 p-3 bg-black rounded border border-gray-600">
            <div className="text-xs text-gray-500 mb-2">Commands:</div>
            {data.commands.slice(0, 3).map((cmd: string, idx: number) => (
              <div
                key={idx}
                className="text-xs text-gray-300 font-mono truncate mb-1"
              >
                $ {cmd}
              </div>
            ))}
            {data.commands.length > 3 && (
              <div className="text-xs text-gray-500">
                ... +{data.commands.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  default: CustomLiveNode,
};

export default function LiveDAGPage() {
  const params = useParams();
  const router = useRouter();
  const executionId = params.executionId as string;

  const [dagData, setDagData] = useState<DAGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState<
    "cancel" | "rerun" | null
  >(null);
  const [actionMessage, setActionMessage] = useState<
    string | React.ReactNode | null
  >(null);

  // Use socket for real-time updates
  const { isConnected, logs, status, stepStatuses } = useSocket(executionId);

  // Use pipeline control hook
  const {
    loading: controlLoading,
    error: controlError,
    cancelPipeline,
    rerunPipeline,
    clearError: clearControlError,
  } = usePipelineControl();

  // Check if any steps are currently running or pending
  const hasActiveSteps =
    stepStatuses &&
    Object.values(stepStatuses).some(
      (stepStatus) =>
        stepStatus.status === "running" || stepStatus.status === "pending"
    );

  // Calculate overall pipeline status based on step statuses if socket status is not available
  const getOverallPipelineStatus = () => {
    // If we have socket status, use it
    if (status?.status) {
      return status.status;
    }

    // If no step statuses yet, assume pending
    if (!stepStatuses || Object.keys(stepStatuses).length === 0) {
      return "pending";
    }

    const stepStatusArray = Object.values(stepStatuses);
    const totalSteps = stepStatusArray.length;

    // Check if any steps are running
    if (stepStatusArray.some((s) => s.status === "running")) {
      return "running";
    }

    // Check if any steps failed
    if (stepStatusArray.some((s) => s.status === "failed")) {
      return "failed";
    }

    // Check if all steps completed successfully
    if (stepStatusArray.every((s) => s.status === "success")) {
      return "success";
    }

    // If we have some steps but none are running and not all are complete, assume running
    if (stepStatusArray.some((s) => s.status === "pending")) {
      return "running"; // Pipeline is actively working through pending steps
    }

    return "pending";
  };

  const overallStatus = getOverallPipelineStatus();
  const isPipelineRunning =
    overallStatus === "running" || overallStatus === "pending";
  const isPipelineCompleted =
    overallStatus === "success" || overallStatus === "failed";

  // Show cancel button if:
  // 1. Pipeline status indicates running/pending, OR
  // 2. Any individual steps are active, OR
  // 3. Status is not yet loaded and pipeline is not completed (fallback)
  const shouldShowCancelButton =
    isPipelineRunning || hasActiveSteps || (!status && !isPipelineCompleted);

  const handleCancelPipeline = async () => {
    setShowConfirmDialog(null);
    const result = await cancelPipeline(executionId);
    if (result.success) {
      setActionMessage(
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4 text-green-400" />
          <span>{result.message}</span>
        </div>
      );
      setTimeout(() => setActionMessage(null), 5000);
    } else {
      setActionMessage(
        <div className="flex items-center gap-2">
          <XCircleIcon className="w-4 h-4 text-red-400" />
          <span>{result.message}</span>
        </div>
      );
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const handleRerunPipeline = async () => {
    setShowConfirmDialog(null);
    const result = await rerunPipeline(executionId);
    if (result.success) {
      setActionMessage(
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="w-4 h-4 text-green-400" />
          <span>{result.message}</span>
        </div>
      );
      if (result.data?.newExecutionId) {
        setTimeout(() => {
          router.push(`/dag/live/${result.data.newExecutionId}`);
        }, 2000);
      }
    } else {
      setActionMessage(
        <div className="flex items-center gap-2">
          <XCircleIcon className="w-4 h-4 text-red-400" />
          <span>{result.message}</span>
        </div>
      );
      setTimeout(() => setActionMessage(null), 5000);
    }
  };

  const ConfirmationDialog = ({
    action,
    onConfirm,
    onCancel,
  }: {
    action: "cancel" | "rerun";
    onConfirm: () => void;
    onCancel: () => void;
  }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-green-400 font-mono mb-4">
          {action === "cancel" ? "Cancel Pipeline" : "Rerun Pipeline"}
        </h3>
        <p className="text-gray-300 font-mono text-sm mb-6">
          {action === "cancel"
            ? "Are you sure you want to cancel this running pipeline? This action cannot be undone."
            : "Are you sure you want to rerun this pipeline? This will create a new execution with the same configuration."}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded font-mono hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={controlLoading}
            className={`px-4 py-2 border rounded font-mono transition-colors ${
              action === "cancel"
                ? "bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30"
                : "bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {controlLoading
              ? "Processing..."
              : action === "cancel"
              ? "Cancel Pipeline"
              : "Rerun Pipeline"}
          </button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchDAGData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/pipeline/dag/${executionId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch DAG data: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setDagData(result.data);
          // Initialize nodes with pending status
          const initialNodes = result.data.nodes.map((node: Node) => ({
            ...node,
            data: {
              ...node.data,
              status: "pending",
              stepStatus: null,
            },
          }));
          setNodes(initialNodes);
          setEdges(result.data.edges);
        } else {
          throw new Error(result.message || "Failed to load DAG data");
        }
      } catch (err: any) {
        console.error("Error fetching DAG data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (executionId) {
      fetchDAGData();
    }
  }, [executionId, setNodes, setEdges]);

  // Update node statuses based on socket step statuses
  useEffect(() => {
    if (!stepStatuses || Object.keys(stepStatuses).length === 0) return;

    // Update nodes with socket-provided step statuses
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        const stepStatus = stepStatuses[node.id];
        if (stepStatus) {
          return {
            ...node,
            data: {
              ...node.data,
              status: stepStatus.status,
              stepStatus: stepStatus,
            },
          };
        }
        return node;
      })
    );
  }, [stepStatuses, setNodes]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl mb-2">Loading Live DAG Visualization</div>
          <div className="text-sm text-gray-400">
            Connecting to real-time pipeline execution...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠</div>
          <div className="text-xl mb-4 text-red-400">
            Error Loading Live DAG
          </div>
          <div className="text-sm text-gray-400 mb-6">{error}</div>
          <button
            onClick={() => router.back()}
            className="text-green-400 hover:text-green-300 border border-green-400/30 px-4 py-2 rounded font-mono"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!dagData) {
    return null;
  }

  return (
    <div className="h-screen bg-black text-green-400 font-mono flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            ></div>
            <span className="text-lg font-bold">Live DAG Visualization</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Action Message */}
          {actionMessage && (
            <div className="text-sm font-mono px-3 py-1 rounded bg-gray-800 border border-gray-600">
              {actionMessage}
            </div>
          )}

          {/* Debug Info - Remove in production */}
          {/* {process.env.NODE_ENV === "development" && (
            <div className="text-xs font-mono px-2 py-1 rounded bg-gray-900 border border-gray-500 text-gray-400">
              Socket Status: {status?.status || "null"} | Overall:{" "}
              {overallStatus} | Active Steps: {hasActiveSteps ? "yes" : "no"} |
              Show Cancel: {shouldShowCancelButton ? "yes" : "no"}
            </div>
          )} */}

          {/* Pipeline Control Buttons */}
          <div className="flex items-center gap-2">
            {shouldShowCancelButton && (
              <button
                onClick={() => setShowConfirmDialog("cancel")}
                disabled={controlLoading}
                className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-500/30 rounded font-mono text-sm hover:bg-red-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {controlLoading ? (
                  <ClockIcon className="w-4 h-4" />
                ) : (
                  <StopIcon className="w-4 h-4" />
                )}{" "}
                Cancel
              </button>
            )}

            <button
              onClick={() => setShowConfirmDialog("rerun")}
              disabled={controlLoading}
              className="px-3 py-1 bg-green-600/20 text-green-400 border border-green-500/30 rounded font-mono text-sm hover:bg-green-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {controlLoading ? (
                <ClockIcon className="w-4 h-4" />
              ) : (
                <RefreshIcon className="w-4 h-4" />
              )}{" "}
              Rerun
            </button>
          </div>

          {/* Pipeline Info */}
          <div className="flex items-center gap-4 text-sm border-l border-gray-600 pl-4">
            <span className="text-blue-400">{dagData.repoName}</span>
            <span className="text-gray-500">•</span>
            <span className="text-purple-400">{dagData.branch || "main"}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{dagData.totalSteps} steps</span>
            <span className="text-gray-500">•</span>
            <span
              className={`${isConnected ? "text-green-400" : "text-red-400"}`}
            >
              {isConnected ? "LIVE" : "DISCONNECTED"}
            </span>
          </div>
        </div>
      </div>

      {/* DAG Flow */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 80,
            includeHiddenNodes: false,
            maxZoom: 1.0,
          }}
          className="bg-black"
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          minZoom={0.3}
          maxZoom={1.8}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          attributionPosition="bottom-left"
          defaultEdgeOptions={{
            style: {
              strokeWidth: 4,
              stroke: "#22c55e",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#22c55e",
              width: 20,
              height: 20,
            },
          }}
        >
          <Background
            color="#374151"
            size={2}
            className="bg-black opacity-40"
            variant={BackgroundVariant.Dots}
          />
          <Controls
            className="!bg-gray-900 !border-gray-700 [&>button]:!bg-gray-800 [&>button]:!border-gray-600 [&>button]:!text-green-400 [&>button:hover]:!bg-gray-700"
            position="top-left"
          />
          <MiniMap
            nodeColor="#10b981"
            nodeStrokeColor="#374151"
            className="!bg-gray-900 !border-gray-700"
            pannable
            zoomable
            position="bottom-right"
          />

          {/* Live Stats Panel */}
          <Panel
            position="top-right"
            className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm min-w-[200px]"
          >
            <div className="text-green-400 font-bold mb-2 flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
                }`}
              ></div>
              Live Pipeline Stats
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Steps:</span>
                <span className="text-white">
                  {dagData.stats?.totalSteps || dagData.totalSteps}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pending:</span>
                <span className="text-gray-400">
                  {stepStatuses
                    ? Object.values(stepStatuses).filter(
                        (s) => s.status === "pending"
                      ).length
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Running:</span>
                <span className="text-blue-400">
                  {stepStatuses
                    ? Object.values(stepStatuses).filter(
                        (s) => s.status === "running"
                      ).length
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Success:</span>
                <span className="text-green-400">
                  {stepStatuses
                    ? Object.values(stepStatuses).filter(
                        (s) => s.status === "success"
                      ).length
                    : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Failed:</span>
                <span className="text-red-400">
                  {stepStatuses
                    ? Object.values(stepStatuses).filter(
                        (s) => s.status === "failed"
                      ).length
                    : 0}
                </span>
              </div>
              <div className="border-t border-gray-600 pt-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span
                    className={`${
                      overallStatus === "running"
                        ? "text-yellow-400"
                        : overallStatus === "success"
                        ? "text-green-400"
                        : overallStatus === "failed"
                        ? "text-red-400"
                        : overallStatus === "pending"
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {overallStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Connection Status Panel */}
          <Panel
            position="bottom-left"
            className="bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-xs"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <span className="text-gray-400">
                {isConnected
                  ? "Connected to pipeline execution"
                  : "Disconnected from pipeline"}
              </span>
            </div>
            {logs && logs.length > 0 && (
              <div className="text-gray-500 mt-1">
                Latest: {logs[logs.length - 1]?.message?.substring(0, 40)}...
              </div>
            )}
          </Panel>
        </ReactFlow>
      </div>

      {/* Artifacts Section */}
      <div className="bg-gray-950 border-t border-gray-700 p-4">
        <ArtifactsList executionId={executionId} isCollapsed={true} />
      </div>

      {/* Footer */}
      <div className="bg-gray-950 border-t border-gray-700 px-6 py-3 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          $ pipeline dag --execution-id {executionId} --live --real-time
        </span>
        <div className="flex items-center gap-4">
          <span className="text-gray-500">Execution ID: {executionId}</span>
          <span
            className={`${isConnected ? "text-green-400" : "text-red-400"}`}
          >
            {isConnected ? "● LIVE" : "● OFFLINE"}
          </span>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmationDialog
          action={showConfirmDialog}
          onConfirm={
            showConfirmDialog === "cancel"
              ? handleCancelPipeline
              : handleRerunPipeline
          }
          onCancel={() => setShowConfirmDialog(null)}
        />
      )}
    </div>
  );
}
