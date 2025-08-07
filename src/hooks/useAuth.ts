import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export const useAuth = () => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = searchParams.get("token");

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const windowToken = urlParams.get("token");

      const finalToken = accessToken || windowToken;

      if (finalToken) {
        setToken(finalToken);
        localStorage.setItem("github_token", finalToken);

        // Clean up URL by removing the token parameter
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);
      } else {
        // Check if token exists in localStorage
        const storedToken = localStorage.getItem("github_token");
        if (storedToken) {
          setToken(storedToken);
        }
      }
    }

    setIsLoading(false);
  }, [searchParams]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("github_token");
  };

  return {
    token,
    isLoading,
    logout,
    isAuthenticated: !!token,
  };
};
