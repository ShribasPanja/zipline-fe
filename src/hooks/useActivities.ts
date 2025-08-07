import { useState, useEffect } from "react";

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
  metadata?: Record<string, any>;
}

export const useActivities = (token: string | null, limit: number = 10) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/activities/recent?limit=${limit}`,
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
  };

  useEffect(() => {
    fetchActivities();
  }, [token, limit]);

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
