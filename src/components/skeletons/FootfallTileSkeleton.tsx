import { Skeleton } from "../ui/skeleton";

const FootFallTileSkeleton = () => {
  return (
    <div className="p-4 rounded-lg bg-white flex flex-col sm:flex-row items-start justify-start gap-5 sm:gap-20 w-full lg:w-2/3">
      {/* Live Occupancy Section */}
      <div className="flex flex-col gap-4">
        <h4 className="font-medium text-[16px] text-[#030303] leading-[100%]">
          Live Occupancy
        </h4>
        <Skeleton className="w-24 h-6" />
        <div className="flex flex-col gap-0.5">
          <span className="font-light text-sm text-[#030303] leading-3.5">
            <Skeleton className="w-32 h-4" />
          </span>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="w-0.5 h-26 bg-[#EBF2FF] sm:block hidden"></div>
      <div className="w-full h-0.5 bg-[#EBF2FF] sm:hidden block"></div>

      {/* Today's Footfall Section */}
      <div className="flex flex-col gap-4">
        <h4 className="font-medium text-[16px] text-[#030303] leading-[100%]">
          Today's Footfall
        </h4>
        <Skeleton className="w-24 h-6" />
        <div className="flex flex-col gap-0.5">
          <Skeleton className="w-4 h-4" />
          <span className="font-light text-sm text-[#030303] leading-3.5">
            <Skeleton className="w-24 h-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default FootFallTileSkeleton;
