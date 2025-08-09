"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface PipelineLog {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  step?: string;
  timestamp: string;
}

interface PipelineRun {
  id: string;
  executionId: string;
  status: "pending" | "running" | "success" | "failed";
  repoName: string;
  repoUrl: string;
  branch?: string;
  triggerCommit?: string;
  triggerAuthorName?: string;
  triggerAuthorEmail?: string;
  startedAt: string;
  completedAt?: string;
  logs: PipelineLog[];
}

export default function LogsPage() {
  const params = useParams();
  const router = useRouter();
  const executionId = params.executionId as string;

  const [pipelineRun, setPipelineRun] = useState<PipelineRun | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3001/api/pipeline/executions/${executionId}/logs`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch logs: ${response.status}`);
        }

        const data = await response.json();
        setPipelineRun(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch logs");
      } finally {
        setIsLoading(false);
      }
    };

    if (executionId) {
      fetchLogs();
    }
  }, [executionId]);

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-400";
      case "warn":
        return "text-yellow-400";
      case "info":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      case "running":
        return "text-yellow-400";
      case "pending":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toISOString().replace("T", " ").substring(0, 19);
  };

  const formatDuration = (start: string, end?: string) => {
    if (!end) return "ongoing";
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const duration = Math.round((endTime - startTime) / 1000);
    return `${duration}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-2xl mb-4">⟳</div>
          <div>Loading pipeline logs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">✗</div>
          <div className="mb-4">Error: {error}</div>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            ← back
          </button>
        </div>
      </div>
    );
  }

  if (!pipelineRun) {
    return (
      <div className="min-h-screen bg-black text-yellow-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">⚠</div>
          <div className="mb-4">Pipeline execution not found</div>
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-green-400 transition-colors"
          >
            ← back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="max-w-full mx-auto">
        {/* Terminal Header */}
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              ← back
            </button>
            <span className="text-gray-500">|</span>
            <span className="text-green-400">
              zipline@pipeline:~/{pipelineRun.repoName}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {formatTimestamp(pipelineRun.startedAt)} |{" "}
            {formatDuration(pipelineRun.startedAt, pipelineRun.completedAt)}
          </div>
        </div>

        {/* Pipeline Status Bar */}
        <div className="bg-gray-950 border-b border-gray-800 px-4 py-3">
          <div className="flex items-center gap-6 text-sm">
            <span className="text-gray-500">EXECUTION:</span>
            <span className="text-white">{pipelineRun.executionId}</span>
            <span className="text-gray-500">STATUS:</span>
            <span className={getStatusColor(pipelineRun.status)}>
              [{pipelineRun.status.toUpperCase()}]
            </span>
            <span className="text-gray-500">REPO:</span>
            <span className="text-blue-400">{pipelineRun.repoName}</span>
            <span className="text-gray-500">BRANCH:</span>
            <span className="text-yellow-400">
              {pipelineRun.branch || "main"}
            </span>
            {pipelineRun.triggerAuthorName && (
              <>
                <span className="text-gray-500">AUTHOR:</span>
                <span className="text-cyan-400">
                  {pipelineRun.triggerAuthorName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Terminal Log Output */}
        <div className="p-4 bg-black min-h-[600px]">
          <div className="text-green-400 mb-4">
            === Pipeline Execution Log Stream ===
          </div>

          {pipelineRun.logs.length === 0 ? (
            <div className="text-gray-500 italic">
              [INFO] No logs available for this execution
            </div>
          ) : (
            <div className="space-y-1">
              {pipelineRun.logs.map((log, index) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 text-sm leading-6"
                >
                  <span className="text-gray-600 w-20 flex-shrink-0">
                    {formatTimestamp(log.timestamp).split(" ")[1]}
                  </span>
                  <span
                    className={`w-16 flex-shrink-0 ${getLogLevelColor(
                      log.level
                    )}`}
                  >
                    [{log.level.toUpperCase()}]
                  </span>
                  {log.step && (
                    <span className="text-purple-400 w-20 flex-shrink-0">
                      [{log.step}]
                    </span>
                  )}
                  <span className="text-gray-300 flex-1 font-mono">
                    {log.message}
                  </span>
                </div>
              ))}

              {/* End marker */}
              <div className="flex items-start gap-3 text-sm leading-6 mt-4 pt-2 border-t border-gray-800">
                <span className="text-gray-600 w-20 flex-shrink-0">
                  {pipelineRun.completedAt
                    ? formatTimestamp(pipelineRun.completedAt).split(" ")[1]
                    : "ongoing"}
                </span>
                <span
                  className={`w-16 flex-shrink-0 ${getStatusColor(
                    pipelineRun.status
                  )}`}
                >
                  [END]
                </span>
                <span className="text-gray-300 flex-1 font-mono">
                  Pipeline execution{" "}
                  {pipelineRun.status === "success"
                    ? "completed successfully"
                    : pipelineRun.status === "failed"
                    ? "failed"
                    : pipelineRun.status === "running"
                    ? "in progress..."
                    : "queued"}
                  {pipelineRun.completedAt &&
                    ` (duration: ${formatDuration(
                      pipelineRun.startedAt,
                      pipelineRun.completedAt
                    )})`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Terminal Footer */}
        <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>
              Lines: {pipelineRun.logs.length} | Execution:{" "}
              {pipelineRun.executionId}
            </span>
            <span>Zipline CI/CD Pipeline Logs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
