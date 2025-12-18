import type { Site } from "@/pages/DasboardPage";
import { DateSelect } from "./dateSelect";
import { VisitorTable } from "./entriesTable";

interface EntriesSectionProps {
  selectedDate: Date;
  selectedSite: Site | null;
  setSelectedDate: (date: Date) => void;
}

export function EntriesSection({
  selectedDate,
  selectedSite,
  setSelectedDate,
}: EntriesSectionProps) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl font-medium text-[#1D1D1B]">Crowd Entries</h2>
        <DateSelect
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <VisitorTable selectedSite={selectedSite} selectedDate={selectedDate} />
    </div>
  );
}
