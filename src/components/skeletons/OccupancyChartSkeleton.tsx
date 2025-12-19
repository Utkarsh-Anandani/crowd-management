import { Skeleton } from "../ui/skeleton";

const OccupancyChartSkeleton = () => {
  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <Skeleton className="w-32 h-6" />
        <div className="flex flex-row items-center gap-1.5">
          <Skeleton className="w-24 h-4" />
        </div>
      </div>

      {/* Skeleton for the chart */}
      <div className="max-w-full overflow-auto pb-4">
        <div className="h-55 min-w-120 w-full bg-[#F2F2F2] rounded-lg">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default OccupancyChartSkeleton;
