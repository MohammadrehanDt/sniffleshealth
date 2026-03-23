import { Mic } from "lucide-react";
import { SearchInput } from "@/components/common";

export function SearchCTASection() {
  return (
    <section className="mx-4 sm:mx-6 mb-16 md:mb-20">
      <div className="max-w-7xl w-full mx-auto bg-[#146D75] rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 md:p-14 text-center text-white">
        <h2 className="text-xl sm:text-2xl md:text-[32px] font-semibold text-[#F2F6F7] mb-6 md:mb-10">
          Don't see your symptoms? Directly search for it
        </h2>

      <SearchInput
              placeholder="I have a sore throat and fever..."
              icon={<Mic className="h-5 w-5" />}
              containerClassName="flex-1 border border-gray-100 p-4 sm:p-5 transition-all hover:border-gray-200"
            />
      </div>
    </section>
  );
}
