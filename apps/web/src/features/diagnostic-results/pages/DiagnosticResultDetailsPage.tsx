import { useParams } from "react-router-dom";
import { diagnosticResults } from "../data/mockResults";
import { KeyResults } from "../components/KeyResults";
import { AIInsights } from "../components/AIInsights";
import { ReportViewer } from "../components/ReportViewer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { SectionCard } from "@sniffles/ui";

export default function DiagnosticResultDetailsPage() {
  const { id } = useParams();
  const result = diagnosticResults.find((r) => r.id === id);

  if (!result) {
    return <div className="p-8 text-center">Result not found</div>;
  }

  return (
    <div className="space-y-4 pt-4 px-1">
      <h1 className="w-[986px] h-6 font-inter font-semibold text-[20px] leading-[120%] text-[#1B2B2E] mb-2 opacity-100">
        {result.testName} - Details
      </h1>

      <div className="flex justify-between items-center bg-white border border-[#D7E1E4] rounded-lg mx-auto shadow-none max-w-[1171px] w-full h-[73px] p-4 opacity-100">
        <div className="flex items-center gap-3">
           <img 
             src="/images/lab-logo.png" 
             alt="Apex Lab Logo" 
             className="w-10 h-10 rounded-full shrink-0 object-cover"
           />
           <div className="flex flex-col justify-center w-[116px] h-[35px] gap-1">
             <span className="w-[71px] h-[17px] font-inter font-medium text-[14px] leading-[120%] text-[#2F4246]">
               {result.lab}
             </span>
             <span className="w-[76px] h-[14px] font-inter font-normal text-[12px] leading-[120%] text-[#4A5E63]">
               {result.date}
             </span>
           </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="brand" 
            className="w-[180px] h-[41px] rounded-lg p-[12px_20px] gap-2 bg-[#146D75] border-none shadow-none font-medium flex items-center justify-center opacity-100"
          >
            <Download className="h-4 w-4 text-[#E8F4F5]" />
            <span className="w-[116px] h-[17px] font-inter font-medium text-[14px] leading-[120%] text-[#E8F4F5] flex items-center">
              Download Report
            </span>
          </Button>
          <Button 
            variant="outline" 
            className="w-[79px] h-[41px] rounded-lg p-[12px_20px] gap-2 bg-[#E8F4F5] border-none shadow-none font-medium flex items-center justify-center opacity-100"
          >
            <span className="w-[39px] h-[17px] font-inter font-medium text-[14px] leading-[120%] text-[#0F5C63] flex items-center justify-center">
              Share
            </span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_381px] bg-white border border-[#D7E1E4] rounded-lg mx-auto shadow-none relative max-w-[1171px] w-full h-[1064.006px] gap-4 p-4 opacity-100">
        <div className="flex flex-col h-full">
          <ReportViewer filename={result.pdfUrl || "report.pdf"} />
        </div>
          <SectionCard 
            className="bg-white border-[#D7E1E4] shadow-none overflow-hidden flex flex-col w-[374.33px] h-[329px] rounded-lg border p-4 opacity-100"
          >
            <KeyResults markers={result.markers} status={result.status} noWrapper />
            <AIInsights insights={result.aiInsights || "No insights available."} noWrapper />
            
            <p className="w-[342.33px] h-[34px] font-inter font-normal italic text-[14px] leading-[120%] text-[#1B2B2E] tracking-normal mt-4 opacity-100">
              Your results have been viewed and verified by your MD
            </p>
          </SectionCard>
      </div>
    </div>
  );
}
