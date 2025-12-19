import { Skeleton } from "../ui/skeleton";

const DemographicsAnalysisPieSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4 w-full lg:w-1/3">
      <div className="flex flex-row items-center justify-between">
        <Skeleton className="w-48 h-6" />
      </div>

      {/* Skeleton for the chart */}
      <div className="max-w-full overflow-hidden pb-4">
        <div className="h-80 w-full bg-[#F2F2F2] rounded-lg">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default DemographicsAnalysisPieSkeleton;
