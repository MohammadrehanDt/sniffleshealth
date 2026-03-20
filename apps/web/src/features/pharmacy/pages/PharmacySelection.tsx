import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Hospital, Pill } from "lucide-react";
import { ROUTES } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { usePharmacyStore } from "@/stores";
import type { Pharmacy } from "@sniffles/types";

// Mock pharmacy data - in production, this would come from an API
const MOCK_PHARMACIES: Pharmacy[] = [
  {
    id: "1",
    name: "CVS, Pharma",
    type: "Pharma",
    address: "123 Main St, New York, NY 10001",
    distance: "~ 0.4 miles",
    price: "$30.5",
    isDefault: false,
  },
  {
    id: "2",
    name: "Walgreens, Retail",
    type: "Retail",
    address: "456 Park Ave, New York, NY 10002",
    distance: "~ 0.4 miles",
    price: "$29.50",
    isDefault: false,
  },
  {
    id: "3",
    name: "Rite Aid, Health",
    type: "Health",
    address: "789 Broadway, New York, NY 10003",
    distance: "~ 0.4 miles",
    price: "$29.50",
    isDefault: false,
  },
];

export default function PharmacySelection() {
  const navigate = useNavigate();
  const {
    selectedPharmacy,
    prescriptionItems,
    setSelectedPharmacy,
    setPharmacyAsDefault,
    setOrder,
  } = usePharmacyStore();
  const [localSelectedPharmacy, setLocalSelectedPharmacy] =
    useState<Pharmacy | null>(selectedPharmacy || MOCK_PHARMACIES[0]);
  const [setAsDefault, setSetAsDefault] = useState(false);

  const handlePharmacySelect = (pharmacy: Pharmacy) => {
    setLocalSelectedPharmacy(pharmacy);
    setSelectedPharmacy(pharmacy);
  };

  const handleContinue = () => {
    if (!localSelectedPharmacy) return;

    if (setAsDefault) {
      setPharmacyAsDefault(localSelectedPharmacy.id);
    }

    // Create order
    const totalPrice = localSelectedPharmacy.price;
    setOrder({
      pharmacy: localSelectedPharmacy,
      prescriptionItems,
      totalPrice,
      pickupTime: "12:00 PM today",
    });

    navigate(ROUTES.PHARMACY_CONFIRMATION);
  };

  return (
    <div className="min-h-screen bg-neutral-off-white flex flex-col">
      <PageHeader
        backTo={ROUTES.PRESCRIPTION}
        step="#ISDS3434"
        title="Place an order"
        showLogo={true}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-off-white">
        <div className="max-w-[1464px] mx-auto p-6">
          <div className="flex gap-3 ">
            {/* Left Section - Pharmacy Selection */}
            <div className="flex-1 bg-white border border-neutral-gray rounded-xl overflow-hidden relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-br from-brand-cyan to-transparent" />
              </div>

              <div className="relative h-full flex flex-col items-center justify-center p-10">
                {/* Header */}
                <div className="flex flex-col gap-6 items-center mb-6">
                  <div className="flex flex-col gap-3 items-center">
                    <div className="bg-warm-50 flex items-center justify-center p-1 rounded-full">
                      <Hospital className="w-6 h-6 text-neutral-dark-gray" />
                    </div>
                    <h1 className="text-text-charcoal text-2xl font-display font-medium tracking-tight text-center">
                      Select a pharmacy for pickup
                    </h1>
                  </div>

                  {/* Pharmacy Cards */}
                  <div className="flex flex-col gap-3 items-start w-full max-w-[435px]">
                    {/* Selected Pharmacy Card */}
                    {localSelectedPharmacy && (
                      <div className="w-full">
                        <div className="bg-neutral-light-gray rounded-t-2xl rounded-b-xl p-1">
                          <div className="bg-white border-2 border-brand-cyan rounded-2xl p-5 flex gap-2 items-start relative">
                            <div className="flex-1 flex flex-col gap-1">
                              <p className="text-text-primary text-base font-inter font-medium">
                                {localSelectedPharmacy.name}
                              </p>
                              <p className="text-neutral-stone text-base font-inter font-normal">
                                {localSelectedPharmacy.address}
                              </p>
                              <p className="text-neutral-stone text-base font-inter font-medium">
                                {localSelectedPharmacy.distance}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <p className="text-text-charcoal text-xl font-display font-medium tracking-tight">
                                {localSelectedPharmacy.price}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Set as default checkbox */}
                        <div className="flex gap-2 items-center px-3 py-2">
                          <button
                            onClick={() => setSetAsDefault(!setAsDefault)}
                            className={`flex items-center justify-center w-4 h-4 rounded ${
                              setAsDefault
                                ? "bg-neutral-slate"
                                : "border border-neutral-stone"
                            }`}
                          >
                            {setAsDefault && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </button>
                          <p className="text-neutral-slate text-sm font-inter font-medium">
                            Set this as default for future
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Other Pharmacy Cards */}
                    {MOCK_PHARMACIES.filter(
                      (p) => p.id !== localSelectedPharmacy?.id,
                    ).map((pharmacy) => (
                      <div
                        key={pharmacy.id}
                        onClick={() => handlePharmacySelect(pharmacy)}
                        className="bg-white border border-border-medium rounded-2xl p-5 flex gap-2 items-start w-full cursor-pointer hover:border-brand-cyan transition-colors"
                      >
                        <div className="flex-1 flex flex-col gap-1">
                          <p className="text-text-primary text-base font-inter font-medium">
                            {pharmacy.name}
                          </p>
                          <p className="text-neutral-stone text-base font-inter font-normal">
                            {pharmacy.address}
                          </p>
                          <p className="text-neutral-stone text-base font-inter font-medium">
                            {pharmacy.distance}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-neutral-dark-gray text-xl font-display font-medium tracking-tight">
                            {pharmacy.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={handleContinue}
                    className="bg-brand-cyan-dark h-[57px] px-6 py-2.5 rounded-2xl hover:bg-brand-cyan-dark/90 text-white text-base font-inter font-semibold"
                  >
                    Continue with payment
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Section - Order Preview */}
            <div className="w-[325px] bg-white border border-neutral-gray rounded-[10px] overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col gap-6 h-[477px]">
                  {/* Order Preview Header */}
                  <div className="h-6">
                    <h3 className="text-neutral-slate text-base font-inter font-semibold leading-6">
                      Order Preview
                    </h3>
                  </div>

                  {/* Tablets Section */}
                  <div className="flex flex-col gap-0">
                    <h4 className="text-neutral-slate text-base font-inter font-medium leading-6 mb-0">
                      Tablets
                    </h4>
                    {prescriptionItems
                      .filter((item) => item.type === "tablets")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2.5 pr-2.5"
                        >
                          <p className="text-neutral-stone text-sm font-inter font-medium text-center">
                            {item.name}
                          </p>
                          <div className="flex items-center justify-end gap-1 text-center">
                            <Pill className="w-6 h-6 text-neutral-stone" />
                            <span className="text-neutral-darker-gray text-[10px]">
                              x
                            </span>
                            <p className="text-neutral-stone text-sm font-inter font-normal">
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Vitamins Section */}
                  <div className="flex flex-col gap-0">
                    <h4 className="text-neutral-slate text-base font-inter font-medium leading-6 mb-0">
                      Vitamins
                    </h4>
                    {prescriptionItems
                      .filter((item) => item.type === "capsules")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2.5 pr-2.5"
                        >
                          <p className="text-neutral-stone text-sm font-inter font-medium text-center">
                            {item.name}
                          </p>
                          <div className="flex items-center justify-end gap-1 text-center">
                            <Pill className="w-6 h-6 text-neutral-stone" />
                            <span className="text-neutral-darker-gray text-[10px]">
                              x
                            </span>
                            <p className="text-neutral-stone text-sm font-inter font-normal">
                              {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
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
