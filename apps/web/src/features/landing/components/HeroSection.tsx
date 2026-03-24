import { useMemo, useState } from "react";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SelectDropdown } from "@/components/common/SelectDropdown";
import { SearchInput } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES, US_STATES } from "@/constants";
import { useConsultationStore } from "@/stores/consultation.store";
import type { HealthCategory } from "@sniffles/types";
import { SectionHeading } from "./SectionHeading";
import { HEALTH_CATEGORIES } from "../constants/landing-data";

export function HeroSection() {
  const navigate = useNavigate();
  const { setSelectedCategory } = useConsultationStore();
  const [selectedStateCode, setSelectedStateCode] = useState(US_STATES[0].code);

  const selectedState = useMemo(
    () =>
      US_STATES.find((state) => state.code === selectedStateCode) ??
      US_STATES[0],
    [selectedStateCode],
  );

  const stateOptions = useMemo(
    () =>
      US_STATES.map((state) => ({
        value: state.code,
        label: state.name,
        icon: (
          <img
            src={state.flag}
            alt={state.name}
            className="w-5 h-3 object-contain rounded-sm shrink-0"
          />
        ),
      })),
    [],
  );

  const handleCategoryClick = (category: HealthCategory) => {
    setSelectedCategory(category);
    navigate(ROUTES.SYMPTOMS);
  };

  return (
    <section className="app-shell my-14 md:mb-20">
      <div className="bg-[#EAF2F4] rounded-2xl sm:rounded-[3.5rem] px-4 py-8 sm:p-8 md:p-14 xl:p-16 2xl:px-20 2xl:py-18 text-center">
        <Button
          className="inline-flex items-center gap-4 text-[#F2F6F7]
  text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6
  md:mb-10"
        >
          <img
            src="/images/brain-circuit.png"
            alt="AI Assisted"
            className="w-4 h-4 object-contain"
          />
          AI Assisted
        </Button>

        <SectionHeading
          title={
            <>
              Start a medical <br className="hidden sm:block" />
              consultation in <span className="text-brand-600">minutes</span>
            </>
          }
          subtitle="Get expert medical care from licensed physicians, powered by
  intelligent AI intake and SOAP note generation."
        />

        <div className="w-full mb-6 md:mb-10">
          <div
            className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4
  w-full"
          >
            <SelectDropdown
              label="State"
              value={selectedState.code}
              options={stateOptions}
              onChange={setSelectedStateCode}
              className="sm:w-56 md:w-64"
            />

            <SearchInput
              placeholder="I have a sore throat and fever..."
              icon={<Mic className="h-5 w-5" />}
              containerClassName="flex-1 border border-gray-100 p-4 sm:p-5 transition-all hover:border-gray-200"
            />
          </div>

          <div className="flex justify-center mt-4">
            <Button
              className="bg-brand-700 hover:bg-brand-800 text-[#E8F4F5]
  font-medium text-sm rounded-xl px-8 h-11 sm:h-12"
            >
              Start Consultation
            </Button>
          </div>
        </div>

        <p className="text-sm text-[#4A5E63] mb-4">Our Treatments</p>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6
  mb-10 md:mb-16 max-w-[1120px] mx-auto"
        >
          {HEALTH_CATEGORIES.map((cat) => (
            <Card
              className="flex flex-col items-center justify-center border-none
  rounded-2xl shadow-sm hover:shadow-lg transition-shadow group cursor-pointer p-4
  sm:p-6 lg:p-8"
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <h3
                className="text-[#2F4246] font-medium text-sm sm:text-base
  tracking-tight"
              >
                {cat.title}
              </h3>
              <img
                src={cat.image}
                alt={cat.title}
                className="w-3/4 object-contain group-hover:scale-110 transition-
  transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </Card>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 sm:gap-5">
          <div className="flex -space-x-3">
            {[1, 2, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-4 border-
  white bg-neutral-100 overflow-hidden shadow-md"
              >
                <img
                  src={`/images/Ellipse ${i}.png`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="text-[#4A5E63] text-xs sm:text-sm">
            More than 100,000 patients treated by our doctors
          </p>
        </div>
      </div>
    </section>
  );
}
