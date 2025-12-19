import { Skeleton } from "../ui/skeleton";

const DemographicsAnalysisSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4 w-full lg:w-2/3">
      <div className="flex flex-row items-center justify-between">
        <Skeleton className="w-48 h-6" />
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center gap-1.5">
            <Skeleton className="w-12 h-4" />
          </div>
          <div className="flex flex-row items-center gap-1.5">
            <Skeleton className="w-12 h-4" />
          </div>
        </div>
      </div>

      {/* Skeleton for the chart */}
      <div className="max-w-full overflow-auto pb-4">
        <div className="h-80 min-w-120 w-full bg-[#F2F2F2] rounded-lg">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default DemographicsAnalysisSkeleton;
