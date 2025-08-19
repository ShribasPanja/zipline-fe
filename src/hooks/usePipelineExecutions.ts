import { useState, useEffect, useCallback } from "react";

export interface PipelineExecution {
  id: string;
  executionId: string;
  repoName: string;
  repoUrl: string;
  branch?: string;
  status: "queued" | "in_progress" | "success" | "failed";
  triggerCommit?: string;
  triggerAuthorName?: string;
  triggerAuthorEmail?: string;
  startedAt: string;
  completedAt?: string;
  duration?: string;
}

export interface PipelineExecutionStats {
  total: number;
  successful: number;
  failed: number;
  inProgress: number;
  successRate: number;
}

export const usePipelineExecutions = (
  repoName?: string,
  limit: number = 50,
  token?: string | null
) => {
  const [executions, setExecutions] = useState<PipelineExecution[]>([]);
  const [stats, setStats] = useState<PipelineExecutionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExecutions = useCallback(async () => {
    // Don't fetch if no token is available
    if (!token) {
      setExecutions([]);
      setStats(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (repoName) params.append("repoName", repoName);
      if (limit) params.append("limit", limit.toString());

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL
        }/api/pipeline/executions?${params.toString()}`,
        {
          headers,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pipeline executions");
      }

      const data = await response.json();
      setExecutions(data.data.executions || []);
      setStats(data.data.stats || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch executions"
      );
      setExecutions([]);
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [repoName, limit, token]);

  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);

  const refetch = () => {
    fetchExecutions();
  };

  return {
    executions,
    stats,
    isLoading,
    error,
    refetch,
  };
};
