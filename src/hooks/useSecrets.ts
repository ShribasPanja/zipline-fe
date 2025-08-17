import { useState, useEffect, useCallback } from "react";

export interface RepositorySecret {
  key: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecretInput {
  key: string;
  value: string;
}

export interface SecretsState {
  secrets: RepositorySecret[];
  loading: boolean;
  error: string | null;
}

export const useSecrets = (repoFullName: string) => {
  const [state, setState] = useState<SecretsState>({
    secrets: [],
    loading: false,
    error: null,
  });

  const API_BASE =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const fetchSecrets = useCallback(async () => {
    if (!repoFullName) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `${API_BASE}/api/secrets/repositories/${encodeURIComponent(
          repoFullName
        )}/secrets`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch secrets: ${response.statusText}`);
      }

      const data = await response.json();
      setState((prev) => ({
        ...prev,
        secrets: data.data || [],
        loading: false,
      }));
    } catch (error: unknown) {
      setState((prev) => ({
        ...prev,
        error: (error as Error).message || "Failed to fetch secrets",
        loading: false,
      }));
    }
  }, [repoFullName, API_BASE]);

  const saveSecret = async (key: string, value: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE}/api/secrets/repositories/${encodeURIComponent(
          repoFullName
        )}/secrets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key, value }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save secret");
      }

      await fetchSecrets(); // Refresh the list
      return true;
    } catch (error: unknown) {
      setState((prev) => ({
        ...prev,
        error: (error as Error).message || "Failed to save secret",
      }));
      return false;
    }
  };

  const bulkUpdateSecrets = async (
    secrets: SecretInput[]
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE}/api/secrets/repositories/${encodeURIComponent(
          repoFullName
        )}/secrets`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ secrets }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update secrets");
      }

      await fetchSecrets(); // Refresh the list
      return true;
    } catch (error: unknown) {
      setState((prev) => ({
        ...prev,
        error: (error as Error).message || "Failed to update secrets",
      }));
      return false;
    }
  };

  const deleteSecret = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE}/api/secrets/repositories/${encodeURIComponent(
          repoFullName
        )}/secrets/${encodeURIComponent(key)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete secret");
      }

      await fetchSecrets(); // Refresh the list
      return true;
    } catch (error: unknown) {
      setState((prev) => ({
        ...prev,
        error: (error as Error).message || "Failed to delete secret",
      }));
      return false;
    }
  };

  const validateSecretKey = async (
    key: string
  ): Promise<{ isValid: boolean; message: string }> => {
    try {
      const response = await fetch(
        `${API_BASE}/api/secrets/secrets/validate-key`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to validate key");
      }

      const data = await response.json();
      return {
        isValid: data.data.isValid,
        message: data.data.message,
      };
    } catch (error: unknown) {
      return {
        isValid: false,
        message: (error as Error).message || "Failed to validate key",
      };
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  useEffect(() => {
    fetchSecrets();
  }, [fetchSecrets]);

  return {
    ...state,
    fetchSecrets,
    saveSecret,
    bulkUpdateSecrets,
    deleteSecret,
    validateSecretKey,
    clearError,
  };
};
