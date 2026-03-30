import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ROUTES } from "@/constants";
import { useConsultationStore } from "@/stores/consultation.store";
import type { HealthCategory } from "@sniffles/types";
import { ChevronRight } from "lucide-react";

const CATEGORIES: { id: HealthCategory; title: string; icon: string }[] = [
  { id: "FEVER_FLU", title: "Fever & Flu", icon: "🤒" },
  { id: "SKIN_ISSUES", title: "Skin Issues", icon: "🧴" },
  { id: "SEXUAL_HEALTH", title: "Sexual Health", icon: "❤️" },
  { id: "INFECTIONS", title: "Infections", icon: "🦠" },
  { id: "MEDICATION_REFILL", title: "Medication Refill", icon: "💊" },
  { id: "ASTHMA_ALLERGIES", title: "Asthma & Allergies", icon: "🌬️" },
  { id: "UTIS_YEAST_INFECTION", title: "UTIs & Yeast Infection", icon: "🚽" },
  { id: "WEIGHT_LOSS", title: "Weight Loss", icon: "⚖️" },
];

interface StartConsultationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartConsultationModal({
  isOpen,
  onOpenChange,
}: StartConsultationModalProps) {
  const navigate = useNavigate();
  const { setSelectedCategory } = useConsultationStore();

  const handleCategorySelect = (category: HealthCategory) => {
    setSelectedCategory(category);
    onOpenChange(false);
    navigate(ROUTES.SYMPTOMS);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-8">
        <DialogHeader className="mb-8">
          <DialogTitle className="text-3xl font-black text-neutral-800 text-center">
            What can we help you with?
          </DialogTitle>
          <DialogDescription className="text-center text-neutral-500 font-medium text-lg mt-2">
            Select a category to start your medical consultation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="flex items-center justify-between p-5 bg-[#F8FCFD] hover:bg-brand-50 border border-brand-100/50 rounded-2xl transition-all group hover:border-brand-300"
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-bold text-neutral-800 group-hover:text-brand-700 transition-colors">
                  {cat.title}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-brand-500 transition-all group-hover:translate-x-1" />
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-col items-center">
          <p className="text-neutral-400 text-sm font-medium mb-4">
            Don't see your condition?
          </p>
          <button
            onClick={() => handleCategorySelect("FEVER_FLU")}
            className="text-brand-700 font-black hover:underline"
          >
            Search for symptoms instead
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
