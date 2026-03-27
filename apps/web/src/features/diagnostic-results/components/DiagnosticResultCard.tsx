import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { DiagnosticResult } from "../data/mockResults";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants";
import { SectionCard } from "@sniffles/ui";
import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface DiagnosticResultCardProps {
  result: DiagnosticResult;
  showVerifyBadge?: boolean;
}

export function DiagnosticResultCard({ result, showVerifyBadge = false }: DiagnosticResultCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!result.pdfUrl) return;
    
    setIsDownloading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsDownloading(false);
    toast({ title: "Downloading", description: `Downloading ${result.pdfUrl}...` });
  }, [result.pdfUrl]);

  const isUnavailable = !result.pdfUrl;

  const downloadButton = (
    <Button 
      variant="brand" 
      size="sm" 
      className={`w-[156px] h-[41px] rounded-lg bg-[#E8F4F5] p-[12px_20px] gap-2 border-none shadow-none font-medium flex items-center justify-center hover:bg-[#D1E9EB] transition-colors ${isUnavailable ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
      onClick={handleDownload}
      disabled={isDownloading || isUnavailable}
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin text-[#0F5C63]" />
      ) : (
        <span className="w-[116px] h-[17px] font-inter font-medium text-[14px] leading-[120%] text-[#0F5C63] flex items-center justify-center tracking-normal">
          Download Report
        </span>
      )}
    </Button>
  );

  const viewButton = (
    <Link 
      to={isUnavailable ? "#" : ROUTES.DIAGNOSTIC_RESULT_DETAILS.replace(":id", result.id)}
      className={`w-[83px] h-[41px] rounded-lg bg-transparent py-3 gap-2 font-medium flex items-center justify-center no-underline hover:bg-neutral-50 transition-colors ${isUnavailable ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      onClick={(e) => isUnavailable && e.preventDefault()}
    >
      <span className="w-[83px] h-[17px] font-inter font-medium text-[14px] leading-[120%] text-[#146D75] flex items-center justify-center tracking-normal">
        View Report
      </span>
    </Link>
  );

  return (
    <SectionCard className="p-4 bg-white border-neutral-300 rounded-xl shadow-none flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[16px] font-semibold text-neutral-800 leading-tight">{result.testName}</h3>
          <p className="text-[14px] text-neutral-600 leading-tight">{result.date}</p>
          <p className="text-[14px] text-neutral-600 leading-tight">{result.lab}</p>
        </div>
        <div className="flex items-center gap-2">
          {result.status === "Normal" ? (
            <div className="bg-semantic-success text-white text-[12px] font-medium px-[10px] py-[4px] rounded-full leading-tight">
              Normal
            </div>
          ) : (
            <div className="bg-semantic-error text-white text-[12px] font-medium px-[10px] py-[4px] rounded-full leading-tight">
              {result.status}
            </div>
          )}
          {showVerifyBadge && (
            <div className="flex items-center justify-center w-[99px] h-[22px] bg-[#3B82F633] rounded-[30px] py-1 px-3 gap-1">
              <span className="w-[75px] h-[14px] font-inter font-medium text-[12px] leading-[120%] text-[#3B82F6] flex items-center justify-center tracking-normal whitespace-nowrap">
                Verify By MD
              </span>
            </div>
          )}
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {result.markers.map((marker, index) => (
          <li key={index} className="text-[14px] text-neutral-600 leading-tight list-none flex items-center">
            <span className="w-1 h-1 rounded-full bg-neutral-300 mr-2 shrink-0" />
            {marker.label} {marker.value}
          </li>
        ))}
      </ul>

      <div className="flex flex-row gap-3 mt-4 items-center">
        <TooltipProvider>
          {isUnavailable ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-row gap-3">
                  {downloadButton}
                  {viewButton}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Report file is currently unavailable</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              {downloadButton}
              {viewButton}
            </>
          )}
        </TooltipProvider>
      </div>
    </SectionCard>
  );
}
