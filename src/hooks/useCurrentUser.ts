import { useState, useEffect, useCallback } from "react";
import { GitHubUser } from "@/types";

export const useCurrentUser = (token: string | null) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setUser(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch user info"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
      setError(null);
    }
  }, [token, fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
};
