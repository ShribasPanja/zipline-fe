import { Activity } from "@/hooks/useActivities";
import { Card } from "@/components/ui";

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case "push":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16l-4-4m0 0l4-4m-4 4h18"
              />
            </svg>
          </div>
        );
      case "webhook_setup":
        return (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
        );
      case "pipeline_execution":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        );
    }
  };

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

  const getActivityDescription = () => {
    switch (activity.type) {
      case "push":
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white font-semibold">
                {activity.pusher?.name}
              </span>
              <span className="text-gray-400">pushed to</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activity.repository.name}
              </span>
            </div>
            {activity.commit && (
              <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <code className="text-xs font-mono bg-gray-800 px-2 py-0.5 rounded text-green-400 border border-gray-700">
                      {activity.commit.id.substring(0, 7)}
                    </code>
                  </div>
                </div>
                <p className="text-sm text-gray-300 font-medium mb-2 leading-relaxed">
                  {activity.commit.message}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{activity.commit.author.name}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">
                    {activity.commit.author.email}
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      case "webhook_setup":
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                Webhook configured
              </span>
              <span className="text-gray-400">for</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activity.repository.name}
              </span>
            </div>
            {(activity.metadata?.webhook_url || activity.metadata?.events) && (
              <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800 space-y-2">
                {activity.metadata?.webhook_url && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-medium">Endpoint:</span>
                    <code className="bg-gray-800 px-2 py-0.5 rounded text-green-400 font-mono border border-gray-700 text-xs">
                      {activity.metadata.webhook_url}
                    </code>
                  </div>
                )}
                {activity.metadata?.events && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 font-medium">Events:</span>
                    <div className="flex flex-wrap gap-1">
                      {activity.metadata.events.map(
                        (event: string, index: number) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-800 text-gray-300 border border-gray-700"
                          >
                            {event}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "pipeline_execution":
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Pipeline executed
              </span>
              <span className="text-gray-400">for</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activity.repository.name}
              </span>
            </div>
            {activity.metadata && (
              <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-800">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-500 font-medium">Duration:</span>
                    <span className="text-gray-300">
                      {activity.metadata.duration || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-3 h-3 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-gray-500 font-medium">Status:</span>
                    <span className={getActivityColor()}>
                      {activity.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-gray-400">Activity on</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {activity.repository.name}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="group relative flex items-start space-x-4 p-5 hover:bg-gray-900/30 transition-all duration-200 border-b border-gray-800/50 last:border-b-0">
      <div className="flex-shrink-0 mt-0.5">{getActivityIcon()}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm">{getActivityDescription()}</div>
        <div className="flex items-center gap-3 mt-4">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
              activity.status === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : activity.status === "failed"
                ? "bg-red-500/10 text-red-400 border-red-500/20"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                activity.status === "success"
                  ? "bg-green-400"
                  : activity.status === "failed"
                  ? "bg-red-400"
                  : "bg-yellow-400"
              }`}
            />
            {activity.status}
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">
              {formatTime(activity.timestamp)}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{new Date(activity.timestamp).toLocaleString()}</span>
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
      <Card className="p-0 bg-black/50 backdrop-blur-sm border-red-800/50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-red-800/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/20">
              <svg
                className="w-4 h-4 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Recent Activities
            </h2>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
        <div className="text-center py-16 px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <svg
              className="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-300 mb-2">
            Failed to load activities
          </h3>
          <p className="text-red-400/80 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            {error}
          </p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all duration-200 font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 bg-black/50 backdrop-blur-sm border-gray-800/50 shadow-2xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Recent Activities
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200"
          disabled={isLoading}
        >
          <svg
            className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="min-h-0">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-start space-x-4 p-4 rounded-lg bg-gray-900/30"
              >
                <div className="w-8 h-8 bg-gray-800 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-800 rounded w-2/3 animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-800 rounded-full w-16 animate-pulse"></div>
                    <div className="h-6 bg-gray-800 rounded w-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center border border-gray-700/50">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4 19h6a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              No recent activities
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              Activities will appear here when you push code, configure
              webhooks, or run pipelines
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {activities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentActivities;
