import { Check, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES, FONTS } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";

export default function PaymentConfirmation() {
  const navigate = useNavigate();

  // Sample invoice data - in a real app, this would come from state/API
  const invoiceId = "JSDKM483";
  const paymentDate = "25th March 2024, 12:34 PM";
  const amount = "$25";

  const handleDownloadInvoice = () => {
    // Handle invoice download
    console.log("Downloading invoice:", invoiceId);
    // In a real app, this would trigger a download
  };

  const handleContinue = () => {
    // Navigate to HIPAA compliance page
    navigate(ROUTES.HIPAA_COMPLIANCE);
  };

  return (
    <div className="min-h-screen bg-neutral-light-gray flex flex-col">
     <div className="bg-neutral-off-white pt-4"> <PageHeader showLogo={true} /></div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-off-white  flex items-center justify-center">
        <div className="max-w-[1464px] mx-auto p-6 w-full flex items-center justify-center">
          <div className="w-[482px] border border-neutral-gray rounded-3xl overflow-hidden relative  flex flex-col bg-gradient-to-b from-brand-cyan-lightest to-white">
            {/* Content */}
            <div className="flex flex-col items-center justify-center h-full p-6 pt-10 pb-10">
              <div className="flex flex-col gap-6 items-center w-full max-w-[400px]">
                {/* Success Icon */}
                <div className="bg-brand-cyan-pale flex items-center justify-center p-1 rounded-full">
                  <Check className="w-6 h-6 text-brand-cyan" />
                </div>

                {/* Success Heading */}
                <h1 className="text-5xl font-inter-display font-medium leading-44 tracking-tight text-center text-neutral-charcoal">
                  Payment Successful
                </h1>

                {/* Success Message */}
                <p className="text-text-secondary text-base font-inter leading-6 text-center w-full">
                  Your payment of USD 25 is complete. You can download the
                  invoice for the payment below
                </p>

                {/* Invoice Card */}
                <div className="w-full bg-white border border-border-medium rounded-2xl p-5 flex flex-col gap-2">
                  {/* Invoice Details */}
                  <div className="flex flex-col gap-2 items-start w-full">
                    <p className="text-text-secondary text-base font-inter font-medium leading-6">
                      Invoice ID #{invoiceId}
                    </p>
                    <p className="text-text-secondary text-base font-inter font-medium leading-6">
                      {paymentDate}
                    </p>
                  </div>

                  {/* Amount and Download */}
                  <div className="flex items-center justify-between w-full">
                    <p className="text-2xl font-inter-display font-medium leading-8 tracking-tight text-neutral-charcoal">
                      {amount}
                    </p>
                    <button
                      onClick={handleDownloadInvoice}
                      className="bg-neutral-light-gray flex items-center justify-center p-1 rounded-full hover:bg-border-dark transition-colors"
                    >
                      <Download className="w-6 h-6 text-text-light" />
                    </button>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  className="bg-brand-cyan-dark text-white font-inter px-6 py-3 rounded-2xl font-semibold text-base leading-6 hover:bg-brand-cyan-dark/90 transition-colors h-[57px] flex items-center justify-center w-full"
                >
                  Continue with consultation
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
