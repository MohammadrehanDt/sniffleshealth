import { Printer, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES, FONTS } from "@/constants";
import { PageHeader, AppFooter, Logo } from "@/components/layout";
import { usePharmacyStore } from "@/stores";

export default function Prescription() {
  const navigate = useNavigate();
  const { setPrescriptionItems } = usePharmacyStore();
  const symptoms = ["Fever", "Persistent Cough", "Headache", "Fatigue"];
  const prescriptionId = "#34FDMDF";
  const doctorName = "Dr. Sarah Johnson";

  const handleSelectPharmacy = () => {
    // Set prescription items for the pharmacy selection page
    setPrescriptionItems([
      { id: "1", name: "Amoxicillin 500mg", type: "tablets", quantity: "10 Caps" },
      { id: "2", name: "Ibuprofen 400mg", type: "tablets", quantity: "10 Caps" },
      { id: "3", name: "B-Complex Caps", type: "capsules", quantity: "10 Caps" },
    ]);
    navigate(ROUTES.PHARMACY_SELECTION);
  };

  return (
    <div className="min-h-screen bg-neutral-off-white flex flex-col pt-4">
      <PageHeader showLogo={true} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-off-white">
        <div className="max-w-[720px] mx-auto p-6">
          <div className="flex items-center justify-center ">
            {/* Prescription Card */}
            <div className="border border-neutral-gray rounded-3xl w-[1110px] flex flex-col p-6 bg-gradient-to-b from-warm-50 via-warm-50 to-white h-full min-h-full">
              {/* Header with Back Button */}
              <div className="flex items-center mb-6">
                <div className="flex items-center gap-3">
                  <Link
                    to={ROUTES.DOCTOR_CHAT}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-gray bg-neutral-off-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <ArrowLeft className="w-6 h-6 text-text-primary" />
                  </Link>
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-sm font-inter leading-5">
                      {prescriptionId}
                    </span>
                    <span className="text-text-dark text-base font-inter font-medium leading-6">
                      Your Prescription from {doctorName.split(" ")[1]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Prescription Content */}
              <div className="flex-1 flex flex-col items-center justify-center gap-6 p-6">
                {/* Prescription Card */}
                <div className="bg-white border border-border-medium rounded-xl shadow-[0px_8px_12px_0px_rgba(0,0,0,0.12)] w-[642px] h-[487px] p-10 relative">
                  {/* Print Button */}
                  <button className="absolute right-[31px] top-[31px] flex items-center justify-center w-10 h-10 rounded-full border border-neutral-gray bg-neutral-off-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] opacity-90 hover:opacity-100 transition-opacity">
                    <Printer className="w-6 h-6 text-text-primary" />
                  </button>

                  {/* My Diagnosis */}
                  <div className="flex flex-col gap-3 mb-6">
                    <p className="text-text-slate text-sm font-inter font-medium leading-5 tracking-tight">
                      My Diagnosis
                    </p>
                    <p className="text-text-slate text-xl font-inter font-normal leading-5">
                      Acute Sinusitis
                    </p>
                  </div>

                  {/* Symptoms */}
                  <div className="flex flex-col gap-3 mb-6">
                    <p className="text-text-slate text-sm font-inter font-medium leading-5 tracking-tight">
                      Symptoms
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {symptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="bg-neutral-light-gray border border-transparent rounded-full px-[13px] py-[5px] text-text-slate text-xs font-inter font-medium leading-4"
                        >
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* My Prescription */}
                  <div className="flex flex-col gap-3 mb-6 flex-1">
                    <p className="text-text-slate text-sm font-inter font-medium leading-5 tracking-tight">
                      My Prescription
                    </p>
                    <div className="text-text-slate text-sm font-inter font-normal leading-5 tracking-tight">
                      <p className="mb-0">
                        <span className="font-bold">1. Amoxicillin 500mg</span>
                        <span>
                          {" "}
                          - Take one capsule three times daily for 7 days
                        </span>
                      </p>
                      <p className="mb-0">
                        <span className="font-bold">2. Ibuprofen 400mg -</span>
                        <span>
                          {" "}
                          Take as needed for pain, up to 3 times daily
                        </span>
                      </p>
                      <p className="mb-0">3. Rest and increase fluid intake</p>
                      <p className="mb-0 text-sm">&nbsp;</p>
                      <p className="mb-0">
                        Follow-up: Schedule a follow-up if symptoms persist
                        after 7 days.
                      </p>
                    </div>
                  </div>

                  {/* My Doctor */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex flex-col gap-3 flex-1">
                      <p className="text-text-slate text-sm font-inter font-medium leading-5 tracking-tight">
                        My Doctor
                      </p>
                      <p className="text-text-slate text-xl font-inter font-normal leading-5">
                        {doctorName}:
                      </p>
                    </div>
                    <Logo size="md" />
                  </div>
                </div>

                {/* Action Section */}
                <div className="flex items-center justify-between w-[642px] px-3">
                  <div className="flex flex-col flex-1 max-w-[344px]">
                    <p className="text-neutral-slate text-sm font-inter font-semibold leading-5">
                      Schedule reminder for a follow up in 5 days for recurring
                      consultation
                    </p>
                  </div>
                  <button
                    onClick={handleSelectPharmacy}
                    className="bg-brand-cyan-dark h-[57px] px-6 py-2.5 rounded-2xl hover:bg-brand-cyan-dark/90 transition-colors flex-shrink-0"
                  >
                    <span className="text-white text-base font-inter font-semibold leading-6">
                      Select Pharmacy for pickup
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
