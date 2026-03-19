import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  ChevronDown,
  Mic,
  ChevronRight,
  Lock,
  ArrowDown,
  Stethoscope,
  FileSignature,
  Clock,
  X,
  Check,
  Smile,
  ChevronLeft,
} from "lucide-react";
import { useDebounce } from "@/hooks";
import { Logo } from "@/components/layout";
import { ROUTES } from "@/constants";
import type { HealthCategory } from "@sniffles/types";
import { useConsultationStore } from "@/stores/consultation.store";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// US States with enabled/disabled status
const US_STATES = [
  { name: "Alabama", code: "AL", enabled: false },
  { name: "Alaska", code: "AK", enabled: false },
  { name: "Arizona", code: "AZ", enabled: true },
  { name: "Arkansas", code: "AR", enabled: false },
  { name: "California", code: "CA", enabled: true },
  { name: "Colorado", code: "CO", enabled: true },
  { name: "Connecticut", code: "CT", enabled: true },
  { name: "Delaware", code: "DE", enabled: false },
  { name: "Florida", code: "FL", enabled: true },
  { name: "Georgia", code: "GA", enabled: true },
  { name: "Hawaii", code: "HI", enabled: false },
  { name: "Idaho", code: "ID", enabled: false },
  { name: "Illinois", code: "IL", enabled: true },
  { name: "Indiana", code: "IN", enabled: false },
  { name: "Iowa", code: "IA", enabled: false },
  { name: "Kansas", code: "KS", enabled: false },
  { name: "Kentucky", code: "KY", enabled: false },
  { name: "Louisiana", code: "LA", enabled: false },
  { name: "Maine", code: "ME", enabled: false },
  { name: "Maryland", code: "MD", enabled: true },
  { name: "Massachusetts", code: "MA", enabled: true },
  { name: "Michigan", code: "MI", enabled: true },
  { name: "Minnesota", code: "MN", enabled: false },
  { name: "Mississippi", code: "MS", enabled: false },
  { name: "Missouri", code: "MO", enabled: false },
  { name: "Montana", code: "MT", enabled: false },
  { name: "Nebraska", code: "NE", enabled: false },
  { name: "Nevada", code: "NV", enabled: true },
  { name: "New Hampshire", code: "NH", enabled: false },
  { name: "New Jersey", code: "NJ", enabled: true },
  { name: "New Mexico", code: "NM", enabled: false },
  { name: "New York", code: "NY", enabled: true },
  { name: "North Carolina", code: "NC", enabled: true },
  { name: "North Dakota", code: "ND", enabled: false },
  { name: "Ohio", code: "OH", enabled: true },
  { name: "Oklahoma", code: "OK", enabled: false },
  { name: "Oregon", code: "OR", enabled: true },
  { name: "Pennsylvania", code: "PA", enabled: true },
  { name: "Rhode Island", code: "RI", enabled: false },
  { name: "South Carolina", code: "SC", enabled: false },
  { name: "South Dakota", code: "SD", enabled: false },
  { name: "Tennessee", code: "TN", enabled: true },
  { name: "Texas", code: "TX", enabled: true },
  { name: "Utah", code: "UT", enabled: false },
  { name: "Vermont", code: "VT", enabled: false },
  { name: "Virginia", code: "VA", enabled: true },
  { name: "Washington", code: "WA", enabled: true },
  { name: "West Virginia", code: "WV", enabled: false },
  { name: "Wisconsin", code: "WI", enabled: false },
  { name: "Wyoming", code: "WY", enabled: false },
];

const ROTATING_FEATURES = [
  {
    title: "No hidden fees",
    description: "Transparent pricing with no surprise charges.",
  },
  {
    title: "Same day prescriptions",
    description: "Prescriptions sent to your local pharmacy the same day.",
  },
  {
    title: "Licensed in your state",
    description: "Care from clinicians licensed where you live.",
  },
  {
    title: "Secure medical records",
    description: "Your health data is encrypted and HIPAA-compliant.",
  },
];

const SEARCH_PREFIX = "I have ";

const SEARCH_EXAMPLES = [
  "I have a fever for 3 days",
  "I have a rash on my arm",
  "I have a medication refill request",
  "I have burning when I pee",
  "I have asthma and shortness of breath",
];

export default function Index() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, { delay: 300 });
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [selectedState, setSelectedState] = useState("NY");
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [searchExampleIndex, setSearchExampleIndex] = useState(0);
  const [displayedSearchExample, setDisplayedSearchExample] = useState(
    SEARCH_EXAMPLES[0],
  );
  const [isDeletingSearchExample, setIsDeletingSearchExample] = useState(false);

  // Rotate right-side feature list (keeps the stream of features changing)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % ROTATING_FEATURES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Typewriter-style search examples in the "Don't know what to search?" input
  useEffect(() => {
    const currentIndex = searchExampleIndex;
    const nextIndex = (currentIndex + 1) % SEARCH_EXAMPLES.length;
    const nextFull = SEARCH_EXAMPLES[nextIndex];

    const minLength = SEARCH_PREFIX.length;

    const timeout = setTimeout(() => {
      if (isDeletingSearchExample) {
        // Delete down to the common prefix, then switch to typing next example
        if (displayedSearchExample.length > minLength) {
          setDisplayedSearchExample((prev) => prev.slice(0, -1));
        } else {
          setIsDeletingSearchExample(false);
          setSearchExampleIndex(nextIndex);
        }
      } else {
        // Typing phase for the next example
        if (displayedSearchExample === nextFull) {
          // When finished typing, wait a bit longer before starting to delete
          setTimeout(() => {
            setIsDeletingSearchExample(true);
          }, 1800);
        } else {
          setDisplayedSearchExample((prev) =>
            nextFull.slice(0, prev.length + 1),
          );
        }
      }
    }, isDeletingSearchExample ? 40 : 70);

    return () => clearTimeout(timeout);
  }, [displayedSearchExample, isDeletingSearchExample, searchExampleIndex]);

  // Calculate slides to scroll based on screen size
  const getSlidesToScroll = () => {
    if (typeof window === "undefined") return 4;
    if (window.innerWidth >= 1024) return 4; // lg: 4 items
    if (window.innerWidth >= 640) return 2; // sm: 2 items
    return 1; // mobile: 1 item
  };

  // Custom scroll handlers that scroll by full page
  const scrollPrev = () => {
    if (!carouselApi) return;
    const currentIndex = carouselApi.selectedScrollSnap();
    const slidesToScroll = getSlidesToScroll();
    const newIndex = Math.max(0, currentIndex - slidesToScroll);
    carouselApi.scrollTo(newIndex);
  };

  const scrollNext = () => {
    if (!carouselApi) return;
    const currentIndex = carouselApi.selectedScrollSnap();
    const slidesToScroll = getSlidesToScroll();
    const totalSlides = carouselApi.scrollSnapList().length;
    const newIndex = Math.min(totalSlides - 1, currentIndex + slidesToScroll);
    carouselApi.scrollTo(newIndex);
  };

  // Update scroll state when carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const updateScrollState = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };

    updateScrollState();
    carouselApi.on("select", updateScrollState);
    carouselApi.on("reInit", updateScrollState);

    return () => {
      carouselApi.off("select", updateScrollState);
      carouselApi.off("reInit", updateScrollState);
    };
  }, [carouselApi]);

  // Handle debounced search - this could trigger API calls or filtering
  useEffect(() => {
    if (debouncedSearchQuery) {
      // TODO: Implement search functionality when API layer is ready
      // This would trigger search API call or filter results
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    // Smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth";

    // Intersection Observer for fade-in animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // For cards, use fade-in-up
            if (entry.target.classList.contains("fade-in-card")) {
              entry.target.classList.add("animate-fade-in-up");
              entry.target.classList.remove("opacity-0");
            }
            // For sections, use fade-in-from-bottom
            if (entry.target.classList.contains("fade-in-section")) {
              entry.target.classList.add("animate-fade-in-from-bottom");
              entry.target.classList.remove("opacity-0");
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      },
    );

    // Observe all cards and sections
    const cardElements = document.querySelectorAll(".fade-in-card");
    const sectionElements = document.querySelectorAll(".fade-in-section");
    const allElements = [...cardElements, ...sectionElements];
    allElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full px-8 md:px-8 lg:px-8 pt-8 pb-0">
        <div className="max-w-100 mx-auto">
          <div className="bg-brand-cyan-light rounded-3xl px-6 md:px-12 lg:px-18 pt-10 md:pt-10 pb-0 flex flex-col gap-8 md:gap-15">
            {/* Logo */}
            <Logo size="lg" />

            {/* Header */}
            <div className="w-full max-w-[1256px] flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter-display font-medium  leading-tight tracking-display-tighter">
                {/* <span className="text-neutral-charcoal">Get your </span> */}
                <span className="text-brand-cyan-dark">Consultation</span>
                <span className="text-neutral-charcoal"> in minutes,</span> <br></br>
                <span className="text-neutral-charcoal">
                AI powered healthcare for everyone            
              </span>
              </h1>
              
              
            </div>

            {/* Search Section */}
            <div className="w-full flex flex-col justify-center items-center gap-2">
              {/* Location & Search Bar */}
              <div className="w-full flex flex-col md:flex-row justify-center items-stretch gap-3">
               

                {/* Search Bar */}
                {/* <div className="flex-1 flex items-center gap-2 bg-neutral-off-white rounded-4xl px-4 py-3">
                  <Search className="w-5 h-5 text-text-secondary opacity-75" />
                  <input
                    type="text"
                    placeholder="Search By Name, keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-neutral-slate text-sm font-inter"
                  />
                  <button className="w-8 h-8 rounded-full bg-neutral-charcoal flex items-center justify-center">
                    <Mic className="w-4 h-4 text-border-medium" />
                  </button>
                </div> */}
              </div>

              {/* Health Concern Cards */}
              <div className="w-full relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: false,
                  }}
                  setApi={setCarouselApi}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <HealthCard
                        title="Fever and Flu"
                        description="Cold, cough and flu like symptoms"
                        image="https://api.builder.io/api/v1/image/assets/TEMP/2a54dd3f127905324c4ca0ea85747e7b1a044797?width=390"
                        category="FEVER_FLU"
                      />
                    </CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <HealthCard
                        title="Skin Issues"
                        description="Rashes, acne, and skin concerns"
                        image="https://api.builder.io/api/v1/image/assets/TEMP/aa9faffe1110604dcdf0c3c3820831b0b5c53ba7?width=390"
                        category="SKIN_ISSUES"
                      />
                    </CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <HealthCard
                        title="Infections"
                        description="Rashes, acne, and skin concerns"
                        image="https://api.builder.io/api/v1/image/assets/TEMP/9fb210009a698441291125022f5997ec6aba0e3f?width=390"
                        category="INFECTIONS"
                      />
                    </CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <HealthCard
                        title="Sexual Health"
                        description="Rashes, acne, and skin concerns"
                        image="https://api.builder.io/api/v1/image/assets/TEMP/5b2757d6b7f35f77966035b8cc5904d5bdff6fc9?width=390"
                        category="SEXUAL_HEALTH"
                      />
                    </CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <HealthCard
                        title="Medication Refill"
                        description="Prescription and Medicine refills"
                        image="/images/medication.png"
                        category="MEDICATION_REFILL"
                      />
                    </CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <HealthCard
                        title="Asthma & Allergies"
                        description="Respiratory issues and asthma"
                        image="/images/asthma.png"
                        category="ASTHMA_ALLERGIES"
                      />
                    </CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <HealthCard
                        title="UTIs and Yeast Infection"
                        description="Urinary and vaginal health concerns"
                        image="/images/uti.png"
                        category="UTIS_YEAST_INFECTION"
                      />
                    </CarouselItem>
                    <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
                      <HealthCard
                        title="Weight Loss"
                        description="Weight loss and management"
                        image="/images/weight.png"
                        category="WEIGHT_LOSS"
                      />
                    </CarouselItem>
                  </CarouselContent>
                  <button
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border border-border-medium hover:bg-neutral-light-gray text-neutral-charcoal shadow-lg hover:border-brand-cyan-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    aria-label="Previous slides"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border border-border-medium hover:bg-neutral-light-gray text-neutral-charcoal shadow-lg hover:border-brand-cyan-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                    aria-label="Next slides"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Carousel>
              </div>

              {/* Bottom Badges */}
              <div className="w-full flex flex-row md:flex-row sm:flex-row justify-between items-center gap-4 px-1 pb-8">
                {/* <div className="flex items-center gap-2 bg-brand-cyan-lighter rounded-2xl px-6 py-3 shadow-sm">
                  <Lock className="w-6 h-6 text-text-secondary" />
                  <span className="text-text-secondary font-inter font-semibold text-base">
                    HIPAA compliant
                  </span>
                </div> */}
                 {/* Location Selector */}
                 <TooltipProvider>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="flex items-center gap-2 bg-neutral-off-white rounded-4xl px-4 py-3 h-auto border-none shadow-none focus:ring-0 focus:ring-offset-0 w-auto min-w-[160px]">
                      <MapPin className="w-6 h-6 text-text-secondary flex-shrink-0" />
                      <SelectValue className="text-text-dark font-inter-d font-semibold text-base">
                        {US_STATES.find((s) => s.code === selectedState)?.name || "New York"}
                      </SelectValue>
                      <div className={`w-[9px] h-[9px] rounded-full flex-shrink-0 ${
                        US_STATES.find((s) => s.code === selectedState)?.enabled
                          ? "bg-semantic-green"
                          : "bg-gray-400"
                      }`}></div>
                      {/* <ChevronDown className="w-6 h-6 text-text-secondary flex-shrink-0" /> */}
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] bg-white border-border-medium">
                      {US_STATES.map((state) => {
                        if (!state.enabled) {
                          return (
                            <Tooltip key={state.code}>
                              <TooltipTrigger asChild>
                                <div
                                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm opacity-50 text-gray-400 hover:bg-gray-50"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                  }}
                                >
                                  <span className="text-left font-inter-display font-medium">{state.name}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-neutral-charcoal text-white border-none">
                                <p>Services are not available in this state</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        }
                        return (
                          <SelectItem
                            key={state.code}
                            value={state.code}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-left font-inter-display font-medium">{state.name}</span>
                              <div className="w-2 h-2 rounded-full bg-semantic-green ml-2"></div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </TooltipProvider>
                {/* <div className="flex items-center gap-2 rounded-3xl px-6 py-4 shadow-sm">
                  <ArrowDown className="w-6 h-6 text-text-secondary" />
                  <span className="text-text-secondary font-inter  text-base">
                    Scroll down to see how
                  </span>
                </div> */}
                <div className="flex items-center gap-2 bg-brand-cyan-lighter rounded-4xl px-6 py-3 shadow-sm">
                  <Lock className="w-4 h-4 text-text-secondary" />
                  <span className="text-text-secondary font-inter font-semibold text-base">
                    HIPAA compliant
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-4 md:px-8 lg:px-8 pt-8 md:pt-10 fade-in-section opacity-0">
        <div className=" mx-auto">
          <div className="bg-gradient-to-br from-brand-cyan-darker to-brand-cyan-darker justify-center items-center rounded-3xl px-6 md:px-8 lg:px-20 py-12 md:py-20 relative overflow-hidden">
            {/* Content Container */}
            <div className="relative z-10 flex flex-col sm:flex-col md:flex-col lg:flex-col items-start gap-8 md:gap-12">
              {/* Left Content */}
              <div className="flex-1 flext-col sm:w-full md:w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-8">
                  <img
                    src="/images/Ellipse 1.png"
                    alt="Doctor"
                    className="w-12 h-12 rounded-full"
                  />
                  <img
                    src="/images/Ellipse 2.png"
                    alt="Doctor"
                    className="w-12 h-12 rounded-full -ml-4"
                  />
                  <img
                    src="/images/Ellipse 4.png"
                    alt="Doctor"
                    className="w-12 h-12 rounded-full -ml-4"
                  />
                </div>
                <h2 className="text-white text-4xl md:text-5xl lg:text-6xl  font-inter-display tracking-tighter font-medium mb-6 leading-tight">
                  Your Care, Your Terms, <br></br>Just a Click Away
                </h2>
                <p className="text-white/90 text-base md:text-lg font-inter-display font-regular  max-w-xl">
                  Quality care you can trust. Fast, affordable, and
                  transparent—no hidden costs. Connect with licensed doctors in
                  your state and get medical advice instantly, all from the
                  comfort of your home.
                </p>
              
              </div>

              {/* Right Feature Cards */}
              
                <div className="flex flex-row gap-5">
                  <FeatureCard
                    icon={<Stethoscope className="w-6 h-6 text-text-dark" />}
                    title="Top licensed doctors"
                    className="bg-brand-cyan-light"
                  />
                  <FeatureCard
                    icon={<FileSignature className="w-6 h-6 text-text-dark" />}
                    title="No Insurance Required"
                    className="bg-brand-cyan-light"
                  />
                  <FeatureCard
                    icon={<Clock className="w-6 h-6 text-text-dark" />}
                    title="Instant, within 15 mins appointments"
                    className="bg-brand-cyan-pale-blue"
                  />
                   <FeatureCard
                    icon={<Lock className="w-6 h-6 text-text-dark" />}
                    title="No hidden fees"
                    className="bg-brand-cyan-pale-blue"
                  />
                   <FeatureCard
                    icon={<FileSignature className="w-6 h-6 text-text-dark" />}
                    title="Same day prescriptions"
                    className="bg-brand-cyan-pale-blue"
                  />
                </div>
                {/* <div className="hidden md:flex flex-col mt-0 md:mt-12  overflow-hidden"> */}
                  {/* <div className="animate-feature-ticker">
                    <FeatureCard
                      icon={<FileSignature className="w-6 h-6 text-text-dark" />}
                      title={ROTATING_FEATURES[activeFeatureIndex].title}
                      className="bg-brand-cyan-pale-blue"
                    />
                  </div> */}
                {/* </div> */}

            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full px-4 md:px-8 lg:px-8 pt-8 md:pt-10 fade-in-section opacity-0">
        <div className=" mx-auto">
          <div className="bg-bg-dark rounded-3xl px-6 md:px-12 lg:px-20 py-12 md:py-20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-6 justify-center items-start">
            <h2 className="text-cyan-50 text-xl md:text-xl lg:text-2xl px-8 text-center font-quincy font-regular">
                Don't see your symptoms? Directly search for it
              </h2>
              <div className="w-full flex items-center gap-6 bg-brand-cyan/5 rounded-3xl border-2 border-white/10 px-6 py-6">
                <Search className="w-8 h-8 text-cyan-300" />
                <input
                  type="text"
                  placeholder={displayedSearchExample}
                  className="flex-1 bg-transparent border-none outline-none text-warm-300 text-2xl md:text-3xl lg:text-4xl font-inter-display font-regular placeholder:text-cyan-200 tracking-display-normal transition-opacity duration-150"
                />
              </div>
             
            </div>
          </div>
        </div>
      </section>

      {/* What We Treat Section */}
      <section className="w-full px-4 md:px-8 lg:px-8 pt-8 md:pt-10 fade-in-section opacity-0">
        <div className=" mx-auto">
          <div className="bg-brand-cyan-light rounded-3xl px-6 md:px-12 lg:px-20 py-12 md:py-20 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-6">
              {/* Left Side */}
              <div className="flex flex-col gap-8 lg:gap-6 lg:h-full">
                <h2 className="text-cyan-800 text-3xl md:text-4xl lg:text-6xl font-inter-display font-medium tracking-display-tight">
                  We have you covered for
                </h2>
                <div className="w-full overflow-hidden bg-cyan-800 p-4 rounded-2xl relative left-[-5%]">
                  <div className="flex flex-nowrap gap-10 animate-conditions-ticker ">
                    <ConditionItem text="Strep Throat" />
                    <ConditionItem text="UTIs" />
                    <ConditionItem text="Pneumonia" />
                    <ConditionItem text="Stye Eye" />
                    <ConditionItem text="Shingles" />
                    <ConditionItem text="Genital Herpes" />
                    <ConditionItem text="GERD" />
                    <ConditionItem text="Cold Sores" />
                    <ConditionItem text="Gastritis" />
                    <ConditionItem text="Birth Control" />
                    <ConditionItem text="Diabetic Management" />
                    <ConditionItem text="Oral Herpes" />
                    {/* Duplicate list for seamless streaming effect */}
                    <ConditionItem text="Strep Throat" />
                    <ConditionItem text="UTIs" />
                    <ConditionItem text="Pneumonia" />
                    <ConditionItem text="Stye Eye" />
                    <ConditionItem text="Shingles" />
                    <ConditionItem text="Genital Herpes" />
                    <ConditionItem text="GERD" />
                    <ConditionItem text="Cold Sores" />
                    <ConditionItem text="Gastritis" />
                    <ConditionItem text="Birth Control" />
                    <ConditionItem text="Diabetic Management" />
                    <ConditionItem text="Oral Herpes" />
                    {/* Third pass to keep the stream dense */}
                    <ConditionItem text="Strep Throat" />
                    <ConditionItem text="UTIs" />
                    <ConditionItem text="Pneumonia" />
                    <ConditionItem text="Stye Eye" />
                    <ConditionItem text="Shingles" />
                    <ConditionItem text="Genital Herpes" />
                    <ConditionItem text="GERD" />
                    <ConditionItem text="Cold Sores" />
                    <ConditionItem text="Gastritis" />
                    <ConditionItem text="Birth Control" />
                    <ConditionItem text="Diabetic Management" />
                    <ConditionItem text="Oral Herpes" />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <Check className="w-10 h-10 text-cyan-800 " />
                  <Lock className="w-10 h-10 text-cyan-800" />
                  <Smile className="w-10 h-10 text-cyan-800" />
                </div>
              </div>

          
            </div>
          </div>
        </div>
      </section>

      {/* What We Don't Treat Section */}
      <section className="w-full px-4 md:px-8 lg:px-8 pt-8 md:pt-10 pb-12 fade-in-section opacity-0">
        <div className=" mx-auto">
          <div className="bg-warm-50 rounded-3xl px-6 md:px-12 lg:px-20 py-12 md:py-20">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              {/* Left Side */}
              <div className="flex flex-col justify-center items-center gap-2">
                <div className="flex flex-col flex-grow  w-full gap-2 text-center items-center justify-center">
                <div className="flex items-center gap-0">
                  <X className="w-10 h-10 text-red-600" />
                  <X className="w-10 h-10 text-red-600" />
                  <X className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-slate-800 text-2xl md:text-2xl lg:text-2xl font-inter-display font-medium max-w-sm opacity-100 tracking-display-normal">
                  What's not covered yet
                </h2>
                <p className="text-slate-700 opacity-70 text-lg md:text-lg font-inter-display font-regular text-left tracking-tight">
                  Please note that we do not prescribe narcotics & sedatives
                </p>
               
                </div>
               
               <div className="w-full overflow-hidden opacity-100 pt-4 rounded-2xl text-center">
                 <div className="flex flex-wrap gap-4 items-center justify-center pb-2">
                   <DontTreatItem text="Spinal injuries" />
                   <DontTreatItem text="Chest pains" />
                   <DontTreatItem text="Coughing up blood" />
                   <DontTreatItem text="Severe burns" />
                   <DontTreatItem text="Birth control" />
                   <DontTreatItem text="Lacerations" />
                   <DontTreatItem text="Broken bones" />
                   <DontTreatItem text="Vomiting blood" />
                   <DontTreatItem text="Blood in stools" />
                   <DontTreatItem text="Oral herpes" />
                  
                 </div>
               </div>
               
              </div>

              {/* Right Side - Conditions Grid */}
              
            </div>
          
          </div>
        </div>
      </section>
    </div>
  );
}

function HealthCard({
  title,
  description,
  image,
  category,
}: {
  title: string;
  description: string;
  image: string;
  category: HealthCategory;
}) {
  const navigate = useNavigate();
  const { setSelectedCategory } = useConsultationStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedCategory(category);
    navigate(ROUTES.SYMPTOMS);
  };

  return (
    <div
      onClick={handleClick}
      className="fade-in-card opacity-0 bg-neutral-off-white rounded-3xl p-6 flex flex-col justify-center items-center gap-3 transition-all duration-500 hover:shadow-lg cursor-pointer"
    >
      <div className="w-full flex flex-col justify-center items-start gap-1">
        <div className="w-full flex items-start justify-between gap-1">
          <h3 className="flex-1 text-neutral-slate text-lg font-inter-display font-semibold">
            {title}
          </h3>
          <ChevronRight className="w-6 h-6 text-text-dark" />
        </div>
        <p className="text-neutral-stone text-sm font-inter">{description}</p>
      </div>
      <img
        src={image}
        alt={title}
        className="w-full max-w-[195px] object-contain"
        loading="lazy"
      />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  className = "",
}: {
  icon: React.ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`fade-in-card opacity-0 w-full max-w-[321px] min-w-[200px] sm:w-full md:w-full lg:w-1/2 rounded-3xl p-6 flex flex-col justify-between items-start gap-3 shadow-md transition-all duration-500 ${className}`}
    >
      {icon}
      <h3 className="text-text-dark text-xl md:text-xl font-quincy font-medium leading-6">
        {title}
      </h3>
    </div>
  );
}

function ConditionItem({
  text,
  active = false,
}: {
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`${active ? "text-warm-100" : "text-warm-50"} text-2xl md:text-2xl lg:text-3xl font-inter-display font-medium text-left tracking-tighter whitespace-nowrap`}
    >
      {text}
    </div>
  );
}

function DontTreatItem({ text }: { text: string }) {
  return (
    <div className="text-slate-600 whitespace-nowrap px-3 py-1 bg-white shadow-md rounded-2xl text- md:text-lg lg:text-lg font-inter-display font-medium leading-tight tracking-tight">
      {text}
    </div>
  );
}
