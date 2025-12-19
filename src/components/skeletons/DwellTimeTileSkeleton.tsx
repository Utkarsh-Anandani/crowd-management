import { Skeleton } from "../ui/skeleton";

const DwellTimeTileSkeleton = () => {
  return (
    <div className="p-4 rounded-lg bg-white w-full lg:w-1/3">
      <div className="flex flex-col gap-4">
        <h4 className="font-medium text-[16px] text-[#030303] leading-[100%]">
          Avg Dwell Time
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

export default DwellTimeTileSkeleton;
