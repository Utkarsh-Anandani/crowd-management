import { useState, useEffect } from "react";
import type { Site } from "@/pages/DasboardPage";
import { API_BASE_URL, logout } from "@/helpers/auth/loginHelper";
import { useSocket } from "@/helpers/dashboard/socketContext";
import FootFallTileSkeleton from "../skeletons/FootfallTileSkeleton";
import { useDispatch } from "react-redux";

interface FootfallStatsTileProps {
  selectedSite?: Site | null;
  selectedDate: Date;
}

interface RequestBody {
  siteId: string;
  toUtc: string;
  fromUtc: string;
}

interface Notification {
  siteId: string;
  siteOccupancy: number;
  timestamp: string;
}

export function FootfallStatsTile({
  selectedSite,
  selectedDate,
}: FootfallStatsTileProps) {
  const [footfall, setFootfall] = useState<number>(0);
  const [footfallChange, setFootfallChange] = useState<string>(
    "0% More than yesterday"
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [liveOccupancy, setLiveOccupancy] = useState<Notification | null>(null);
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket || !selectedSite) return;

    socket.on("live_occupancy", (data: any) => {
      if (data.siteId === selectedSite.siteId) {
        const newNotification: Notification = {
          siteId: data.siteId,
          siteOccupancy: data.siteOccupancy,
          timestamp: new Date(data.ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        };

        setLiveOccupancy(newNotification);
      }
    });

    return () => {
      socket.off("live_occupancy");
    };
  }, [socket, selectedSite]);

  useEffect(() => {
    if (!selectedSite) return;

    const fetchFootfall = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem("auth_token");
        if (!authToken) {
          console.error("No auth token found");
          return;
        }

        const selectedDateStartOfDay = new Date(selectedDate);
        selectedDateStartOfDay.setHours(0, 0, 0, 0);
        const selectedDateTimestamp = selectedDateStartOfDay.getTime();

        const previousDayStartOfDay = new Date(selectedDate);
        previousDayStartOfDay.setDate(previousDayStartOfDay.getDate() - 1);
        const previousDateSameTime = previousDayStartOfDay.getTime();
        previousDayStartOfDay.setHours(0, 0, 0, 0);
        const previousDayTimestamp = previousDayStartOfDay.getTime();

        const requestBody = {
          siteId: selectedSite.siteId,
          toUtc: selectedDate.getTime().toString(),
          fromUtc: selectedDateTimestamp.toString(),
        };

        const previousDayRequestBody = {
          siteId: selectedSite.siteId,
          toUtc: previousDateSameTime.toString(),
          fromUtc: previousDayTimestamp.toString(),
        };

        const fetchData = async (body: RequestBody) => {
          const response = await fetch(
            `${API_BASE_URL}/api/analytics/footfall`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );
          if (response.status === 403) {
          logout(dispatch);
          console.error("Invalid or Expired token");
        }
          return await response.json();
        };

        const [selectedDayData, previousDayData] = await Promise.all([
          fetchData(requestBody),
          fetchData(previousDayRequestBody),
        ]);

        setFootfall(selectedDayData.footfall);

        const footfallDiff =
          selectedDayData.footfall - previousDayData.footfall;
        const footfallPercentChange =
          previousDayData.footfall !== 0
            ? ((footfallDiff / previousDayData.footfall) * 100).toFixed(2)
            : "0";

        setFootfallChange(
          Number(footfallPercentChange) > 0
            ? `${footfallPercentChange}% More than yesterday`
            : `${-Number(footfallPercentChange)}% Less than yesterday`
        );
      } catch (error) {
        console.error("Error fetching footfall data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFootfall();
  }, [selectedSite, selectedDate]);

  if (loading) {
    return <FootFallTileSkeleton />;
  }

  return (
    <div className="p-4 rounded-lg bg-white flex flex-col sm:flex-row items-start justify-start gap-5 sm:gap-20 w-full lg:w-2/3">
      <div className="flex flex-col gap-4">
        <h4 className="font-medium text-[16px] text-[#030303] leading-[100%]">
          Live Occupancy
        </h4>
        <p className="font-medium text-2xl text-[#030303] leading-6">
          {liveOccupancy?.siteOccupancy || "--"}
        </p>
        <div className="flex flex-col gap-0.5">
          <span className="font-light text-sm text-[#030303] leading-3.5">
            Last updated at {liveOccupancy?.timestamp || "--"}
          </span>
        </div>
      </div>
      <div className="w-0.5 h-26 bg-[#EBF2FF] sm:block hidden"></div>
      <div className="w-full h-0.5 bg-[#EBF2FF] sm:hidden block"></div>
      <div className="flex flex-col gap-4">
        <h4 className="font-medium text-[16px] text-[#030303] leading-[100%]">
          Today's Footfall
        </h4>

        <p className="font-medium text-2xl text-[#030303] leading-6">
          {footfall}
        </p>
        <div className="flex flex-col gap-0.5">
          {footfallChange.includes("Less") ? (
            <img className="w-4 h-4" src="/dashboard/fall.svg" alt="rise" />
          ) : (
            <img className="w-4 h-4" src="/dashboard/rise.svg" alt="rise" />
          )}
          <span className="font-light text-sm text-[#030303] leading-3.5">
            {footfallChange}
          </span>
        </div>
      </div>
    </div>
  );
}
