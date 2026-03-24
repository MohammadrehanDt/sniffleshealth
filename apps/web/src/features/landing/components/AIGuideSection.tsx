export function AIGuideSection() {
  return (
    <section className="app-shell mb-16 md:mb-20">
      <div className="w-full flex flex-col items-center">
        <div className="text-center mb-6">
          <h2 className="text-[#2F4246] text-2xl md:text-[32px] font-semibold mb-2">
            AI Guided Medical Intake
          </h2>
          <p className="text-[#2F4246] font-medium text-sm md:text-base max-w-sm mx-auto">
            Our AI walks you through a structured medical interview used by
            doctors.
          </p>
        </div>

        <div className="relative w-full max-w-[1180px] md:max-w-[962px] mx-auto">
          {/* Background image */}
          <div className="relative z-10">
            <img
              src="/images/AIGuide1.png"
              alt="Medical Intake Background"
              className="w-full h-auto block"
            />
          </div>

          {/* Floating follow-up card */}
          <div className="hidden sm:block absolute z-30 top-[61%] -left-4 md:-left-12 lg:-left-24 -translate-y-1/2 w-[45%] max-w-[448px] transition-transform hover:scale-[1.02] duration-300">
            <img
              src="/images/AIGuide2.png"
              alt="AI Follow-Up Questions"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          {/* Floating SOAP snippet */}
          <div className="hidden sm:block absolute z-20 bottom-[-15%] -right-4 md:-right-8 lg:-right-40 w-full max-w-[492px] transition-transform hover:scale-[1.02] duration-300">
            <img
              src="/images/AIGuide3.png"
              alt="Live SOAP Note Generation"
              className="w-full h-auto drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
