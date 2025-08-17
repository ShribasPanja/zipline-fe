import { useState, useEffect, useCallback, useRef } from "react";

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
  const previousRepositoriesRef = useRef<string>("");

  const fetchWebhookStatuses = useCallback(
    async (repoList: string[]) => {
      if (!token || repoList.length === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        const repoParams = repoList.join(",");

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_BACKEND_URL
          }/api/repositories/webhook-status?repositories=${encodeURIComponent(
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
          err instanceof Error
            ? err.message
            : "Failed to fetch webhook statuses"
        );
        console.error("Error fetching webhook statuses:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [token] // Only depend on token
  );

  const checkSingleRepository = async (
    repoFullName: string
  ): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/repositories/webhook-status?repoFullName=${encodeURIComponent(
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
    // Create a stable string representation of repositories to compare
    const currentRepositoriesString = repositories.sort().join(",");

    // Only fetch if repositories have actually changed and we have a token
    if (
      token &&
      repositories.length > 0 &&
      currentRepositoriesString !== previousRepositoriesRef.current
    ) {
      previousRepositoriesRef.current = currentRepositoriesString;
      fetchWebhookStatuses(repositories);
    }
  }, [token, repositories, fetchWebhookStatuses]);

  const refetch = (repoList?: string[]) => {
    const reposToUse = repoList || repositories;
    if (reposToUse.length > 0) {
      fetchWebhookStatuses(reposToUse);
    }
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
