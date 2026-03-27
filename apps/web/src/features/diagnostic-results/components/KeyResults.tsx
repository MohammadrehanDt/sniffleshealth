interface KeyResultsProps {
  markers: { label: string; value: string }[];
  status: "Normal" | "Abnormal" | "Pending";
  noWrapper?: boolean;
}

export function KeyResults({ markers, status, noWrapper = false }: KeyResultsProps) {
  const content = (
    <div className="flex flex-col">
      <div className="flex justify-between items-center w-[342.33px] h-[22px] mb-4 opacity-100">
        <h3 className="w-[89px] h-[19px] font-inter font-medium text-[16px] leading-[120%] text-[#000000] tracking-normal opacity-100">
          Key Results
        </h3>
        {status === "Normal" ? (
          <div className="flex items-center justify-center w-[61px] h-[22px] bg-[#2E9E6F] rounded-[30px] p-[4px_10px] gap-2 opacity-100">
            <span className="w-[41px] h-[14px] font-inter font-normal text-[12px] leading-[120%] text-[#F2F6F7] tracking-normal opacity-100 whitespace-nowrap flex items-center justify-center">
              Normal
            </span>
          </div>
        ) : (
          <div className="bg-rose-50 text-rose-700 text-[12px] font-medium px-[10px] py-[4px] rounded-full leading-tight border border-rose-100">
            {status}
          </div>
        )}
      </div>

      <ul className="flex flex-col list-none p-0 m-0 w-[132px] h-[68px] opacity-100 gap-1">
        {markers.map((marker, index) => (
          <li key={index} className="font-inter font-normal text-[14px] leading-[14px] text-[#4A5E63] flex items-center tracking-normal opacity-100">
            <span className="w-1 h-1 rounded-full bg-neutral-300 mr-2" />
            <span className="mr-1">{marker.label}</span>
            <span>{marker.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  if (noWrapper) {
    return content;
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-300 p-6 h-full shadow-none">
      {content}
    </div>
  );
}
