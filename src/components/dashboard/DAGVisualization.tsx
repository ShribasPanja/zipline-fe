"use client";

import { useEffect, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  BackgroundVariant,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

interface DAGVisualizationProps {
  executionId: string;
  onClose: () => void;
}

interface DAGData {
  executionId: string;
  repoName: string;
  nodes: Node[];
  edges: Edge[];
  totalSteps: number;
}

const CustomNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-lg text-green-400 font-mono text-sm min-w-[180px] shadow-lg">
      <div className="font-bold mb-2 text-cyan-400">{data.label}</div>
      <div className="text-gray-400 text-xs mb-1">📦 {data.image}</div>
      {data.dependencies && data.dependencies.length > 0 && (
        <div className="text-blue-400 text-xs mb-1">
          ⚡ depends: {data.dependencies.length}
        </div>
      )}
      {data.commands && data.commands.length > 0 && (
        <div className="text-yellow-400 text-xs">
          🔧 {data.commands.length} commands
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  default: CustomNode,
};

export default function DAGVisualization({
  executionId,
  onClose,
}: DAGVisualizationProps) {
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
          `http://localhost:3001/api/pipeline/dag/${executionId}`
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
      } catch (err: any) {
        console.error("Error fetching DAG data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDAGData();
  }, [executionId, setNodes, setEdges]);

  if (loading) {
    return (
      <div className="bg-black border border-gray-700 rounded-lg mt-3 shadow-lg">
        <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
            <span className="text-sm text-green-400 font-mono">dag_view</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-400">Loading...</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg hover:bg-gray-800 rounded px-2 py-1 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <span className="text-gray-400 font-mono text-sm">
              Loading DAG visualization...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-gray-700 rounded-lg mt-3 shadow-lg">
        <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-sm text-green-400 font-mono">dag_view</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-red-400">Error</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg hover:bg-gray-800 rounded px-2 py-1 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-400 font-mono text-lg mb-4">
              ⚠ Error Loading DAG
            </div>
            <span className="text-gray-400 font-mono text-sm">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!dagData) {
    return null;
  }

  return (
    <div className="bg-black border border-gray-700 rounded-lg mt-3 shadow-lg">
      {/* Terminal Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <span className="text-sm text-green-400 font-mono">dag_view</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-blue-400">{dagData.repoName}</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-400">
            {dagData.totalSteps} steps
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg hover:bg-gray-800 rounded px-2 py-1 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* DAG Visualization */}
      <div className="h-96 bg-black overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 40,
            includeHiddenNodes: false,
            maxZoom: 1.0,
          }}
          className="bg-black"
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          minZoom={0.3}
          maxZoom={1.5}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
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
        </ReactFlow>
      </div>

      {/* Command Line Footer */}
      <div className="bg-gray-950 border-t border-gray-700 px-4 py-2">
        <span className="text-xs text-gray-500 font-mono">
          $ pipeline dag --execution-id {executionId} --interactive
        </span>
      </div>
    </div>
  );
}
