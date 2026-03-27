import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react"; // Ensure lucide-react is installed in apps/web/package.json

interface ReportViewerProps {
  filename: string;
}

export function ReportViewer({ filename }: ReportViewerProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!filename) return;
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsDownloading(false);
    toast({ title: "Downloading", description: `Downloading ${filename}...` });
  }, [filename]);

  const isUnavailable = !filename || filename === "report.pdf";

  // In a real app, this URL would come from your backend/storage (e.g., S3)
  const pdfUrl = isUnavailable ? "" : filename.startsWith('http') ? filename : `/reports/${filename}`;

  return (
    <div className="bg-white flex flex-col overflow-hidden shadow-none max-w-[748.66px] w-full h-[1032.006px] rounded-lg border border-[#D7E1E4] p-4 gap-4 opacity-100">
      <div className="flex flex-col max-w-[716.666px] w-full h-[52px] gap-4 opacity-100">
        <h3 className="w-[109px] h-[19px] font-inter font-medium text-[16px] leading-[120%] text-[#000000]">
          Report Viewer
        </h3>
        <p className="w-[107px] h-[17px] font-inter font-normal text-[14px] leading-[120%] text-[#4A5E63] tracking-normal opacity-100">
          {filename}
        </p>
      </div>

      <div className="flex flex-col flex-1">
        <div className="bg-[#F8FAFB] flex-1 flex flex-col overflow-hidden rounded-sm border border-dashed border-[#D7E1E4]">
          {!isUnavailable ? (
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-none"
              title="PDF Report"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#8FA1A6] gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-inter">Loading PDF document...</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          variant="brand" 
          size="sm" 
          className={`w-[156px] h-[41px] rounded-lg p-[12px_20px] gap-2 bg-[#E8F4F5] border-none shadow-none font-medium flex items-center justify-center opacity-100 ${isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleDownload}
          disabled={isDownloading || isUnavailable}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#0F5C63]" />
          ) : (
            <span className="w-[116px] h-[17px] font-inter font-medium text-[14px] leading-[120%] text-[#0F5C63] flex items-center">
              Download Report
            </span>
          )}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`w-[83px] h-[41px] rounded-lg p-[12px_0] gap-2 bg-transparent border-none shadow-none font-medium flex items-center justify-center opacity-100 ${isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isUnavailable}
        >
          <span className="w-[83px] h-[17px] font-inter font-medium text-[14px] leading-[120%] text-[#146D75] flex items-center justify-center">
            View Report
          </span>
        </Button>
      </div>
    </div>
  );
}
