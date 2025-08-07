import { useState, useEffect, useCallback } from "react";
import { GitHubRepository } from "@/types";

export const useGitHubRepositories = (token: string | null) => {
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepositories = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/repositories", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status}`);
      }

      const result = await response.json();

      // The backend returns { success: true, data: repositories }
      if (result.success && result.data) {
        setRepositories(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch repositories");
      }
    } catch (error) {
      console.error("Error fetching repositories:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch repositories"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchRepositories();
    }
  }, [token, fetchRepositories]);

  return {
    repositories,
    isLoading,
    error,
    refetch: fetchRepositories,
  };
};
