import { useState, useMemo } from "react";
import { Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

const CATEGORIZED_CONDITIONS = [
  ["Hypertension", "Diabetes", "Hypothyroidism", "Hyperthyroidism"],
  ["Asthma", "COPD", "Seasonal Allergies", "Pulmonary Fibrosis", "Recurrent Pneumonias"],
  ["Coronary Artery Disease", "Congestive Heart Failure", "Atrial Fibrillation", "Valvular Heart Disease", "Congenital Heart Disease"],
  ["DVT Deep Vein Thrombosis", "PE Pulmonary Embolism", "PAD Peripheral Artery Disease"],
  ["Gastritis", "Peptic Ulcer Disease", "Colitis", "Ulcerative Colitis", "Crohn's Disease", "Celiac's Disease", "Chronic Constipation", "Hemorrhoids"],
  ["Frequent UTIs", "Kidney Stones", "STDs"],
  ["Stroke", "TIAs", "Seizures"],
  ["Anxiety", "Panic Disorder", "Depression", "ADD", "ADHD", "Schizophrenia"],
  ["Cancer"]
];

const SAVE_BUTTON_CLASSES = "bg-[#1B7F88] hover:bg-[#16666d] text-white px-6 h-[41px] rounded-[8px] font-inter font-normal text-[14px] leading-[1.2] text-center transition-colors border-none outline-none flex items-center justify-center";

export function PastMedicalHistory({ initialConditions = [] }: { initialConditions?: string[] }) {
  const navigate = useNavigate();
  const [tempMedicalConditions, setTempMedicalConditions] = useState<string[]>(initialConditions);
  const [otherCondition, setOtherCondition] = useState("");
  const [conditionSearch, setConditionSearch] = useState("");

  const toggleCondition = (condition: string) => {
    setTempMedicalConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  const handleSave = () => {
    navigate(ROUTES.PATIENT_MEDICAL_PROFILE);
  };

  return (
    <div className="w-full max-w-[1139px] bg-white rounded-[8px] border border-[#1B7F88] p-[24px] flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => navigate(ROUTES.PATIENT_MEDICAL_PROFILE)} className="text-[#1B7F88]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[18px] font-medium font-inter text-[#1B2B2E]">Past Medical History</h2>
      </div>

      <div className="space-y-6">
        {/* Search within Edit Mode */}
        <div className="relative w-full h-[41px] flex items-center gap-2 bg-white border border-[#D7E1E4] rounded-[8px] px-4 py-3">
          <Search className="w-4 h-4 text-[#8FA1A6]" />
          <Input 
            placeholder="Search conditions" 
            value={conditionSearch}
            onChange={(e) => setConditionSearch(e.target.value)}
            className="h-[17px] w-full p-0 bg-transparent border-none text-[14px] font-normal leading-[1.2] text-[#1B2B2E] placeholder:text-[#8FA1A6] focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors font-inter"
          />
        </div>
        
        <div className="space-y-6 pt-2">
          {CATEGORIZED_CONDITIONS.map((group, groupIdx) => {
            const filteredGroup = group.filter(c => 
              c.toLowerCase().includes(conditionSearch.toLowerCase())
            );
            if (filteredGroup.length === 0) return null;
            
            return (
              <div key={groupIdx} className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {filteredGroup.map(condition => {
                    const isActive = tempMedicalConditions.includes(condition);
                    return (
                      <button
                        key={condition}
                        onClick={() => toggleCondition(condition)}
                        className={cn(
                          "px-4 py-1.5 text-[14px] font-normal cursor-pointer transition-all rounded-[8px] border font-inter h-[37px] flex items-center justify-center",
                          isActive 
                            ? "border-[#1B7F88] text-[#1B7F88] bg-white font-medium" 
                            : "border-[#D7E1E4] text-[#8FA1A6] bg-white hover:bg-neutral-50"
                        )}
                      >
                        {condition}
                      </button>
                    );
                  })}
                </div>
                {groupIdx < CATEGORIZED_CONDITIONS.length - 1 && (
                  <div className="h-[1px] bg-[#F1F5F9] w-full" />
                )}
              </div>
            );
          })}
        </div>

        <div className="h-[1px] bg-[#F1F5F9] w-full" />

        <div className="space-y-2 pt-2">
          <label className="text-[14px] font-semibold text-[#1B2B2E] font-inter">Others</label>
          <Input 
            placeholder="Example: Nails" 
            value={otherCondition}
            onChange={(e) => setOtherCondition(e.target.value)}
            className="h-[41px] w-full px-4 bg-white border border-[#D7E1E4] rounded-[8px] text-[14px] font-normal text-[#1B2B2E] placeholder:text-[#8FA1A6] focus-visible:ring-0 focus-visible:ring-offset-0 font-inter"
          />
        </div>

        <div className="flex items-center justify-end gap-4 pt-4">
          <button 
            onClick={() => navigate(ROUTES.PATIENT_MEDICAL_PROFILE)} 
            className="text-[#1B7F88] font-inter font-medium text-[14px] hover:underline bg-transparent border-none outline-none"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className={SAVE_BUTTON_CLASSES}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
