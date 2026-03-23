import { FEATURES } from "../constants/landing-data";

export function ValuePropSection() {
  return (
    <section className="mx-4 sm:mx-6 mb-16 md:mb-20">
      <div className="max-w-7xl w-full mx-auto bg-[#146D75] rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-16 text-center text-white">
        <h2 className="text-2xl md:text-[32px] text-[#F2F6F7] font-semibold mb-4">
          Your Care, Your Terms, <br /> Just a Click Away
        </h2>
        <p className="text-[#F2F6F7] text-sm md:text-base font-medium max-w-4xl mx-auto mb-8 md:mb-12 leading-relaxed">
          Quality care you can trust. Fast, affordable, and transparent — no
          hidden costs.
          <br className="hidden md:block" />
          Connect with licensed doctors in your state and get medical advice
          instantly, all from the comfort of your home.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8 md:mb-12">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4  text-left flex flex-col items-start gap-3 md:gap-4"
            >
              <div className="text-lg md:text-xl p-3 bg-[#E8F4F5] rounded">
               <img
                  src={f.image}
                  alt={f.title}
                  className="w-[20px] h-[20px] object-contain"
                />
              </div>
              <span className="text-[#1A202C] text-xs md:text-[18px] font-medium leading-tight">
                {f.title}
              </span>
            </div>
          ))}
        </div>

        {/* Doctor avatars */}
        <div className="flex justify-center -space-x-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-white overflow-hidden bg-gray-200"
            >
              <img
                src={`https://i.pravatar.cc/150?u=doc${i}`}
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
