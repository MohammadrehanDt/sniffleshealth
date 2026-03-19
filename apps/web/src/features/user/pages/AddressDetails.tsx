import { MapPin, Mail, Phone, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AddressData } from "@sniffles/types";
import { ROUTES, FONTS } from "@/constants";
import { useUserStore } from "@/stores";
import { PageHeader, AppFooter } from "@/components/layout";
import { Logo } from "@/components/layout";
import { useLocalStorage } from "@/hooks";

const STORAGE_KEY = "address-details-draft";

export default function AddressDetails() {
  const navigate = useNavigate();
  const { profile, setAddressData } = useUserStore();
  
  // Use localStorage to persist form data, with fallback to store or defaults
  const { value: formData, setValue: setFormData } = useLocalStorage<AddressData>(
    STORAGE_KEY,
    {
      defaultValue: profile?.addressData || {
        email: "johndoe@gmail.com",
        phone: "+021 7348-2839",
        addressLine1: "",
        addressLine2: "",
        pincode: "",
        city: "New York",
      },
    }
  );

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // Save address data to store
    setAddressData(formData);
    // Clear localStorage draft after successful submission
    // Note: We could keep it for "edit" functionality, but clearing for now
    navigate(ROUTES.FINDING_DOCTOR);
  };

  return (
    <div className="min-h-screen bg-neutral-light-gray flex flex-col">
      {/* Header */}
      <div className="bg-neutral-off-white border-b border-neutral-gray px-6 py-4">
        <div className="max-w-[1464px] mx-auto flex items-center justify-center relative">
          {/* Center - Logo */}
          <Logo size="md" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-light-gray flex items-center justify-center">
        <div className="max-w-[1464px] mx-auto p-6 w-full flex items-center justify-center">
          <div className="w-[966px] border border-neutral-gray rounded-3xl overflow-hidden relative min-h-[745px] flex flex-col bg-gradient-to-b from-warm-50 to-white">
            {/* Content */}
            <div className="flex flex-col gap-6 items-center h-full p-6 pt-10 pb-6">
              <div className="flex flex-col gap-6 items-center justify-center w-full max-w-[651px] flex-1">
                {/* Location Pin Icon */}
                <div className="bg-warm-300 flex items-center justify-center p-1 rounded-full">
                  <MapPin className="w-6 h-6 text-neutral-dark-gray" />
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl font-inter-display font-medium leading-44 tracking-tight text-center text-neutral-charcoal">
                  Address and Details
                </h1>

                {/* Form Section */}
                <div className="flex flex-col gap-5 items-center w-full">
                  {/* Description Text */}
                  <p className="text-text-secondary text-base font-inter font-normal leading-6 text-center w-[348px]">
                    Legally we are required KYC before a consultation for proper
                    prescription
                  </p>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-3 items-start w-full">
                    {/* Row 1: Email and Phone */}
                    <div className="flex gap-3 justify-center items-start w-full">
                      {/* Email Field */}
                      <div className="bg-white border border-border-medium rounded-2xl p-3 flex items-center gap-2 w-[268px]">
                        <div className="flex items-center justify-center p-1 rounded-lg opacity-75 flex-shrink-0">
                          <Mail className="w-5 h-5 text-text-secondary" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm font-inter whitespace-nowrap"
                        />
                      </div>

                      {/* Phone Field */}
                      <div className="bg-white border border-border-medium rounded-2xl p-3 flex items-center gap-2 w-[268px]">
                        <div className="flex items-center justify-center p-1 rounded-lg opacity-75 flex-shrink-0">
                          <Phone className="w-5 h-5 text-text-secondary" />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm font-inter whitespace-nowrap"
                        />
                      </div>
                    </div>

                    {/* Row 2: Address Line 1 and 2 */}
                    <div className="flex gap-3 justify-center items-start w-full">
                      {/* Address Line 1 */}
                      <input
                        type="text"
                        placeholder="Address line 1"
                        value={formData.addressLine1}
                        onChange={(e) =>
                          handleInputChange("addressLine1", e.target.value)
                        }
                        className="bg-white border border-border-medium rounded-2xl p-3 w-[268px] text-text-primary text-sm font-inter placeholder:text-text-primary outline-none"
                      />

                      {/* Address Line 2 */}
                      <input
                        type="text"
                        placeholder="Address line 2"
                        value={formData.addressLine2}
                        onChange={(e) =>
                          handleInputChange("addressLine2", e.target.value)
                        }
                        className="bg-white border border-border-medium rounded-2xl p-3 w-[268px] text-text-primary text-sm font-inter placeholder:text-text-primary outline-none"
                      />
                    </div>

                    {/* Row 3: Pincode and City */}
                    <div className="flex gap-3 justify-center items-start w-full">
                      {/* Pincode */}
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={(e) =>
                          handleInputChange("pincode", e.target.value)
                        }
                        className="bg-white border border-border-medium rounded-2xl p-3 w-[268px] text-text-primary text-sm font-inter placeholder:text-text-primary outline-none"
                      />

                      {/* City Dropdown */}
                      <div className="bg-white border border-border-medium rounded-2xl p-3 flex items-center justify-between w-[268px]">
                        <input
                          type="text"
                          value={formData.city}
                          readOnly
                          className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm font-inter"
                        />
                        <button className="flex items-center justify-center p-2 rounded-xl">
                          <ChevronDown className="w-6 h-6 text-brand-cyan-dark" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleContinue}
                    className="bg-brand-cyan-dark text-white font-inter px-6 py-3 rounded-2xl font-semibold text-base leading-6 hover:bg-brand-cyan-dark/90 transition-colors h-[57px] flex items-center justify-center w-full"
                  >
                    Continue
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
