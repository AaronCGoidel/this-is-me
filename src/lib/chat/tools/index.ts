import { getAuthTools } from "./auth";
import { clientSideTools } from "./client";

export function getToolDefinitions() {
  return {
    ...getAuthTools(),
    ...clientSideTools,
  };
}
