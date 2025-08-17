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
import { ArtifactsList } from "@/components/artifacts";

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
      needs: string[];
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

interface NodeData {
  label?: string;
  commands?: string[];
  image?: string;
  dependencies?: string[];
  isRoot?: boolean;
  isLeaf?: boolean;
  level?: number;
  status?: string;
}

const CustomNode = ({ data }: { data: NodeData }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-5 py-4 bg-gray-900 border-2 border-gray-700 rounded-lg text-green-400 font-mono text-sm min-w-[280px] shadow-xl hover:shadow-2xl transition-all duration-200 hover:border-gray-600">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-cyan-400 truncate flex-1 pr-2">
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
          <span className="mr-2">📦</span>
          <span className="truncate">{data.image}</span>
        </div>

        {data.dependencies && data.dependencies.length > 0 && (
          <div className="text-blue-400 text-xs flex items-center">
            <span className="mr-2">⚡</span>
            <span>depends: {data.dependencies.length}</span>
          </div>
        )}

        {data.commands && data.commands.length > 0 && (
          <div className="text-yellow-400 text-xs flex items-center">
            <span className="mr-2">🔧</span>
            <span>{data.commands.length} commands</span>
          </div>
        )}

        <div className="flex space-x-2 text-xs">
          {data.isRoot && (
            <span className="bg-blue-900 text-blue-400 px-2 py-1 rounded">
              START
            </span>
          )}
          {data.isLeaf && (
            <span className="bg-red-900 text-red-400 px-2 py-1 rounded">
              END
            </span>
          )}
          <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded">
            L{data.level}
          </span>
        </div>

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
  default: CustomNode,
};

export default function DAGPage() {
  const params = useParams();
  const router = useRouter();
  const executionId = params.executionId as string;

  const [dagData, setDagData] = useState<DAGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const fetchDAGData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pipeline/dag/${executionId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch DAG data: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setDagData(result.data);
          setNodes(result.data.nodes);
          setEdges(result.data.edges);
        } else {
          throw new Error(result.message || "Failed to load DAG data");
        }
      } catch (err: unknown) {
        console.error("Error fetching DAG data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (executionId) {
      fetchDAGData();
    }
  }, [executionId, setNodes, setEdges]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-xl mb-2">Loading DAG Visualization</div>
          <div className="text-sm text-gray-400">
            Reading pipeline configuration...
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
          <div className="text-xl mb-4 text-red-400">Error Loading DAG</div>
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
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-lg font-bold">DAG Visualization</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-blue-400">{dagData.repoName}</span>
          <span className="text-gray-500">•</span>
          <span className="text-purple-400">{dagData.branch || "main"}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-400">{dagData.totalSteps} steps</span>
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

          {/* Stats Panel */}
          {dagData.stats && (
            <Panel
              position="top-right"
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm"
            >
              <div className="text-green-400 font-bold mb-2">
                Pipeline Stats
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Steps:</span>
                  <span className="text-white">{dagData.stats.totalSteps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Levels:</span>
                  <span className="text-white">
                    {dagData.stats.maxLevel + 1}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Root Steps:</span>
                  <span className="text-blue-400">
                    {dagData.stats.rootSteps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">End Steps:</span>
                  <span className="text-red-400">
                    {dagData.stats.leafSteps}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dependencies:</span>
                  <span className="text-yellow-400">
                    {dagData.stats.totalDependencies}
                  </span>
                </div>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>

      {/* Artifacts Section */}
      <div className="bg-gray-950 border-t border-gray-700 p-4">
        <ArtifactsList executionId={executionId} isCollapsed={true} />
      </div>

      {/* Footer */}
      <div className="bg-gray-950 border-t border-gray-700 px-6 py-3 flex items-center justify-between text-xs">
        <span className="text-gray-500">
          $ pipeline dag --execution-id {executionId} --interactive
          --full-screen
        </span>
        <span className="text-gray-500">Execution ID: {executionId}</span>
      </div>
    </div>
  );
}
