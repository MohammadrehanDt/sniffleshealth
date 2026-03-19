import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MapPin, Printer } from "lucide-react";
import { ROUTES } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { usePharmacyStore } from "@/stores";

export default function PharmacyConfirmation() {
  const navigate = useNavigate();
  const { order } = usePharmacyStore();

  // Redirect if no order exists
  useEffect(() => {
    if (!order) {
      navigate(ROUTES.PRESCRIPTION);
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  const handleGoToDashboard = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-neutral-off-white flex flex-col">
      <PageHeader showLogo={true} />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-neutral-off-white">
        <div className="max-w-[1464px] mx-auto p-6">
          <div className="flex items-center justify-center ]">
            {/* Confirmation Card */}
            <div className="border border-neutral-gray rounded-3xl w-[786px]  flex flex-col p-6 bg-gradient-to-b from-warm-50 via-warm-50 to-white">
              {/* Header with Back Button */}
              <div className="flex items-center mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(ROUTES.PHARMACY_SELECTION)}
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-neutral-gray bg-neutral-off-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] opacity-90 hover:opacity-100 transition-opacity"
                  >
                    <ArrowLeft className="w-6 h-6 text-text-primary" />
                  </button>
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-sm font-inter leading-5">
                      #34FDMDF
                    </span>
                    <span className="text-text-dark text-base font-inter font-medium leading-6">
                      Your Prescription from Dr. Sarah
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmation Content */}
              <div className="flex-1 flex flex-col items-center justify-center gap-6 p-10">
                {/* Success Icon and Message */}
                <div className="flex flex-col gap-3 items-center mb-6">
                  <div className="border-4 border-semantic-green border-solid flex items-center justify-center w-10 h-10 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)]">
                    <Check className="w-6 h-6 text-semantic-green" />
                  </div>
                  <h1 className="text-text-charcoal text-2xl font-display font-medium tracking-tight text-center max-w-[327px]">
                    Prescription was send to the pharmacy
                  </h1>
                </div>

                {/* Pharmacy Card */}
                <div className="w-full max-w-[435px]">
                  <div className="bg-neutral-light-gray rounded-t-2xl rounded-b-xl p-1">
                    <div className="bg-white border border-neutral-dark-gray rounded-2xl p-5 flex gap-2 items-start relative">
                      {/* Print Button */}
                      <button className="absolute right-[10.5px] top-[10.5px] flex items-center justify-center w-10 h-10 rounded-full border border-neutral-gray bg-neutral-off-white shadow-[0px_2px_4px_0px_rgba(0,0,0,0.03)] opacity-90 hover:opacity-100 transition-opacity">
                        <Printer className="w-6 h-6 text-text-primary" />
                      </button>

                      <div className="flex-1 flex flex-col gap-1">
                        <p className="text-text-primary text-base font-inter font-medium">
                          {order.pharmacy.name}
                        </p>
                        <p className="text-neutral-stone text-base font-inter font-normal">
                          {order.pharmacy.address}
                        </p>
                        <p className="text-neutral-stone text-base font-inter font-medium">
                          {order.pharmacy.distance}
                        </p>
                      </div>
                    </div>
                    {/* Pickup Time */}
                    <div className="flex gap-2 items-center px-3 py-2">
                      <MapPin className="w-3 h-3 text-neutral-dark-gray" />
                      <p className="text-neutral-slate text-sm font-inter font-medium">
                        Pickup available from {order.pickupTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Go to Dashboard Button */}
                <Button
                  onClick={handleGoToDashboard}
                  className="bg-brand-cyan-dark h-[57px] px-6 py-2.5 rounded-2xl hover:bg-brand-cyan-dark/90 text-white text-base font-inter font-semibold"
                >
                  Go to health dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}

