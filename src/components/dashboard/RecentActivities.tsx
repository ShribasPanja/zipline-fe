import { Activity } from "@/hooks/useActivities";
import { useSocket } from "@/hooks";
import { useState } from "react";

interface ActivityItemProps {
  activity: Activity;
}

interface LiveLogProps {
  executionId: string;
  onClose: () => void;
}

const LiveLogViewer = ({ executionId, onClose }: LiveLogProps) => {
  const { isConnected, logs, status } = useSocket(executionId);

  return (
    <div className="bg-black border border-gray-700 rounded-lg mt-2 max-h-40 overflow-y-auto">
      <div className="bg-gray-900 border-b border-gray-700 px-3 py-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-400" : "bg-red-400"
            }`}
          ></div>
          <span className="text-xs text-green-400 font-mono">live_logs</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-xs"
        >
          ✕
        </button>
      </div>
      <div className="p-2 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-gray-500">
            {isConnected
              ? "[INFO] Waiting for logs..."
              : "[ERROR] Disconnected"}
          </div>
        ) : (
          logs.slice(-5).map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2 text-xs leading-5"
            >
              <span className="text-gray-600 w-16 flex-shrink-0">
                {new Date(log.timestamp)
                  .toISOString()
                  .split("T")[1]
                  .substring(0, 8)}
              </span>
              <span
                className={`w-12 flex-shrink-0 ${
                  log.level === "error"
                    ? "text-red-400"
                    : log.level === "warn"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                [{log.level.toUpperCase()}]
              </span>
              <span className="text-gray-300 flex-1">{log.message}</span>
            </div>
          ))
        )}
        {isConnected && status?.status === "running" && (
          <div className="flex items-center gap-2 mt-1 text-yellow-400">
            <span className="animate-pulse">●</span>
            <span className="text-xs">Pipeline running...</span>
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const [showLiveLogs, setShowLiveLogs] = useState(false);

  const getActivityColor = () => {
    switch (activity.status) {
      case "success":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      case "in_progress":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const formatTime = (timestamp: string) => {
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

  const getTerminalPrefix = () => {
    switch (activity.type) {
      case "push":
        return "git_push";
      case "webhook_setup":
        return "webhook";
      case "pipeline_execution":
        return "pipeline";
      default:
        return "system";
    }
  };

  const getStatusIcon = () => {
    switch (activity.status) {
      case "success":
        return "✓";
      case "failed":
        return "✗";
      case "in_progress":
        return "⟳";
      default:
        return "●";
    }
  };

  return (
    <div className="border-b border-gray-800 last:border-b-0">
      <div className="px-4 py-3 hover:bg-gray-950/50 transition-colors">
        <div className="flex items-start gap-3 text-sm font-mono">
          <span className="text-gray-600 w-16 flex-shrink-0">
            {formatTime(activity.timestamp)}
          </span>
          <span className="text-green-400 w-20 flex-shrink-0">
            [{getTerminalPrefix().toUpperCase()}]
          </span>
          <span className={`w-8 flex-shrink-0 ${getActivityColor()}`}>
            {getStatusIcon()}
          </span>
          <div className="flex-1">
            <div className="text-gray-300 mb-1">
              {activity.type === "push" && (
                <>
                  <span className="text-cyan-400">{activity.pusher?.name}</span>
                  <span className="text-gray-500"> pushed to </span>
                  <span className="text-blue-400">
                    {activity.repository.name}
                  </span>
                  {activity.commit && (
                    <span className="text-gray-500">
                      {" "}
                      - {activity.commit.message.substring(0, 50)}...
                    </span>
                  )}
                </>
              )}
              {activity.type === "webhook_setup" && (
                <>
                  <span className="text-green-400">Webhook configured</span>
                  <span className="text-gray-500"> for </span>
                  <span className="text-blue-400">
                    {activity.repository.name}
                  </span>
                </>
              )}
              {activity.type === "pipeline_execution" && (
                <>
                  <span className="text-purple-400">Pipeline executed</span>
                  <span className="text-gray-500"> for </span>
                  <span className="text-blue-400">
                    {activity.repository.name}
                  </span>
                  {activity.metadata?.duration && (
                    <span className="text-gray-500">
                      {" "}
                      - {activity.metadata.duration}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Live logs for in-progress pipelines */}
            {activity.type === "pipeline_execution" &&
              activity.status === "in_progress" &&
              activity.metadata?.executionId && (
                <div className="mt-2">
                  <div className="flex gap-2 mb-2">
                    {!showLiveLogs ? (
                      <button
                        onClick={() => setShowLiveLogs(true)}
                        className="text-xs text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 px-2 py-1 rounded font-mono"
                      >
                        show_live_logs
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowLiveLogs(false)}
                        className="text-xs text-yellow-600 hover:text-yellow-500 border border-yellow-600/30 px-2 py-1 rounded font-mono"
                      >
                        hide_live_logs
                      </button>
                    )}
                    <button
                      onClick={() => {
                        window.open(
                          `/dag/live/${activity.metadata?.executionId}`,
                          "_blank"
                        );
                      }}
                      className="text-xs text-orange-400 hover:text-orange-300 border border-orange-400/30 px-2 py-1 rounded font-mono"
                    >
                      view_live_dag
                    </button>
                  </div>
                  {showLiveLogs && (
                    <LiveLogViewer
                      executionId={activity.metadata.executionId}
                      onClose={() => setShowLiveLogs(false)}
                    />
                  )}
                </div>
              )}

            {/* View logs button for completed pipelines */}
            {activity.type === "pipeline_execution" &&
              activity.status !== "in_progress" &&
              activity.metadata?.executionId && (
                <div className="mt-2">
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => {
                        window.open(
                          `/logs/${activity.metadata?.executionId}`,
                          "_blank"
                        );
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 border border-purple-400/30 px-2 py-1 rounded font-mono"
                    >
                      view_logs
                    </button>
                    <button
                      onClick={() => {
                        window.open(
                          `/dag/${activity.metadata?.executionId}`,
                          "_blank"
                        );
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-2 py-1 rounded font-mono"
                    >
                      view_dag
                    </button>
                    <button
                      onClick={() => {
                        window.open(
                          `/artifacts/${activity.metadata?.executionId}`,
                          "_blank"
                        );
                      }}
                      className="text-xs text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 px-2 py-1 rounded font-mono"
                    >
                      view_artifacts
                    </button>
                    {/* <button
                      onClick={() => setShowArtifacts(!showArtifacts)}
                      className="text-xs text-orange-400 hover:text-orange-300 border border-orange-400/30 px-2 py-1 rounded font-mono"
                    >
                      {showArtifacts ? "hide_inline" : "show_inline"}
                    </button> */}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface RecentActivitiesProps {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const RecentActivities = ({
  activities,
  isLoading,
  error,
  onRefresh,
}: RecentActivitiesProps) => {
  if (error) {
    return (
      <div className="bg-black border border-gray-800 rounded-lg font-mono">
        <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
          <span className="text-red-400">
            zipline@dashboard:~/activities [ERROR]
          </span>
          <button
            onClick={onRefresh}
            className="text-gray-400 hover:text-green-400 transition-colors"
            title="Refresh"
          >
            ⟳
          </button>
        </div>
        <div className="p-4 text-center">
          <div className="text-red-400 text-sm mb-2">
            ✗ Failed to load activities
          </div>
          <div className="text-gray-500 text-xs mb-4">{error}</div>
          <button
            onClick={onRefresh}
            className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1 rounded font-mono"
          >
            retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-gray-800 rounded-lg font-mono">
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex items-center justify-between">
        <span className="text-green-400">zipline@dashboard:~/activities</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="text-gray-400 hover:text-green-400 transition-colors"
            title="Refresh"
            disabled={isLoading}
          >
            {isLoading ? "⟳" : "↻"}
          </button>
        </div>
      </div>

      <div className="min-h-[300px] max-h-[400px] overflow-y-auto">
        <div className="p-4">
          <div className="text-green-400 mb-4 text-sm">
            === Recent Activity Log ===
          </div>

          {isLoading ? (
            <div className="text-gray-500 text-sm">
              [INFO] Loading activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-gray-500 text-sm">
              [INFO] No recent activities found
            </div>
          ) : (
            <div className="space-y-0">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>
            Activities: {activities.length} | Last updated:{" "}
            {new Date().toLocaleTimeString()}
          </span>
          <span>Zipline Activity Monitor</span>
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
