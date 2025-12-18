import type { Site } from "@/pages/DasboardPage";
import { DemographicsChart } from "../charts/demographicsChart";
import { DemographicsPieChart } from "../charts/demographicsPieChart";
import { OccupancyChart } from "../charts/occupancyChart";
import { DateSelect } from "./dateSelect";
import { FootfallStatsTile } from "./FootfallStatsTile";
import { DwellTimeStatsTile } from "./DwellTimeStatsTile";

interface OverviewSectionProps {
  selectedDate: Date;
  selectedSite: Site | null;
  setSelectedDate: (date: Date) => void;
}

export const OverviewSection = ({
  selectedDate,
  selectedSite,
  setSelectedDate,
}: OverviewSectionProps) => {
  return (
    <div className="w-full mx-auto flex flex-col gap-4 md:gap-6 px-2 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-lg sm:text-xl font-medium text-[#1D1D1B]">Overview</h2>
        <DateSelect
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="flex flex-col gap-3 md:gap-4">
        <h3 className="font-medium text-base sm:text-lg text-[#1D1D1B] leading-5">
          Occupancy
        </h3>
        <div className="w-full flex flex-col lg:flex-row items-stretch gap-3">
          <FootfallStatsTile selectedSite={selectedSite} selectedDate={selectedDate} />
          <DwellTimeStatsTile selectedSite={selectedSite} selectedDate={selectedDate} />
        </div>
        <OccupancyChart selectedSite={selectedSite} selectedDate={selectedDate} />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="font-medium text-base sm:text-lg text-[#1D1D1B] leading-5">
          Demographics
        </h3>
        <div className="w-full flex flex-col lg:flex-row items-stretch gap-3">
          <DemographicsPieChart selectedSite={selectedSite} selectedDate={selectedDate} />
          <DemographicsChart selectedSite={selectedSite} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};