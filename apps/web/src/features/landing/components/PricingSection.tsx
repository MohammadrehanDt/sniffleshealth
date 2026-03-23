import { PRICING_DATA } from "../constants/landing-data";

export function PricingSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 text-center">
      <h2 className="text-[#1B2B2E] text-2xl md:text-[32px] font-semibold mb-2">
        Simple, Transparent Pricing
      </h2>
      <p className="text-[#1B2B2E] text-sm md:text-base font-medium mb-8 md:mb-12">
        No hidden fees. Pay per visit or subscribe for ongoing care.
      </p>

      <div className="max-w-4xl mx-auto overflow-x-auto">
        <div className="min-w-[400px]">
          {/* Table header */}
          <div className="grid grid-cols-3 gap-1">
            <div className="bg-[#F5F8F9] rounded-l-lg" />
            <div className="bg-[#77BCC2] py-4 md:py-6 text-white font-medium text-sm md:text-base">
              Chat Consultation
            </div>
            <div className="bg-[#146D75] py-4 md:py-6 text-white font-medium text-sm md:text-base rounded-r-lg">
              Audio or Video Consultation
            </div>
          </div>

          {/* Table rows */}
          {PRICING_DATA.map((row, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-1 mt-1">
              <div className="bg-[#F5F8F9] py-4 md:py-5 text-gray-600 text-sm font-medium flex items-center justify-center">
                {row.label}
              </div>
              <div className="bg-[#F5F8F9] py-4 md:py-5 text-[#1B7F88] text-sm md:text-base font-semibold flex items-center justify-center">
                {row.chat}
              </div>
              <div className="bg-[#F5F8F9] py-4 md:py-5 text-[#1B7F88] text-sm md:text-base font-semibold flex items-center justify-center">
                {row.video}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
