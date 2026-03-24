import { HOW_IT_WORKS_STEPS } from "../constants/landing-data";

export function HowItWorksSection() {
  return (
    <section className="app-shell mb-16 md:mb-20">
      <div className="bg-gradient-to-br from-[#74AEB1] via-[#3B8288] to-[#125D64] py-10 md:py-12 lg:py-14 px-4 sm:px-8 xl:px-12 rounded-2xl sm:rounded-[2.5rem]">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold mb-2">
            How It Works
          </h2>
          <p className="text-white/90 text-base md:text-lg font-light">
            Four simple steps from symptoms to treatment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl px-4 py-6 flex flex-col items-center text-center shadow-sm"
            >
              <div className="bg-[#E9F3F4] rounded-xl p-4 flex items-center justify-center mb-6">
                <img
                  src={step.image}
                  alt={step.step}
                  className="w-8 h-8 object-contain"
                />
              </div>
              <span className="text-xs font-medium text-[#146D75] tracking-[0.15em] mb-3 uppercase">
                {step.step}
              </span>
              <h3 className="text-[#1A1A1A] text-base md:text-lg font-medium mb-4 leading-snug">
                {step.title}
              </h3>
              <p className="text-[#4A5E63] text-sm leading-relaxed font-normal">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
