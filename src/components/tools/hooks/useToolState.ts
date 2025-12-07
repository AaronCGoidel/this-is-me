import { useMemo } from "react";
import { BaseToolInvocation, ToolStatus } from "../types";

/**
 * Custom hook for managing tool state and common operations
 */
export function useToolState(invocation: BaseToolInvocation) {
  // Derive status from invocation state
  const status: ToolStatus = useMemo(() => {
    switch (invocation.state) {
      case "call":
      case "partial-call":
        return "loading";
      case "result":
        // Check if result contains an error
        const result = invocation.result as { error?: string } | undefined;
        return result?.error ? "error" : "success";
      default:
        return "idle";
    }
  }, [invocation.state, invocation.result]);

  // Extract error message if present
  const error = useMemo(() => {
    if (status === "error") {
      const result = invocation.result as { error?: string } | undefined;
      return result?.error || "An unexpected error occurred";
    }
    return null;
  }, [status, invocation.result]);

  // Check if tool is in loading state
  const isLoading = status === "loading";

  // Check if tool has completed successfully
  const isSuccess = status === "success";

  // Check if tool has an error
  const hasError = status === "error";

  // Get result data (excluding error field)
  const data = useMemo(() => {
    if (invocation.result && typeof invocation.result === "object") {
      const result = invocation.result as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { error: _error, ...data } = result;
      return data;
    }
    return invocation.result;
  }, [invocation.result]);

  return {
    status,
    error,
    data,
    isLoading,
    isSuccess,
    hasError,
    invocation
  };
}