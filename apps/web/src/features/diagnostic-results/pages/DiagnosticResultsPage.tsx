import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { diagnosticResults } from "../data/mockResults";
import { DiagnosticResultCard } from "../components/DiagnosticResultCard";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function DiagnosticResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResults = useMemo(() => {
    return [...diagnosticResults]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((result) => {
        const query = searchQuery.toLowerCase();
        return (
          result.testName.toLowerCase().includes(query) ||
          result.lab.toLowerCase().includes(query) ||
          result.date.toLowerCase().includes(query)
        );
      });
  }, [searchQuery]);

  return (
    <div className="space-y-4 pt-4 px-1">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-[20px] font-semibold leading-6 text-neutral-800">Diagnostic Results</h1>
        
        <div className="flex flex-row justify-between items-center w-full max-w-[1171px]">
          <div className="relative w-full max-w-[381px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search by date, symptoms, Physician and more..."
              className="pl-10 pr-4 h-[41px] rounded-lg border-neutral-300 bg-white shadow-none text-sm placeholder:text-neutral-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button 
            className="w-[141px] h-[41px] rounded-lg bg-[#146D75] p-[12px_20px] gap-2 border-none shadow-none font-medium flex items-center justify-center hover:bg-[#0F5C63] transition-colors opacity-100"
          >
            <span className="w-[101px] h-[17px] font-inter font-medium text-[14px] leading-[120%] text-[#E8F4F5] flex items-center justify-center tracking-normal">
              Upload Results
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((result, index) => (
            <DiagnosticResultCard 
              key={result.id} 
              result={result} 
              showVerifyBadge={index === 0 && searchQuery === ""} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white border border-neutral-200 rounded-xl">
            <p className="text-neutral-500 font-medium">No results found for "{searchQuery}"</p>
            <Button 
              variant="link" 
              className="text-brand-700 mt-2" 
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
