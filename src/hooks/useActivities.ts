import { useState, useEffect, useCallback } from "react";

export interface Activity {
  id: string;
  type: "push" | "webhook_setup" | "pipeline_execution";
  timestamp: string;
  repository: {
    name: string;
    full_name: string;
  };
  commit?: {
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
  };
  pusher?: {
    name: string;
    email: string;
  };
  status: "success" | "failed" | "in_progress";
  metadata?: {
    executionId?: string;
    duration?: string | number;
    [key: string]: unknown;
  };
}

export const useActivities = (token: string | null, limit: number = 10) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/activities/recent?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const result = await response.json();
      setActivities(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch activities"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, limit]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const refetch = () => {
    fetchActivities();
  };

  return {
    activities,
    isLoading,
    error,
    refetch,
  };
};
