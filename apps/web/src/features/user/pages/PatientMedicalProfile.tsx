import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@sniffles/ui";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/constants";

// Types
interface MedicalHistoryItem {
  id: string;
  condition: string;
  date: string;
  physician: string;
  symptom: string;
}

interface SurgicalHistoryItem {
  id: string;
  procedure: string;
  date: string;
  physician: string;
  symptom: string;
}

interface AllergyItem {
  id: string;
  allergen: string;
  severity: string;
  date: string;
  physician: string;
}

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  startDate: string;
}

interface SocialHistoryItem {
  id: string;
  type: string;
  status: string;
  date: string;
  physician: string;
}

// Mock Data
const INITIAL_MEDICAL_HISTORY: MedicalHistoryItem[] = [
  { id: "1", condition: "Hypertension", date: "2020-05-12", physician: "Dr. Sarah Chen", symptom: "High blood pressure" },
  { id: "2", condition: "Seasonal allergies", date: "", physician: "Dr. James Wilson", symptom: "Routine lab work" },
];

const INITIAL_SURGICAL_HISTORY: SurgicalHistoryItem[] = [
  { id: "1", procedure: "Appendectomy", date: "2015-08-15", physician: "Dr. Robert Miller", symptom: "Acute abdominal pain" },
];

const INITIAL_ALLERGIES: AllergyItem[] = [
  { id: "1", allergen: "Penicillin", severity: "rash", date: "2010-02-05", physician: "Dr. Amy Vance" },
  { id: "2", allergen: "Sulfa drugs", severity: "hives", date: "2018-06-12", physician: "Self-reported" },
];

const INITIAL_MEDICATIONS: MedicationItem[] = [
  { id: "1", name: "Lisinopril", dosage: "10mg", frequency: "daily", prescribedBy: "Dr. James Wilson", startDate: "2023-05-15" },
  { id: "2", name: "Cetirizine", dosage: "10mg", frequency: "as needed", prescribedBy: "Dr. James Wilson", startDate: "2023-11-25" },
];

const INITIAL_SOCIAL_HISTORY: SocialHistoryItem[] = [
  { id: "1", type: "Smoking", status: "Never", date: "2024-03-25", physician: "Dr. Sarah Chen" },
  { id: "2", type: "Alcohol", status: "Occasional", date: "2024-03-25", physician: "Dr. Sarah Chen" },
];

const CATEGORIZED_CONDITIONS: string[][] = [
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

const TITLE_CLASSES = "text-[16px] font-medium font-inter leading-[1.2] text-[#000000] w-full max-w-[158px] h-[19px] opacity-100";
const CARD_CLASSES = "w-full max-w-[1139px] min-h-[101px] rounded-[8px] border border-[#D7E1E4] bg-white p-[16px] flex flex-col justify-start opacity-100";
const ADD_BUTTON_CLASSES = "w-[68px] h-[41px] gap-[8px] opacity-100 pt-[12px] pr-[20px] pb-[12px] pl-[20px] rounded-[8px] bg-[#E8F4F5] hover:bg-[#D1E9EB] text-[#0F5C63] border-none shadow-none flex items-center justify-center p-0 shrink-0";
const ADD_TEXT_CLASSES = "w-[28px] h-[17px] font-inter font-medium text-[14px] leading-[1.2] opacity-100 flex items-center justify-center";
const SAVE_BUTTON_CLASSES = "bg-[#1B7F88] hover:bg-[#16666d] text-white px-6 h-[41px] rounded-[8px] font-inter font-normal text-[14px] leading-[1.2] text-center transition-colors border-none outline-none flex items-center justify-center";

export default function PatientMedicalProfile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryItem[]>(INITIAL_MEDICAL_HISTORY);
  
  // States for Past Medical History editing
  const [tempMedicalConditions, setTempMedicalConditions] = useState<string[]>([]);
  const [otherCondition, setOtherCondition] = useState("");
  const [conditionSearch, setConditionSearch] = useState("");

  const isEditingMedical = id === "1";
  const isEditingSurgical = id === "2";
  const isEditingAllergies = id === "3";
  const isEditingMedications = id === "4";
  const isEditingSocial = id === "5";

  // Filtered Sections based on global search
  const filteredMedical = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return medicalHistory.filter((item: MedicalHistoryItem) => 
      item.condition.toLowerCase().includes(query) || 
      item.physician.toLowerCase().includes(query) || 
      item.symptom.toLowerCase().includes(query) ||
      item.date.includes(query)
    );
  }, [medicalHistory, searchQuery]);

  // Handle Medical History Edit Mode Entry
  const enterEditMedical = () => {
    setTempMedicalConditions(medicalHistory.map(m => m.condition));
    navigate(`${ROUTES.PATIENT_MEDICAL_PROFILE}/1`);
  };

  const handleSaveMedical = () => {
    const newHistory: MedicalHistoryItem[] = tempMedicalConditions.map((cond) => {
      const existing = medicalHistory.find(m => m.condition === cond);
      return existing || { 
        id: Math.random().toString(36).substring(2, 11), 
        condition: cond, 
        date: new Date().toISOString().split('T')[0], 
        physician: "Self-reported", 
        symptom: "Added by patient" 
      };
    });
    
    if (otherCondition.trim()) {
      newHistory.push({
        id: Math.random().toString(36).substring(2, 11),
        condition: otherCondition.trim(),
        date: new Date().toISOString().split('T')[0],
        physician: "Self-reported",
        symptom: "Added by patient"
      });
    }

    setMedicalHistory(newHistory);
    setOtherCondition("");
    setConditionSearch("");
    navigate(ROUTES.PATIENT_MEDICAL_PROFILE);
  };

  const cancelEdit = () => {
    navigate(ROUTES.PATIENT_MEDICAL_PROFILE);
  };

  const toggleCondition = (condition: string) => {
    setTempMedicalConditions(prev => 
      prev.includes(condition) 
        ? prev.filter(c => c !== condition) 
        : [...prev, condition]
    );
  };

  return (
    <div className="w-full max-w-[1171px] mx-auto flex flex-col gap-4 py-4 overflow-hidden">
      {/* Header */}
      <div className="w-full h-[24px]">
        <h1 className="text-[20px] font-semibold font-inter leading-[1.2] text-[#1B2B2E]">
          Medical Profile
        </h1>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-[381px] h-[41px] flex items-center gap-2 bg-white border border-[#D7E1E4] rounded-[8px] px-4 py-3 mb-2">
        <img 
          src="/images/search.png" 
          alt="Search" 
          className="w-4 h-4 opacity-100" 
        />
        <Input 
          placeholder="Search by date, symptoms, Physician and more..." 
          className="h-[17px] w-full p-0 bg-transparent border-none text-[14px] font-normal leading-[1.2] text-[#8FA1A6] placeholder:text-[#8FA1A6] focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors font-inter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 w-full pb-10">
        {/* Past Medical History */}
        <SectionCard className={cn("relative", CARD_CLASSES, isEditingMedical && "min-h-fit border-[#1B7F88]")}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-4 w-full">
                <h2 className={TITLE_CLASSES}>Past Medical History</h2>
                {!isEditingMedical ? (
                  <Button onClick={enterEditMedical} className={ADD_BUTTON_CLASSES}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                ) : (
                  <Button disabled className={cn(ADD_BUTTON_CLASSES, "opacity-50 cursor-not-allowed")}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                )}
              </div>

              <ul className="space-y-1 mb-4">
                {filteredMedical.map((item) => (
                  <li key={item.id} className="flex items-start group">
                    <div className="flex gap-2 items-center">
                      <div className="w-1 h-1 rounded-full bg-[#4B5563] shrink-0" />
                      <p className="text-[14px] font-normal text-[#4B5563] font-inter">
                        {item.condition} {item.date ? `(diagnosed ${new Date(item.date).getFullYear()})` : ""}
                      </p>
                    </div>
                  </li>
                ))}
                {filteredMedical.length === 0 && (
                  <li className="text-[14px] text-[#8FA1A6] italic font-inter">No medical history</li>
                )}
              </ul>

              {isEditingMedical && (
                <div className="space-y-4 animate-in fade-in duration-200">
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
                  
                  <div className="space-y-4 pt-2">
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
                      onClick={cancelEdit} 
                      className="text-[#1B7F88] font-inter font-medium text-[14px] hover:underline bg-transparent border-none outline-none"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveMedical} 
                      className={SAVE_BUTTON_CLASSES}
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Past Surgical History */}
        <SectionCard className={cn(CARD_CLASSES, isEditingSurgical && "border-[#1B7F88]")}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-4 w-full">
                <h2 className={TITLE_CLASSES}>Past Surgical History</h2>
                {!isEditingSurgical ? (
                  <Button onClick={() => navigate(`${ROUTES.PATIENT_MEDICAL_PROFILE}/2`)} className={ADD_BUTTON_CLASSES}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                ) : (
                  <Button disabled className={cn(ADD_BUTTON_CLASSES, "opacity-50 cursor-not-allowed")}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                )}
              </div>
              <ul className="space-y-1">
                {INITIAL_SURGICAL_HISTORY.map((item) => (
                  <li key={item.id} className="flex items-start group">
                    <div className="flex gap-2 items-center">
                      <div className="w-1 h-1 rounded-full bg-[#4B5563] shrink-0" />
                      <p className="text-[14px] font-normal text-[#4B5563] font-inter">
                        {item.procedure}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {isEditingSurgical && (
                <div className="mt-4 p-4 border-t border-[#F1F5F9]">
                  <p className="text-[14px] text-[#8FA1A6] font-inter mb-4">Edit Surgical History UI placeholder</p>
                  <div className="flex items-center justify-end gap-4">
                    <button onClick={cancelEdit} className="text-[#1B7F88] text-[14px] font-medium">Cancel</button>
                    <button onClick={cancelEdit} className={SAVE_BUTTON_CLASSES}>Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Allergies */}
        <SectionCard className={cn(CARD_CLASSES, isEditingAllergies && "border-[#1B7F88]")}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-4 w-full">
                <h2 className={TITLE_CLASSES}>Allergies</h2>
                {!isEditingAllergies ? (
                  <Button onClick={() => navigate(`${ROUTES.PATIENT_MEDICAL_PROFILE}/3`)} className={ADD_BUTTON_CLASSES}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                ) : (
                  <Button disabled className={cn(ADD_BUTTON_CLASSES, "opacity-50 cursor-not-allowed")}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                )}
              </div>
              <ul className="space-y-1">
                {INITIAL_ALLERGIES.map((item) => (
                  <li key={item.id} className="flex items-start group">
                    <div className="flex gap-2 items-center">
                      <div className="w-1 h-1 rounded-full bg-[#4B5563] shrink-0" />
                      <p className="text-[14px] font-normal text-[#4B5563] font-inter">
                        {item.allergen} {item.severity ? `— ${item.severity.toLowerCase()}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {isEditingAllergies && (
                <div className="mt-4 p-4 border-t border-[#F1F5F9]">
                  <p className="text-[14px] text-[#8FA1A6] font-inter mb-4">Edit Allergies UI placeholder</p>
                  <div className="flex items-center justify-end gap-4">
                    <button onClick={cancelEdit} className="text-[#1B7F88] text-[14px] font-medium">Cancel</button>
                    <button onClick={cancelEdit} className={SAVE_BUTTON_CLASSES}>Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Current Medications */}
        <SectionCard className={cn(CARD_CLASSES, isEditingMedications && "border-[#1B7F88]")}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-4 w-full">
                <h2 className={TITLE_CLASSES}>Current Medications</h2>
                {!isEditingMedications ? (
                  <Button onClick={() => navigate(`${ROUTES.PATIENT_MEDICAL_PROFILE}/4`)} className={ADD_BUTTON_CLASSES}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                ) : (
                  <Button disabled className={cn(ADD_BUTTON_CLASSES, "opacity-50 cursor-not-allowed")}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                )}
              </div>
              <ul className="space-y-1">
                {INITIAL_MEDICATIONS.map((item) => (
                  <li key={item.id} className="flex items-start group">
                    <div className="flex gap-2 items-center">
                      <div className="w-1 h-1 rounded-full bg-[#4B5563] shrink-0" />
                      <p className="text-[14px] font-normal text-[#4B5563] font-inter">
                        {item.name} {item.dosage} — {item.frequency.toLowerCase()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {isEditingMedications && (
                <div className="mt-4 p-4 border-t border-[#F1F5F9]">
                  <p className="text-[14px] text-[#8FA1A6] font-inter mb-4">Edit Medications UI placeholder</p>
                  <div className="flex items-center justify-end gap-4">
                    <button onClick={cancelEdit} className="text-[#1B7F88] text-[14px] font-medium">Cancel</button>
                    <button onClick={cancelEdit} className={SAVE_BUTTON_CLASSES}>Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Social History */}
        <SectionCard className={cn(CARD_CLASSES, isEditingSocial && "border-[#1B7F88]")}>
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-4 w-full">
                <h2 className={TITLE_CLASSES}>Social History</h2>
                {!isEditingSocial ? (
                  <Button onClick={() => navigate(`${ROUTES.PATIENT_MEDICAL_PROFILE}/5`)} className={ADD_BUTTON_CLASSES}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                ) : (
                  <Button disabled className={cn(ADD_BUTTON_CLASSES, "opacity-50 cursor-not-allowed")}>
                    <span className={ADD_TEXT_CLASSES}>Add</span>
                  </Button>
                )}
              </div>
              <ul className="space-y-1">
                {INITIAL_SOCIAL_HISTORY.map((item) => (
                  <li key={item.id} className="flex items-start group">
                    <div className="flex gap-2 items-center">
                      <div className="w-1 h-1 rounded-full bg-[#4B5563] shrink-0" />
                      <p className="text-[14px] font-normal text-[#4B5563] font-inter">
                        {item.type === "Smoking" ? (item.status === "Never" ? "Non-smoker" : `Smoker: ${item.status}`) : ""}
                        {item.type === "Alcohol" ? `${item.status} alcohol` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {isEditingSocial && (
                <div className="mt-4 p-4 border-t border-[#F1F5F9]">
                  <p className="text-[14px] text-[#8FA1A6] font-inter mb-4">Edit Social History UI placeholder</p>
                  <div className="flex items-center justify-end gap-4">
                    <button onClick={cancelEdit} className="text-[#1B7F88] text-[14px] font-medium">Cancel</button>
                    <button onClick={cancelEdit} className={SAVE_BUTTON_CLASSES}>Save</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
