import {
  PipelineExecution,
  PipelineExecutionStats,
} from "@/hooks/usePipelineExecutions";
import { Card, LoadingSpinner } from "@/components/ui";

interface PipelineExecutionsListProps {
  executions: PipelineExecution[];
  stats: PipelineExecutionStats | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export const PipelineExecutionsList = ({
  executions,
  isLoading,
  error,
  onRefresh,
}: PipelineExecutionsListProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <Card className="p-6 bg-black">
        <LoadingSpinner text="Loading pipeline executions..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="text-red-400 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-400 mb-4">{error}</div>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Terminal-style Stats */}
      {/* {stats && (
        <div className="bg-black border border-gray-800 rounded-lg font-mono">
          <div className="bg-gray-900 border-b border-gray-800 px-4 py-2">
            <span className="text-green-400">zipline@dashboard:~/stats</span>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">TOTAL_EXECUTIONS</div>
              <div className="text-xl font-bold text-green-400">
                {stats.total}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">SUCCESS_RATE</div>
              <div className="text-xl font-bold text-green-400">
                {stats.successRate}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">SUCCESSFUL</div>
              <div className="text-xl font-bold text-green-400">
                {stats.successful}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">FAILED</div>
              <div className="text-xl font-bold text-red-400">
                {stats.failed}
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Terminal-style Executions List */}
      <div className="bg-black border border-gray-800 rounded-lg font-mono">
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
          <span className="text-green-400">
            zipline@dashboard:~/my-pipeline-history
          </span>
          <button
            onClick={onRefresh}
            className="text-gray-400 hover:text-green-400 transition-colors"
            title="Refresh"
          >
            ⟳
          </button>
        </div>

        <div className="p-4">
          <div className="text-green-400 mb-4 text-sm">
            === My Pipeline Execution History ===
          </div>

          {executions.length === 0 ? (
            <div className="text-gray-500 text-sm">
              [INFO] No pipeline executions found for your account
            </div>
          ) : (
            <div className="space-y-2">
              {executions.map((execution) => (
                <div
                  key={execution.id}
                  className="flex items-center gap-4 text-sm py-2 border-b border-gray-900 last:border-b-0 hover:bg-gray-950/50 transition-colors"
                >
                  <span className="text-gray-600 w-16 flex-shrink-0">
                    {formatTimestamp(execution.startedAt)}
                  </span>
                  <span
                    className={`w-26 flex-shrink-0 ${
                      execution.status === "success"
                        ? "text-green-400"
                        : execution.status === "failed"
                        ? "text-red-400"
                        : execution.status === "in_progress"
                        ? "text-yellow-400"
                        : "text-gray-400"
                    }`}
                  >
                    [{execution.status.toUpperCase()}]
                  </span>
                  <span className="text-blue-400 w-32 flex-shrink-0">
                    {execution.repoName}
                  </span>
                  <span className="text-yellow-400 w-20 flex-shrink-0">
                    {execution.branch || "main"}
                  </span>
                  {execution.triggerAuthorName && (
                    <span className="text-cyan-400 w-24 flex-shrink-0">
                      {execution.triggerAuthorName}
                    </span>
                  )}
                  {execution.duration && (
                    <span className="text-purple-400 w-16 flex-shrink-0">
                      {execution.duration}
                    </span>
                  )}
                  <div className="flex-1"></div>
                  <button
                    onClick={() => {
                      window.open(`/logs/${execution.executionId}`, "_blank");
                    }}
                    className="text-gray-400 hover:text-green-400 transition-colors text-xs px-2 py-1 border border-gray-700 rounded hover:border-green-400"
                  >
                    view_logs
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>
              Entries: {executions.length} | Last updated:{" "}
              {new Date().toLocaleTimeString()}
            </span>
            <span>My Pipeline History</span>
          </div>
        </div>
      </div>
    </div>
  );
};
