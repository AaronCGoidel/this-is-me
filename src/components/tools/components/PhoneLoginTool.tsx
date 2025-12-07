import { ToolComponentProps } from "../types";
import { ActionPattern } from "../index";

export default function PhoneLoginTool({ invocation }: ToolComponentProps) {
  return (
    <ActionPattern
      invocation={invocation}
      loadingText="Sending you a code..."
    />
  );
}