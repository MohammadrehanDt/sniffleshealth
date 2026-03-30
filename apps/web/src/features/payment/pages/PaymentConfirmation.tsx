import { Check, Download } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";

export default function PaymentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const payment = (
    location.state as {
      payment?: {
        requestedPaymentId?: string;
        invoiceId?: string | null;
        amount?: string | null;
        status?: string | null;
        currency?: string | null;
        createdAt?: string | null;
      };
    } | null
  )?.payment;

  const invoiceId =
    payment?.invoiceId ?? payment?.requestedPaymentId ?? "Pending";
  const paymentDate = payment?.createdAt
    ? new Date(payment.createdAt).toLocaleString()
    : "Awaiting Healthie invoice timestamp";
  const amount = payment?.amount ? `$${payment.amount}` : "Pending";
  const status = payment?.status ?? "Not Yet Paid";

  const handleDownloadInvoice = () => {
    window.print();
  };

  const handleContinue = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-neutral-light-gray flex flex-col">
      <div className="bg-neutral-off-white pt-4">
        {" "}
        <PageHeader showLogo={true} />
      </div>

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
                  Payment Requested
                </h1>

                {/* Success Message */}
                <p className="text-text-secondary text-base font-inter leading-6 text-center w-full">
                  We created your consultation invoice in Healthie. Payment is
                  no longer local-only, and the request is now tracked against
                  this consultation.
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
                    <p className="text-text-secondary text-base font-inter font-medium leading-6">
                      Status: {status}
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
                  Go to dashboard
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
