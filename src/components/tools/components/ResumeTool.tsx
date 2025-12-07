import { ToolComponentProps } from "../types";
import { DocumentPattern } from "../index";

export default function ResumeTool({ invocation }: ToolComponentProps) {
  return (
    <DocumentPattern
      invocation={invocation}
      title="Aaron's Resume"
      downloadUrl="/resume.pdf"
      downloadFilename="Aaron_Goidel_Resume.pdf"
      embedUrl="/resume.pdf"
      height="600px"
    />
  );
}