import { ToolComponentProps } from "../types";
import { ActionPattern } from "../index";

export default function VerifyOtpTool({ invocation }: ToolComponentProps) {
  return (
    <ActionPattern
      invocation={invocation}
      loadingText="Verifying your one time passcode..."
    />
  );
}