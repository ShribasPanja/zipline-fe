import { useState, useEffect } from "react";

export interface WebhookStatuses {
  [repoFullName: string]: boolean;
}

export const useWebhookStatuses = (
  token: string | null,
  repositories: string[] = []
) => {
  const [webhookStatuses, setWebhookStatuses] = useState<WebhookStatuses>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWebhookStatuses = async (repoList?: string[]) => {
    if (!token || (!repoList && repositories.length === 0)) return;

    setIsLoading(true);
    setError(null);

    try {
      const reposToCheck = repoList || repositories;
      const repoParams = reposToCheck.join(",");

      const response = await fetch(
        `http://localhost:3001/api/repositories/webhook-status?repositories=${encodeURIComponent(
          repoParams
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch webhook statuses");
      }

      const result = await response.json();
      setWebhookStatuses(result.data || {});
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch webhook statuses"
      );
      console.error("Error fetching webhook statuses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSingleRepository = async (
    repoFullName: string
  ): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(
        `http://localhost:3001/api/repositories/webhook-status?repoFullName=${encodeURIComponent(
          repoFullName
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check webhook status");
      }

      const result = await response.json();
      const hasWebhook = result.data[repoFullName] || false;

      // Update local state
      setWebhookStatuses((prev) => ({
        ...prev,
        [repoFullName]: hasWebhook,
      }));

      return hasWebhook;
    } catch (err) {
      console.error(`Error checking webhook status for ${repoFullName}:`, err);
      return false;
    }
  };

  const updateWebhookStatus = (repoFullName: string, enabled: boolean) => {
    setWebhookStatuses((prev) => ({
      ...prev,
      [repoFullName]: enabled,
    }));
  };

  useEffect(() => {
    if (repositories.length > 0) {
      fetchWebhookStatuses();
    }
  }, [token, repositories.join(",")]);

  const refetch = (repoList?: string[]) => {
    fetchWebhookStatuses(repoList);
  };

  return {
    webhookStatuses,
    isLoading,
    error,
    refetch,
    checkSingleRepository,
    updateWebhookStatus,
  };
};
