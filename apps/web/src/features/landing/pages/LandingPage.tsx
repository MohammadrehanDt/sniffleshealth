import {
  LandingHeader,
  HeroSection,
  HowItWorksSection,
  AIGuideSection,
  PricingSection,
  ValuePropSection,
  SearchCTASection,
  LandingFooter,
  TagGrid,
} from "../components";
import { CONDITIONS, NOT_COVERED } from "../constants/landing-data";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-inter text-neutral-800 overflow-x-hidden">
      <LandingHeader />
      <HeroSection />
      <HowItWorksSection />
      <AIGuideSection />
      <PricingSection />
      <ValuePropSection />

      <section className="mx-4 sm:mx-6 mb-16 md:mb-20">
        <TagGrid
          title="Conditions We Treat"
          subtitle="List of diseases we currently treat"
          items={CONDITIONS}
        />
      </section>

      <section className="mx-4 sm:mx-6 mb-16 md:mb-20">
        <TagGrid
          title="What's Not Covered"
          subtitle="Please note that we do not prescribe narcotics & sedatives"
          items={NOT_COVERED}
          variant="danger"
        />
      </section>

      <SearchCTASection />
      <LandingFooter />
    </div>
  );
}
