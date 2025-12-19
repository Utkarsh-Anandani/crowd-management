import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Site } from "@/pages/DasboardPage";
import { API_BASE_URL, logout } from "@/helpers/auth/loginHelper";
import OccupancyChartSkeleton from "../skeletons/OccupancyChartSkeleton";
import { useDispatch } from "react-redux";

const chartConfig = {
  occ: {
    label: "Occ",
    color: "#009490",
  },
} satisfies ChartConfig;

interface OccupancyChartProps {
  selectedSite: Site | null;
  selectedDate: Date;
}

export function OccupancyChart({
  selectedDate,
  selectedSite,
}: OccupancyChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedSite) return;
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("auth_token");

        if (!authToken) {
          throw new Error("Authentication token is missing");
        }

        const timestampLast10hrs = new Date(selectedDate);
        timestampLast10hrs.setHours(timestampLast10hrs.getHours() - 10);

        const response = await fetch(
          `${API_BASE_URL}/api/analytics/occupancy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              siteId: selectedSite?.siteId,
              toUtc: new Date(selectedDate).getTime().toString(),
              fromUtc: timestampLast10hrs.getTime().toString(),
            }),
          }
        );

        if (response.status === 403) {
          logout(dispatch);
          console.error("Invalid or Expired token");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        const formattedData = data.buckets.map((bucket: any) => ({
          time: new Date(bucket.utc).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          occ: bucket.avg,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSite, selectedDate]);

  if (loading) {
    return <OccupancyChartSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <h3 className="font-medium text-[16px] text-[#1D1D1B]">
          Overall Occupancy
        </h3>
        <div className="flex flex-row items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#009490]"></div>
          <span className="font-light text-sm text-[#0D0D0DA1]">Occupancy</span>
        </div>
      </div>
      <div className="max-w-full overflow-auto pb-4">
        <ChartContainer config={chartConfig} className="h-55 min-w-120 w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -10,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillOccupancy" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-occ)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-occ)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="occ"
              type="natural"
              fill="url(#fillOccupancy)"
              fillOpacity={0.4}
              stroke="var(--color-occ)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
