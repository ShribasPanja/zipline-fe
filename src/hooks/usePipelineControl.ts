"use client";

import { useState } from "react";

interface PipelineControlResult {
  success: boolean;
  message: string;
  data?: any;
}

export function usePipelineControl() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const cancelPipeline = async (
    executionId: string
  ): Promise<PipelineControlResult> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE}/api/queue/jobs/${executionId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to cancel pipeline");
      }

      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to cancel pipeline";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const rerunPipeline = async (
    executionId: string
  ): Promise<PipelineControlResult> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE}/api/queue/jobs/${executionId}/rerun`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to rerun pipeline");
      }

      return {
        success: true,
        message: data.message,
        data: data.data,
      };
    } catch (err: any) {
      const errorMessage = err.message || "Failed to rerun pipeline";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    loading,
    error,
    cancelPipeline,
    rerunPipeline,
    clearError,
  };
}
