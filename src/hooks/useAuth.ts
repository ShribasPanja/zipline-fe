import { useState, useEffect } from "react";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get token from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");

      if (urlToken) {
        setToken(urlToken);
        localStorage.setItem("github_token", urlToken);

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
  }, []); // Empty dependency array - only run once on mount

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
