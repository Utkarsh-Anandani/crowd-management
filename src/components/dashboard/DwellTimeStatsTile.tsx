import { useState, useEffect } from "react";
import type { Site } from "@/pages/DasboardPage";
import { API_BASE_URL, logout } from "@/helpers/auth/loginHelper";
import DwellTimeTileSkeleton from "../skeletons/DwellTimeTileSkeleton";
import { useDispatch } from "react-redux";

interface DwellTimeStatsTileProps {
  selectedSite?: Site | null;
  selectedDate: Date;
}

interface RequestBody {
  siteId: string;
  toUtc: string;
  fromUtc: string;
}

export function DwellTimeStatsTile({
  selectedSite,
  selectedDate,
}: DwellTimeStatsTileProps) {
  const [avgDwellTime, setAvgDwellTime] = useState<number>(0);
  const [dwellChange, setDwellChange] = useState<string>(
    "0% More than yesterday"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedSite) return;

    const fetchDwellTime = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("auth_token");
        if (!authToken) {
          console.error("No auth token found");
          return;
        }

        const startOfToday = new Date(selectedDate);
        startOfToday.setHours(0, 0, 0, 0);
        const startOfTodayTimestamp = startOfToday.getTime();

        const startOfYesterday = new Date(selectedDate);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);
        const startOfYesterdaySameTime = startOfYesterday.getTime();
        const startOfYesterdayTimestamp = startOfYesterday.getTime();

        const requestBodyToday = {
          siteId: selectedSite.siteId,
          toUtc: selectedDate.getTime().toString(),
          fromUtc: startOfTodayTimestamp.toString(),
        };

        const requestBodyYesterday = {
          siteId: selectedSite.siteId,
          toUtc: startOfYesterdaySameTime.toString(),
          fromUtc: startOfYesterdayTimestamp.toString(),
        };

        const fetchData = async (body: RequestBody) => {
          const response = await fetch(`${API_BASE_URL}/api/analytics/dwell`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          });
          if (response.status === 403) {
            logout(dispatch);
            console.error("Invalid or Expired token");
          }
          return await response.json();
        };

        // Fetch both today's and yesterday's data concurrently
        const [dataToday, dataYesterday] = await Promise.all([
          fetchData(requestBodyToday),
          fetchData(requestBodyYesterday),
        ]);

        setAvgDwellTime(dataToday.avgDwellMinutes);

        // Calculate the dwell time change (percentage)
        const dwellDiff =
          dataToday.avgDwellMinutes - dataYesterday.avgDwellMinutes;
        const dwellPercentChange =
          dataYesterday.avgDwellMinutes !== 0
            ? ((dwellDiff / dataYesterday.avgDwellMinutes) * 100).toFixed(2)
            : "0";

        setDwellChange(
          Number(dwellPercentChange) > 0
            ? `${dwellPercentChange}% More than yesterday`
            : `${-Number(dwellPercentChange)}% Less than yesterday`
        );
      } catch (error) {
        console.error("Error fetching dwell time data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDwellTime();
  }, [selectedSite, selectedDate]);

  if (loading) {
    return <DwellTimeTileSkeleton />;
  }

  return (
    <div className="p-4 rounded-lg bg-white w-full lg:w-1/3">
      <div className="flex flex-col gap-4">
        <h4 className="font-medium text-[16px] text-[#030303] leading-[100%]">
          Avg Dwell Time
        </h4>
        <p className="font-medium text-2xl text-[#030303] leading-6">
          {avgDwellTime.toFixed(2)} minutes
        </p>
        <div className="flex flex-col gap-0.5">
          {dwellChange.includes("Less") ? (
            <img className="w-4 h-4" src="/dashboard/fall.svg" alt="rise" />
          ) : (
            <img className="w-4 h-4" src="/dashboard/rise.svg" alt="rise" />
          )}
          <span className="font-light text-sm text-[#030303] leading-3.5">
            {dwellChange}
          </span>
        </div>
      </div>
    </div>
  );
}
