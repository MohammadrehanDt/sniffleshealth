import { TriangleAlert } from "lucide-react";

interface AIInsightsProps {
  insights: string;
  noWrapper?: boolean;
}

export function AIInsights({ insights, noWrapper = false }: AIInsightsProps) {
  const content = (
    <div className={`flex flex-col ${noWrapper ? "mt-4" : ""}`}>
      <h3 className="w-[81px] h-[19px] font-inter font-medium text-[16px] leading-[120%] text-[#000000] mb-4 tracking-normal opacity-100">
        AI Insights
      </h3>
      
      <div className="flex gap-4 p-[11px_16px] rounded-lg w-[342.33px] h-[90px] bg-[#2E9E6F33] opacity-100">
        <div className="w-6 h-6 shrink-0 opacity-100">
          <TriangleAlert className="w-full h-full text-[#2F4246]" />
        </div>
        <p className="w-[270.33px] h-[68px] font-inter font-normal text-[14px] leading-[120%] text-[#1B2B2E] tracking-normal opacity-100 overflow-hidden">
          {insights}
        </p>
      </div>
    </div>
  );

  if (noWrapper) {
    return content;
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-300 p-6 shadow-none">
      {content}
    </div>
  );
}
