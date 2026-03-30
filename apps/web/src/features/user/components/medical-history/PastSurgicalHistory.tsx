import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";

const SAVE_BUTTON_CLASSES = "bg-[#1B7F88] hover:bg-[#16666d] text-white px-6 h-[41px] rounded-[8px] font-inter font-normal text-[14px] leading-[1.2] text-center transition-colors border-none outline-none flex items-center justify-center";

export function PastSurgicalHistory() {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate(ROUTES.PATIENT_MEDICAL_PROFILE);
  };

  return (
    <div className="w-full max-w-[1139px] bg-white rounded-[8px] border border-[#1B7F88] p-[24px] flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => navigate(ROUTES.PATIENT_MEDICAL_PROFILE)} className="text-[#1B7F88]">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-[18px] font-medium font-inter text-[#1B2B2E]">Past Surgical History</h2>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-[#8FA1A6] font-inter">Add your surgical history details here.</p>
        {/* Placeholder for form fields */}
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
  );
}
