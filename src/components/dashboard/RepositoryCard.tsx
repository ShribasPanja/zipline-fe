import { GitHubRepository } from "@/types";
import { Card, Badge } from "@/components/ui";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface RepositoryCardProps {
  repository: GitHubRepository;
  token: string | null;
  webhookEnabled?: boolean;
  onWebhookStatusChange?: (repoFullName: string, enabled: boolean) => void;
}

const RepositoryCard = ({
  repository: repo,
  token,
  webhookEnabled = false,
  onWebhookStatusChange,
}: RepositoryCardProps) => {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = useState(webhookEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update local state when prop changes
  useEffect(() => {
    setIsEnabled(webhookEnabled);
  }, [webhookEnabled]);

  const setupWebhook = async () => {
    if (!token) {
      setError("No authentication token available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost:3001/api/repositories/setup-webhook",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repoFullName: repo.full_name,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to setup webhook");
      }

      console.log("Webhook setup successful:", result);
      setIsEnabled(true);
      onWebhookStatusChange?.(repo.full_name, true);
    } catch (error) {
      console.error("Error setting up webhook:", error);
      setError(
        error instanceof Error ? error.message : "Failed to setup webhook"
      );
      setIsEnabled(false);
      onWebhookStatusChange?.(repo.full_name, false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async () => {
    if (!isEnabled && !isLoading) {
      // Only setup webhook when enabling (webhooks stay enabled once set up)
      await setupWebhook();
    }
  };

  const handleSettingsClick = () => {
    router.push(`/repositories/${encodeURIComponent(repo.full_name)}/settings`);
  };

  return (
    <Card className="bg-black border-gray-800 text-white hover:border-gray-600">
      {/* Header with repo name and badges */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-xl text-white truncate pr-2">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300 transition-colors"
          >
            {repo.name}
          </a>
        </h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          {repo.private && (
            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
              Private
            </span>
          )}
          {repo.fork && (
            <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
              Fork
            </span>
          )}
          <button
            onClick={handleSettingsClick}
            className="p-1 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded transition-colors"
            title="Repository Settings"
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
          {repo.description}
        </p>
      )}

      {/* Stats section */}
      <div className="mb-4">
        <div className="flex items-center space-x-6 text-sm text-gray-400">
          {repo.language && (
            <span className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
              {repo.language}
            </span>
          )}
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            {repo.stargazers_count}
          </span>
          <span className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 8l3.707-3.707a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            {repo.forks_count}
          </span>
        </div>

        {/* Updated date */}
        <div className="mt-2">
          <span className="text-xs text-gray-500">
            Updated: {new Date(repo.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* CI/CD Pipeline section */}
      <div className="pt-4 border-t border-gray-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">
            CI/CD Pipeline
          </span>
          {isEnabled ? (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400 font-medium">Active</span>
            </div>
          ) : (
            <button
              onClick={handleToggle}
              disabled={isLoading}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                isLoading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
              }`}
            >
              {isLoading ? "Setting up..." : "Enable"}
            </button>
          )}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-xs text-blue-400 flex items-center bg-blue-900/20 px-3 py-2 rounded mb-2">
            <svg
              className="w-3 h-3 mr-2 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Setting up webhook...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-xs text-red-400 flex items-center bg-red-900/20 px-3 py-2 rounded mb-2">
            <svg
              className="w-3 h-3 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            {error}
          </div>
        )}

        {/* Success state */}
        {isEnabled && !isLoading && !error && (
          <div className="text-xs text-green-400 flex items-center bg-green-900/20 px-3 py-2 rounded">
            <svg
              className="w-3 h-3 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            <div>
              <div>
                Webhook configured - CI/CD pipeline will trigger on push
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RepositoryCard;
