import { useState, useRef, useEffect } from "react";
import { Lock, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES, FONTS } from "@/constants";
import { useUserStore } from "@/stores";
import { PageHeader, AppFooter } from "@/components/layout";

export default function HIPAACompliance() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Check if scrolled to bottom (with 5px threshold for rounding)
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;
      setHasScrolledToEnd(isAtBottom);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      // Check initial state
      handleScroll();
      // Add scroll listener
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleAccept = () => {
    // Navigate to KYC page after accepting HIPAA compliance
    navigate(ROUTES.KYC);
  };

  return (
    <div className="min-h-screen bg-neutral-light-gray flex flex-col">
     <div className="bg-neutral-off-white pt-4"> <PageHeader showLogo={true} /></div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden bg-neutral-off-white flex items-center justify-center">
        <div className="max-w-[1464px] mx-auto p-6 w-full flex items-center justify-center">
          <div className="w-[966px] border border-neutral-gray rounded-3xl overflow-hidden relative  flex flex-col bg-gradient-to-b from-warm-50 to-white">
            {/* Content */}
            <div className="flex flex-col gap-6 items-center h-full p-6 pt-10 pb-6">
              <div className="flex flex-col gap-6 items-center justify-center w-full max-w-[651px] flex-1">
                {/* Lock Icon */}
                <div className="bg-warm-300 flex items-center justify-center p-1 rounded-full">
                  <Lock className="w-6 h-6 text-neutral-dark-gray" />
                </div>

                {/* Main Heading */}
                <h1 className="text-5xl font-inter-display font-medium leading-44 tracking-tight text-center text-neutral-charcoal">
                  HIPAA Compliance
                </h1>

                {/* Compliance Info Section */}
                <div className="flex flex-col gap-10 items-center w-full flex-1 ">
                  {/* Header Text */}
                  <div className="flex flex-col gap-2 items-center text-center">
                    <p className="text-text-dark text-base font-inter font-medium leading-6">
                      Sniffleshealth is compliant to HIPAA
                    </p>
                    <p className="text-text-secondary text-base font-inter font-normal leading-6 whitespace-nowrap">
                      Please read the privacy policy to continue with the
                      consultation
                    </p>
                  </div>

                  {/* HIPAA Guidelines Section */}
                  <div className="flex flex-col gap-2 items-center w-full flex-1 min-h-0">
                    <h2 className="text-text-dark text-base font-inter font-medium leading-6 text-center">
                      HIPAA Guidelines
                    </h2>

                    {/* Guidelines Text */}
                    <div
                      ref={scrollContainerRef}
                      className="flex flex-col items-center w-full h-[316px] overflow-y-auto"
                      onScroll={handleScroll}
                    >
                      <div className="text-text-secondary text-base font-inter font-normal leading-6 text-center w-full">
                        <p className="mb-0">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Curabitur iaculis nunc nec ipsum pretium, a
                          condimentum libero interdum. Cras ac nunc tempor,
                          aliquam tortor nec, hendrerit ipsum. Nam purus ligula,
                          maximus ac convallis nec, auctor in turpis. Morbi a
                          iaculis lacus, a sodales neque. Fusce quis porttitor
                          diam. Integer velit ante, varius sit amet elit ac,
                          laoreet imperdiet nulla. Etiam nec magna vel dolor
                          posuere laoreet. In at aliquet odio. Suspendisse id
                          lacus rutrum,
                        </p>
                        <p className="mb-0">&nbsp;</p>
                        <p className="mb-0">&nbsp;</p>
                        <p className="mb-0">
                          dignissim risus sit amet, viverra nulla. Proin
                          maximus, nulla quis elementum mattis, sapien purus
                          cursus purus, vitae tempus libero massa id nisl. Sed
                          pellentesque felis eu eros hendrerit pretium. Nulla
                          sit amet luctus felis, in pulvinar sapien.
                        </p>
                        <p className="mb-0">
                          Ut nunc elit, aliquam ut tempus quis, gravida vitae
                          quam. Lorem ipsum dolor sit amet, consectetur
                          adipiscing elit. Donec vulputate lectus sed neque
                          lobortis, quis cursus ex feugiat. Etiam mi ipsum,
                          tincidunt ut dui quis, dictum sollicitudin felis. Nunc
                          pulvinar mi ornare ipsum rutrum vehicula. Proin
                          consequat, nunc non congue egestas, lacus ipsum
                          accumsan turpis, vel aliquet velit ex eu ante. Donec
                          ut eros a justo egestas scelerisque id sit amet lacus.
                          Nulla fermentum felis lorem.
                        </p>
                        <p className="mb-0">
                          Praesent scelerisque auctor felis, vitae ultrices
                          ipsum rhoncus id. Aenean id metus lacus. Donec
                          scelerisque rhoncus urna, et gravida mauris sagittis
                          nec. Duis ac bibendum felis, non pharetra libero. Nunc
                          volutpat sed eros commodo faucibus. Praesent venenatis
                          iaculis velit, a venenatis sapien commodo sit amet.
                          Sed pretium in purus non gravida. Quisque nec neque id
                          eros cursus aliquam et vel lacus. Ut blandit lorem vel
                          varius tincidunt. Maecenas volutpat hendrerit tellus
                          quis tempor. Sed pharetra, orci eget fringilla
                          dignissim, nisi quam molestie arcu, sit amet feugiat
                          purus neque sed sapien. Cras semper augue sollicitudin
                          elit eleifend elementum. Quisque lacinia ipsum
                          ullamcorper sem auctor ultrices. Proin erat felis,
                          pharetra in semper nec, tempor eleifend neque.
                        </p>
                        <p>
                          Nunc mollis nunc at arcu tempus ultricies. Nulla quis
                          nibh mi. Pellentesque varius lacinia magna in egestas.
                          Sed tempus, diam sed iaculis euismod, augue sapien
                          iaculis massa, sed varius leo ex sit amet ligula.
                          Nulla libero elit, aliquet vel tempor id, suscipit sed
                          quam. Aliquam ut vestibulum dui. Sed fermentum
                          elementum velit eu varius. Curabitur fermentum
                          tincidunt sagittis. Donec commodo tellus eget
                          efficitur vehicula. Ut eu maximus quam. Aliquam quis
                          mattis est. Curabitur ultrices ex vitae urna iaculis,
                          sed sollicitudin diam venenatis. Pellentesque
                          elementum, turpis a lacinia molestie, ante dolor
                          vestibulum ante, et luctus dui ante at nulla.
                          Vestibulum et semper turpis, vel posuere purus.
                        </p>
                      </div>
                    </div>

                    {/* Scroll Message - Attention-grabbing design */}
                    {!hasScrolledToEnd && (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="flex items-center gap-3 bg-brand-cyan-dark border-2 border-brand-cyan-dark rounded-xl px-5 py-4 w-full shadow-sm">
                          <ChevronDown className="w-5 h-5 text-white flex-shrink-0 animate-bounce" />
                          <p className="text-white text-base font-inter font-semibold leading-6 text-center flex-1">
                            Please scroll to the end of the guidelines to
                            continue
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Accept Button */}
                    <button
                      onClick={handleAccept}
                      disabled={!hasScrolledToEnd}
                      className={`px-6 py-3 font-inter rounded-2xl font-semibold text-base leading-6 transition-colors  flex items-center justify-center w-full ${
                        hasScrolledToEnd
                          ? "bg-brand-cyan-dark text-white hover:bg-brand-cyan-dark/90 cursor-pointer"
                          : "bg-border-medium text-text-light cursor-not-allowed"
                      }`}
                    >
                      Accept and Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
}
