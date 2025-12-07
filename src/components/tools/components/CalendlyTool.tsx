import { ToolComponentProps } from "../types";
import { EmbedPattern } from "../index";

export default function CalendlyTool({ invocation }: ToolComponentProps) {
  return (
    <EmbedPattern
      invocation={invocation}
      url="https://calendly.com/acgoidel?hide_gdpr_banner=1"
      title="Schedule with Aaron"
      height="650px"
    />
  );
}