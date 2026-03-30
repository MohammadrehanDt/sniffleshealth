import { useState, useMemo } from "react";
import { Search, AlertCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data for UI development
const INITIAL_MEDICATIONS = [
  {
    id: "1",
    name: "Lisinopril 10mg",
    lastFilledDate: "Feb 15, 2026",
    pharmacy: "CVS Pharmacy",
    status: "Active",
  },
  {
    id: "2",
    name: "Cetirizine 10mg",
    lastFilledDate: "Feb 15, 2026",
    pharmacy: "CVS Pharmacy",
    status: "Active",
  },
];

const PHARMACIES = [
  "CVS Pharmacy",
  "Walgreens",
  "Rite Aid",
  "Walmart Pharmacy",
  "Local Health Pharma",
];

export default function MedicationRefillPage() {
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefilling, setIsRefilling] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    pharmacy: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Filtered medications
  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
      const matchesSearch =
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.pharmacy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.lastFilledDate.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        med.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [medications, searchQuery, statusFilter]);

  const handleRequestRefill = (id: string) => {
    setIsRefilling(id);
    // Simulate API call
    setTimeout(() => {
      setIsRefilling(null);
      toast.success("Refill request submitted successfully!");
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Medication name is required";
    if (!formData.pharmacy) newErrors.pharmacy = "Pharmacy is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestMedication = () => {
    if (!validateForm()) return;

    const newMed = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      pharmacy: formData.pharmacy,
      lastFilledDate: "Pending",
      status: "Awaiting",
    };

    setMedications((prev) => [newMed, ...prev]);
    setIsModalOpen(false);
    setFormData({ name: "", pharmacy: "", note: "" });
    setIsDirty(false);
    toast.success("New medication request submitted!");
  };

  const handleCloseModal = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const confirmDiscard = () => {
    setFormData({ name: "", pharmacy: "", note: "" });
    setIsDirty(false);
    setShowDiscardConfirm(false);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[20px] font-semibold leading-[120%] text-[#1B2B2E] font-inter">
          Medication Refills
        </h1>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full h-auto sm:h-[41px]">
        {/* Search Bar */}
        <div className="relative w-full sm:w-[381px] h-[41px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8FA1A6]" />
          <Input
            placeholder="Search by date, symptoms, Physician and more..."
            className="pl-11 pr-4 h-full border-[#D7E1E4] rounded-[8px] bg-white text-sm font-inter font-normal leading-[120%] placeholder:text-[#8FA1A6] placeholder:font-normal placeholder:leading-[120%] focus-visible:ring-brand-cyan-dark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 h-[41px]">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-[#D7E1E4] w-[98px] h-[41px] rounded-[8px] pt-[12px] pb-[12px] pl-[20px] pr-[20px] bg-white hover:bg-neutral-50"
            onClick={() =>
              setStatusFilter(statusFilter === "all" ? "active" : "all")
            }
          >
            <img
              src="/images/funnel.png"
              alt="Filter"
              className="w-4 h-4 opacity-100"
            />
            <span className="text-[14px] font-medium leading-[120%] text-[#8FA1A6] font-inter">
              {statusFilter === "all" ? "Filter" : statusFilter}
            </span>
          </Button>
          <Button
            className="bg-brand-cyan-dark hover:bg-brand-cyan-dark/90 text-white flex items-center gap-2 rounded-[8px] h-full px-4"
            onClick={() => setIsModalOpen(true)}
          >
            New Medication
          </Button>
        </div>
      </div>

      {/* Medication List */}
      <div className="flex flex-col gap-4 w-full max-w-[1171px]">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med) => (
            <Card
              key={med.id}
              className="w-full border-[#D7E1E4] rounded-[8px] bg-white shadow-none"
            >
              <CardContent className="p-4 flex flex-col gap-4">
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[16px] font-medium leading-[120%] text-black font-inter">
                      {med.name}
                    </h3>
                    <p className="text-[14px] font-normal leading-[120%] text-[#4A5E63] font-inter">
                      Last filled {med.lastFilledDate}
                    </p>
                    <p className="text-[14px] font-normal leading-[120%] text-[#4A5E63] font-inter">
                      {med.pharmacy}
                    </p>
                  </div>

                  <Badge
                    className={cn(
                      "rounded-[30px] px-[10px] py-[4px] text-[12px] font-normal leading-[120%] border-none",
                      med.status === "Active"
                        ? "bg-[#2E9E6F] text-[#F2F6F7]"
                        : med.status === "Awaiting"
                          ? "bg-amber-500 text-white"
                          : "bg-neutral-400 text-white",
                    )}
                  >
                    {med.status}
                  </Badge>
                </div>

                {med.status === "Active" && (
                  <Button
                    className="w-[132px] h-[41px] bg-[#E8F4F5] text-[#0F5C63] hover:bg-[#E8F4F5]/90 rounded-[8px] text-[14px] font-medium font-inter leading-[120%] pt-[12px] pb-[12px] pl-[20px] pr-[20px] shadow-none"
                    onClick={() => handleRequestRefill(med.id)}
                    disabled={isRefilling === med.id}
                  >
                    {isRefilling === med.id ? (
                      <Clock className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Request Refill
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-slate">
              No medications found
            </h3>
            <p className="text-neutral-500 max-w-xs mx-auto">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>

      {/* New Medication Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[416px] min-w-[416px] h-[466px] rounded-[8px] p-6 gap-6 overflow-hidden border-none bg-white [&>button]:hidden flex flex-col items-center">
          <DialogHeader className="p-0 space-y-0 w-full">
            <div className="flex items-center justify-start h-[22px]">
              <DialogTitle className="text-[18px] font-semibold leading-[120%] text-[#1B2B2E] font-inter">
                New Medication
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-0 w-full">
            <div className="flex flex-col gap-2 h-[66px]">
              <Label
                htmlFor="med-name"
                className="text-[14px] font-normal leading-[120%] text-[#2F4246] font-inter"
              >
                Medication Name
              </Label>
              <Input
                id="med-name"
                placeholder="Enter medication name"
                className={cn(
                  "h-[41px] border-[#D7E1E4] rounded-[8px] text-[14px] font-inter font-normal leading-[120%] placeholder:text-[#8FA1A6]",
                  errors.name && "border-red-500 focus-visible:ring-red-500",
                )}
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-[-4px]">{errors.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 h-[66px]">
              <Label
                htmlFor="pharmacy"
                className="text-[14px] font-normal leading-[120%] text-[#2F4246] font-inter"
              >
                Pharmacy
              </Label>
              <Select
                onValueChange={(val) => handleInputChange("pharmacy", val)}
                value={formData.pharmacy}
              >
                <SelectTrigger
                  id="pharmacy"
                  className={cn(
                    "h-[41px] border-[#D7E1E4] rounded-[8px] bg-white px-4 py-3 flex items-center justify-between text-[14px] font-inter font-normal leading-[120%] text-[#8FA1A6] [&>svg]:hidden group",
                    errors.pharmacy &&
                      "border-red-500 focus-visible:ring-red-500",
                  )}
                >
                  <SelectValue placeholder="Select pharmacy" />
                  <img
                    src="/images/chevron-down.png"
                    alt="chevron-down"
                    className="w-[9px] h-[12px] opacity-100 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    style={{
                      fontFamily: "'Font Awesome 6 Free'",
                      fontWeight: 900,
                      fontSize: "10px",
                      lineHeight: "120%",
                    }}
                  />
                </SelectTrigger>
                <SelectContent>
                  {PHARMACIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.pharmacy && (
                <p className="text-xs text-red-500 mt-[-4px]">
                  {errors.pharmacy}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 h-[151px]">
              <Label
                htmlFor="note"
                className="text-[14px] font-normal leading-[120%] text-[#2F4246] font-inter"
              >
                Note
              </Label>
              <Textarea
                id="note"
                placeholder="Please specify reason"
                className="h-[102px] border-[#D7E1E4] rounded-[8px] text-[14px] font-inter font-normal leading-[120%] placeholder:text-[#8FA1A6] resize-none"
                value={formData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="p-0 sm:justify-center">
            <Button
              className="w-full bg-[#146D75] hover:bg-[#146D75]/90 text-[#E8F4F5] h-[41px] rounded-[8px] text-[14px] font-medium font-inter leading-[120%] pt-[12px] pb-[12px] pl-[20px] pr-[20px] shadow-none"
              onClick={handleRequestMedication}
              disabled={!formData.name.trim() || !formData.pharmacy}
            >
              Request Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discard Confirmation Dialog */}
      <Dialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-6 [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-neutral-slate">
              Discard Changes?
            </DialogTitle>
          </DialogHeader>
          <p className="text-neutral-500">
            You have unsaved changes. Are you sure you want to discard them?
          </p>
          <DialogFooter className="flex flex-row gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 rounded-xl h-11"
              onClick={() => setShowDiscardConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl h-11"
              onClick={confirmDiscard}
            >
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
