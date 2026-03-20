import { useState, useRef, useCallback } from "react";
import {
  Smile,
  Car,
  FileText,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  Upload,
  X,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AddressData } from "@sniffles/types";
import { ROUTES } from "@/constants";
import { useUserStore } from "@/stores";
import { PageHeader, AppFooter } from "@/components/layout";
import { useLocalStorage } from "@/hooks";

const STORAGE_KEY = "kyc-address-draft";

type Step = "kyc" | "address";

export default function KYC() {
  const navigate = useNavigate();
  const { setAddressData } = useUserStore();
  const [currentStep, setCurrentStep] = useState<Step>("kyc");
  const [selectedOption, setSelectedOption] = useState<"license" | "other">(
    "license",
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use localStorage to persist form data, with fallback to store or defaults
  const { value: formData, setValue: setFormData } =
    useLocalStorage<AddressData>(STORAGE_KEY, {
      defaultValue: {
        email: "johndoe@gmail.com",
        phone: "+021 7348-2839",
        addressLine1: "",
        addressLine2: "",
        pincode: "",
        city: "New York",
      },
    });

  const handleInputChange = (field: keyof AddressData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const handleNext = () => {
    if (currentStep === "kyc") {
      // Validate that at least one file is uploaded
      if (uploadedFiles.length === 0) {
        // In a real app, show an error message
        return;
      }
      setCurrentStep("address");
    }
  };

  const handleBack = () => {
    if (currentStep === "address") {
      setCurrentStep("kyc");
    }
  };

  const handleContinue = () => {
    // Save address data to store
    setAddressData(formData);
    // In a real app, this would handle file upload first, then redirect to third-party KYC
    // After third-party KYC completion, user would be redirected back
    navigate(ROUTES.FINDING_DOCTOR);
  };

  const canProceedToAddress = uploadedFiles.length > 0;

  return (
    <div className="min-h-screen bg-neutral-off-white flex flex-col pt-4">
      <PageHeader showLogo={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 max-w-[720px] mx-auto w-full p-5 flex flex-col min-h-0">
          <div className="bg-white rounded-xl border border-neutral-gray flex-1 flex flex-col min-h-0">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pt-10 px-6 md:px-12 pb-6 min-h-0">
              <div className="max-w-[963px] mx-auto flex flex-col gap-10">
                {/* Header Section */}
                <div className="flex flex-col gap-6 items-center">
                  {/* Smile Icon */}
                  {/* <div className="bg-warm-300 flex items-center justify-center p-1 rounded-full">
                    <Smile className="w-6 h-6 text-neutral-dark-gray" />
                  </div> */}

                  {/* Step Indicator */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center gap-2 ${currentStep === "kyc" ? "text-brand-cyan-dark" : "text-brand-cyan-dark"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-inter font-semibold text-sm ${
                          currentStep === "kyc"
                            ? "bg-brand-cyan-dark text-white"
                            : "bg-brand-cyan-dark text-white"
                        }`}
                      >
                        {currentStep === "kyc" ? (
                          "1"
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-inter font-medium">
                        KYC Document
                      </span>
                    </div>
                    <div className="w-12 h-0.5 bg-border-medium"></div>
                    <div
                      className={`flex items-center gap-2 ${currentStep === "address" ? "text-brand-cyan-dark" : "text-text-secondary"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-inter font-semibold text-sm ${
                          currentStep === "address"
                            ? "bg-brand-cyan-dark text-white"
                            : "bg-neutral-light-gray text-text-secondary"
                        }`}
                      >
                        2
                      </div>
                      <span className="text-sm font-inter font-medium">
                        Address Details
                      </span>
                    </div>
                  </div>
                </div>
                {/* Main Heading */}
                <h1 className="text-5xl font-inter-display font-medium leading-44 tracking-tight text-center text-neutral-charcoal">
                  Complete KYC & Address
                </h1>

                {/* Description Text */}
                <p className="text-text-secondary text-base font-inter font-normal leading-6 text-center max-w-[500px]">
                  Legally we are required KYC before a consultation for proper
                  prescription
                </p>

                {/* Step 1: KYC Upload Section */}
                {currentStep === "kyc" && (
                  <div className="flex flex-col gap-6 items-center w-full">
                    <h2 className="text-text-primary text-lg font-inter font-semibold leading-6 text-center w-full">
                      Upload Document
                    </h2>

                    {/* Upload Options */}
                    <div className="flex flex-row gap-3 items-center w-full">
                      {/* Driver's License Option */}
                      <button
                        onClick={() => setSelectedOption("license")}
                        className={`flex-1 bg-white border rounded-2xl p-5 flex items-center justify-between transition-all hover:border-brand-cyan/50 ${
                          selectedOption === "license"
                            ? "border-2 border-brand-cyan"
                            : "border border-border-medium"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`flex items-center justify-center p-1 rounded-full ${
                              selectedOption === "license"
                                ? "bg-brand-cyan-pale"
                                : "bg-neutral-light-gray"
                            }`}
                          >
                            <Car
                              className={`w-6 h-6 ${
                                selectedOption === "license"
                                  ? "text-brand-cyan"
                                  : "text-text-light"
                              }`}
                            />
                          </div>
                          <p
                            className={`text-base font-inter leading-6 ${
                              selectedOption === "license"
                                ? "font-semibold text-text-primary tracking-body-tight"
                                : "font-medium text-text-secondary"
                            }`}
                          >
                            Driver's license
                          </p>
                        </div>
                      </button>

                      {/* Other Documents Option */}
                      <button
                        onClick={() => setSelectedOption("other")}
                        className={`flex-1 bg-white border rounded-2xl p-5 flex items-center justify-between transition-all hover:border-brand-cyan/50 ${
                          selectedOption === "other"
                            ? "border-2 border-brand-cyan"
                            : "border border-border-medium"
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            className={`flex items-center justify-center p-1 rounded-full ${
                              selectedOption === "other"
                                ? "bg-brand-cyan-pale"
                                : "bg-neutral-light-gray"
                            }`}
                          >
                            <FileText
                              className={`w-6 h-6 ${
                                selectedOption === "other"
                                  ? "text-brand-cyan"
                                  : "text-text-light"
                              }`}
                            />
                          </div>
                          <p
                            className={`text-base font-inter leading-6 ${
                              selectedOption === "other"
                                ? "font-semibold text-text-primary tracking-body-tight"
                                : "font-medium text-text-secondary"
                            }`}
                          >
                            Other Documents
                          </p>
                        </div>
                      </button>
                    </div>

                    {/* Drag and Drop Upload Area */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
                        isDragging
                          ? "border-brand-cyan-dark bg-brand-cyan-pale/20"
                          : "border-border-medium hover:border-brand-cyan-dark/50 hover:bg-neutral-light-gray/30"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center p-3 rounded-full ${
                          isDragging
                            ? "bg-brand-cyan-dark"
                            : "bg-brand-cyan-pale"
                        }`}
                      >
                        <Upload
                          className={`w-6 h-6 ${
                            isDragging ? "text-white" : "text-brand-cyan-dark"
                          }`}
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-center">
                        <p className="text-text-primary text-base font-inter font-semibold">
                          {isDragging
                            ? "Drop your files here"
                            : "Drag and drop your document here"}
                        </p>
                        <p className="text-text-secondary text-sm font-inter">
                          or click to browse
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileInputChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="w-full flex flex-col gap-2">
                        <h3 className="text-text-primary text-sm font-inter font-semibold">
                          Uploaded Files ({uploadedFiles.length})
                        </h3>
                        <div className="flex flex-col gap-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="bg-neutral-light-gray border border-border-medium rounded-xl p-3 flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="w-5 h-5 text-brand-cyan-dark flex-shrink-0" />
                                <p className="text-text-primary text-sm font-inter truncate">
                                  {file.name}
                                </p>
                                <span className="text-text-secondary text-xs font-inter flex-shrink-0">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(index);
                                }}
                                className="p-1 hover:bg-white rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-text-secondary" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Address Details Section */}
                {currentStep === "address" && (
                  <div className="flex flex-col gap-4 items-center w-full">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-text-secondary" />
                      <h2 className="text-text-primary text-lg font-inter font-semibold leading-6 text-center">
                        Address and Contact Details
                      </h2>
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-3 items-start w-full">
                      {/* Email Field */}
                      <div className="bg-white border border-border-medium active:border-brand-cyan-dark hover:border-brand-cyan-dark/80 focus-within:border-brand-cyan-dark focus-within:border-2 transition-colors duration-75 rounded-2xl p-3 flex items-center gap-2 w-full">
                        <div className="flex items-center justify-center p-1 rounded-lg opacity-75 flex-shrink-0">
                          <Mail className="w-5 h-5 text-text-secondary" />
                        </div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm font-inter"
                        />
                      </div>

                      {/* Phone Field */}
                      <div className="bg-white border border-border-medium active:border-brand-cyan-dark hover:border-brand-cyan-dark/80 focus-within:border-brand-cyan-dark focus-within:border-2 transition-colors duration-75 rounded-2xl p-3 flex items-center gap-2 w-full">
                        <div className="flex items-center justify-center p-1 rounded-lg opacity-75 flex-shrink-0">
                          <Phone className="w-5 h-5 text-text-secondary" />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm font-inter"
                        />
                      </div>

                      {/* Address Line 1 */}
                      <input
                        type="text"
                        placeholder="Address line 1"
                        value={formData.addressLine1}
                        onChange={(e) =>
                          handleInputChange("addressLine1", e.target.value)
                        }
                        className="bg-white border border-border-medium active:border-brand-cyan-dark hover:border-brand-cyan-dark/80 focus:border-brand-cyan-dark focus:border-2 transition-colors duration-75 rounded-2xl p-3 w-full text-text-primary text-sm font-inter placeholder:text-text-primary outline-none"
                      />

                      {/* Address Line 2 */}
                      <input
                        type="text"
                        placeholder="Address line 2"
                        value={formData.addressLine2}
                        onChange={(e) =>
                          handleInputChange("addressLine2", e.target.value)
                        }
                        className="bg-white border border-border-medium active:border-brand-cyan-dark hover:border-brand-cyan-dark/80 focus:border-brand-cyan-dark focus:border-2 transition-colors duration-75 rounded-2xl p-3 w-full text-text-primary text-sm font-inter placeholder:text-text-primary outline-none"
                      />

                      {/* Pincode */}
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.pincode}
                        onChange={(e) =>
                          handleInputChange("pincode", e.target.value)
                        }
                        className="bg-white border border-border-medium active:border-brand-cyan-dark hover:border-brand-cyan-dark/80 focus:border-brand-cyan-dark focus:border-2 transition-colors duration-75 rounded-2xl p-3 w-full text-text-primary text-sm font-inter placeholder:text-text-primary outline-none"
                      />

                      {/* City Dropdown */}
                      <div className="bg-white border border-border-medium active:border-brand-cyan-dark hover:border-brand-cyan-dark/80 focus-within:border-brand-cyan-dark focus-within:border-2 transition-colors duration-75 rounded-2xl p-3 flex items-center justify-between w-full">
                        <input
                          type="text"
                          value={formData.city}
                          readOnly
                          className="flex-1 bg-transparent border-none outline-none text-text-primary text-sm font-inter"
                        />
                        <button className="flex items-center justify-center p-2 rounded-xl hover:bg-neutral-light-gray transition-colors">
                          <ChevronDown className="w-6 h-6 text-brand-cyan-dark" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Button Section */}
            <div className="border-t border-border-dark p-6">
              <div className="max-w-[963px] mx-auto flex gap-3">
                {currentStep === "address" && (
                  <button
                    onClick={handleBack}
                    className="bg-white border border-border-medium text-text-primary font-inter px-6 py-3 rounded-2xl font-semibold text-base leading-6 hover:bg-neutral-light-gray transition-colors flex items-center justify-center flex-1"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={currentStep === "kyc" ? handleNext : handleContinue}
                  disabled={currentStep === "kyc" && !canProceedToAddress}
                  className={`font-inter px-6 py-3 rounded-2xl font-semibold text-base leading-6 transition-colors flex items-center justify-center ${
                    currentStep === "kyc" && !canProceedToAddress
                      ? "bg-border-medium text-text-light cursor-not-allowed flex-1"
                      : "bg-brand-cyan-dark text-white hover:bg-brand-cyan-dark/90 flex-1"
                  }`}
                >
                  {currentStep === "kyc" ? "Next" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
