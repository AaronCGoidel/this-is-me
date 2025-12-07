import { ToolComponentProps } from "../types";
import { ActionPattern } from "../index";

export default function LogoutTool({ invocation }: ToolComponentProps) {
  return (
    <ActionPattern
      invocation={invocation}
      loadingText="Logging you out..."
    />
  );
}