import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

interface PipelineLog {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  step?: string;
  timestamp: string;
}

interface PipelineStatus {
  status: "pending" | "running" | "success" | "failed";
  metadata?: Record<string, unknown>;
  timestamp: string;
}

interface StepStatus {
  stepName: string;
  status: "pending" | "running" | "success" | "failed";
  metadata?: {
    startTime?: string;
    endTime?: string;
    duration?: number;
    error?: string;
  };
  timestamp: string;
}

export const useSocket = (executionId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<PipelineLog[]>([]);
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [stepStatuses, setStepStatuses] = useState<{
    [stepName: string]: StepStatus;
  }>({});
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(`${process.env.NEXT_PUBLIC_BACKEND_URL}`, {
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("[SOCKET] Connected to server");
      setIsConnected(true);
      reconnectAttempts.current = 0;

      // Join pipeline room if executionId is provided
      if (executionId) {
        newSocket.emit("join-pipeline", executionId);
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("[SOCKET] Disconnected from server:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("[SOCKET] Connection error:", error.message);
      reconnectAttempts.current++;
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log(`[SOCKET] Reconnected after ${attemptNumber} attempts`);
      if (executionId) {
        newSocket.emit("join-pipeline", executionId);
      }
    });

    newSocket.on("reconnect_failed", () => {
      console.error("[SOCKET] Failed to reconnect after maximum attempts");
    });

    // Pipeline-specific event handlers
    newSocket.on("joined-pipeline", (data: { executionId: string }) => {
      console.log(`[SOCKET] Joined pipeline room: ${data.executionId}`);
    });

    newSocket.on("pipeline-log", (logData: PipelineLog) => {
      console.log("[SOCKET] Received pipeline log:", logData);
      setLogs((prevLogs) => [...prevLogs, logData]);
    });

    newSocket.on("pipeline-status", (statusData: PipelineStatus) => {
      console.log("[SOCKET] Received pipeline status:", statusData);
      setStatus(statusData);
    });

    newSocket.on("step-status", (stepStatusData: StepStatus) => {
      console.log("[SOCKET] Received step status:", stepStatusData);
      setStepStatuses((prevStatuses) => ({
        ...prevStatuses,
        [stepStatusData.stepName]: stepStatusData,
      }));
    });

    setSocket(newSocket);

    return () => {
      if (executionId) {
        newSocket.emit("leave-pipeline", executionId);
      }
      newSocket.close();
    };
  }, [executionId]);

  const clearLogs = () => {
    setLogs([]);
    setStepStatuses({});
  };

  const joinPipeline = (newExecutionId: string) => {
    if (socket && isConnected) {
      socket.emit("join-pipeline", newExecutionId);
      clearLogs(); // Clear previous logs when joining new pipeline
    }
  };

  const leavePipeline = (executionIdToLeave: string) => {
    if (socket && isConnected) {
      socket.emit("leave-pipeline", executionIdToLeave);
    }
  };

  return {
    socket,
    isConnected,
    logs,
    status,
    stepStatuses,
    clearLogs,
    joinPipeline,
    leavePipeline,
    connectionAttempts: reconnectAttempts.current,
    maxAttempts: maxReconnectAttempts,
  };
};
