import { InlineWidget } from "react-calendly";
import { ppMori } from "../app/lib/fonts";
import { Calendar, ExternalLink } from "lucide-react";

interface CalendlyEmbedProps {
  url: string;
}

export default function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  return (
    <div className="rounded-lg p-4 my-4 max-w-4xl">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-white" />
        <h3 className={`text-lg font-semibold text-white ${ppMori.semiBold}`}>
          Schedule a Meeting with Aaron
        </h3>
      </div>
      <div className=" rounded-lg overflow-hidden">
        <InlineWidget url={url} />
      </div>
      <div className="mt-3 text-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-blue-400 hover:text-blue-300 text-sm transition-colors flex items-center gap-1 justify-center ${ppMori.regular}`}
        >
          <ExternalLink className="w-3 h-3" />
          Open in new tab
        </a>
      </div>
    </div>
  );
}
