import {
  HeroSection,
  HowItWorksSection,
  AIGuideSection,
  PricingSection,
  ValuePropSection,
  SearchCTASection,
  TagGrid,
} from "../components";
import { CONDITIONS, NOT_COVERED } from "../constants/landing-data";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-inter text-neutral-800 overflow-x-hidden">
      <HeroSection />
      <HowItWorksSection />
      <AIGuideSection />
      <PricingSection />
      <ValuePropSection />

      <section className="app-shell mb-16 md:mb-20">
        <TagGrid
          title="Conditions We Treat"
          subtitle="List of diseases we currently treat"
          items={CONDITIONS}
        />
      </section>

      <section className="app-shell mb-16 md:mb-20">
        <TagGrid
          title="What's Not Covered"
          subtitle="Please note that we do not prescribe narcotics & sedatives"
          items={NOT_COVERED}
          variant="danger"
        />
      </section>

      <SearchCTASection />
    </div>
  );
}
