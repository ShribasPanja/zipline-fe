import { useState, useEffect } from "react";

interface Artifact {
  key: string;
  size: number;
  lastModified: string;
  executionId: string;
  stepName: string;
  fileName: string;
}

interface ArtifactsData {
  executionId: string;
  artifacts: Artifact[];
  total: number;
}

export const useArtifacts = (executionId?: string) => {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArtifacts = async (execId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:3001/api/artifacts/${execId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch artifacts: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setArtifacts(result.data.artifacts || []);
      } else {
        throw new Error(result.message || "Failed to load artifacts");
      }
    } catch (err: any) {
      console.error("Error fetching artifacts:", err);
      setError(err.message);
      setArtifacts([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadArtifact = async (
    executionId: string,
    stepName: string,
    fileName: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/artifacts/${executionId}/${stepName}/${fileName}/download`
      );

      if (!response.ok) {
        throw new Error(`Failed to get download URL: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Open download URL in new tab
        window.open(result.data.downloadUrl, "_blank");
      } else {
        throw new Error(result.message || "Failed to generate download URL");
      }
    } catch (err: any) {
      console.error("Error downloading artifact:", err);
      throw err;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    if (executionId) {
      fetchArtifacts(executionId);
    }
  }, [executionId]);

  return {
    artifacts,
    loading,
    error,
    fetchArtifacts,
    downloadArtifact,
    formatFileSize,
    refetch: () => executionId && fetchArtifacts(executionId),
  };
};
