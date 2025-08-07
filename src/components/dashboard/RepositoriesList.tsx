import { GitHubRepository } from "@/types";
import { Button, LoadingSpinner } from "@/components/ui";
import RepositoryCard from "./RepositoryCard";
import { useWebhookStatuses } from "@/hooks";

interface RepositoriesListProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  token: string | null;
}

const RepositoriesList = ({
  repositories,
  isLoading,
  error,
  onRefresh,
  token,
}: RepositoriesListProps) => {
  const repoFullNames = repositories.map((repo) => repo.full_name);
  const {
    webhookStatuses,
    isLoading: webhooksLoading,
    error: webhooksError,
    refetch: refetchWebhooks,
    updateWebhookStatus,
  } = useWebhookStatuses(token, repoFullNames);

  const handleRefresh = () => {
    onRefresh();
    refetchWebhooks();
  };

  const handleWebhookStatusChange = (
    repoFullName: string,
    enabled: boolean
  ) => {
    updateWebhookStatus(repoFullName, enabled);
  };
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Repositories</h2>
        <Button onClick={handleRefresh} disabled={isLoading || webhooksLoading}>
          {isLoading || webhooksLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {webhooksError && (
        <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded text-yellow-400 text-sm">
          <p>
            Warning: Could not load webhook statuses. Some CI/CD status
            indicators may be incorrect.
          </p>
          <button
            onClick={() => refetchWebhooks()}
            className="mt-1 text-yellow-300 underline hover:no-underline"
          >
            Retry loading webhook statuses
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner text="Loading repositories..." />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <Button
            variant="danger"
            size="sm"
            onClick={onRefresh}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      ) : repositories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {repositories.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repository={repo}
              token={token}
              webhookEnabled={webhookStatuses[repo.full_name] || false}
              onWebhookStatusChange={handleWebhookStatusChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No repositories found.</p>
        </div>
      )}
    </div>
  );
};

export default RepositoriesList;
