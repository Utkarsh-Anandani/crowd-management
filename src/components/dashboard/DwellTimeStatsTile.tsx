import { useState, useEffect } from "react";
import type { Site } from "@/pages/DasboardPage";
import { API_BASE_URL } from "@/helpers/auth/loginHelper";

interface DwellTimeStatsTileProps {
  selectedSite?: Site | null;
  selectedDate: Date;
}

export function DwellTimeStatsTile({ selectedSite, selectedDate }: DwellTimeStatsTileProps) {
  const [avgDwellTime, setAvgDwellTime] = useState<number>(0);
  const [previousDayDwellTime, setPreviousDayDwellTime] = useState<number>(0);
  const [dwellChange, setDwellChange] = useState<string>("0% More than yesterday");
  const [loading, setLoading] = useState<boolean>(false);

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
        const startOfYesterdaySameTime = startOfYesterday.getTime();
        startOfYesterday.setHours(0, 0, 0, 0);
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

        const responseToday = await fetch(`${API_BASE_URL}/api/analytics/dwell`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBodyToday),
        });

        const dataToday = await responseToday.json();
        setAvgDwellTime(dataToday.avgDwellMinutes);

        const responseYesterday = await fetch(`${API_BASE_URL}/api/analytics/dwell`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBodyYesterday),
        });

        const dataYesterday = await responseYesterday.json();
        setPreviousDayDwellTime(dataYesterday.avgDwellMinutes);

        const dwellDiff = dataToday.avgDwellMinutes - dataYesterday.avgDwellMinutes;
        const dwellPercentChange = dataYesterday.avgDwellMinutes !== 0
          ? ((dwellDiff / dataYesterday.avgDwellMinutes) * 100).toFixed(2)
          : "0";
          if(Number(dwellPercentChange) > 0) {
            setDwellChange(`${dwellPercentChange}% More than yesterday`);
          } else {
            setDwellChange(`${-Number(dwellPercentChange)}% Less than yesterday`);
          }
      } catch (error) {
        console.error("Error fetching dwell time data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDwellTime();
  }, [selectedSite, selectedDate]);

  return (
    <div className="p-4 rounded-lg bg-white w-full lg:w-1/3">
      <div className="flex flex-col gap-4">
        <h4 className="font-medium text-[16px] text-[#030303] leading-[100%]">
          Avg Dwell Time
        </h4>
        {loading ? (
          <p className="font-medium text-2xl text-[#030303] leading-6">Loading...</p>
        ) : (
          <p className="font-medium text-2xl text-[#030303] leading-6">{avgDwellTime.toFixed(2)} minutes</p>
        )}
        <div className="flex flex-col gap-0.5">
          {dwellChange.includes("Less") ? <img className="w-4 h-4" src="/dashboard/fall.svg" alt="rise" /> : <img className="w-4 h-4" src="/dashboard/rise.svg" alt="rise" />}
          <span className="font-light text-sm text-[#030303] leading-3.5">
            {dwellChange}
          </span>
        </div>
      </div>
    </div>
  );
}
