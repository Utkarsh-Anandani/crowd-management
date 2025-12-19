import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import type { Site } from "@/pages/DasboardPage";
import { API_BASE_URL, logout } from "@/helpers/auth/loginHelper";
import DemographicsAnalysisSkeleton from "../skeletons/DemographicsChartSkeleton";
import { useDispatch } from "react-redux";

interface DemographicsBucket {
  utc: number;
  local: string;
  male: number;
  female: number;
}

interface DemographicsApiResponse {
  siteId: string;
  fromUtc: number;
  toUtc: number;
  timezone: string;
  buckets: DemographicsBucket[];
}

const chartConfig = {
  male: {
    label: "Male",
    color: "#2A7F7D99",
  },
  female: {
    label: "Female",
    color: "#47B2B066",
  },
} satisfies ChartConfig;

interface DemographicsChartProps {
  selectedSite: Site | null;
  selectedDate: Date;
}

export function DemographicsChart({
  selectedDate,
  selectedSite,
}: DemographicsChartProps) {
  const [chartData, setChartData] = useState([
    { month: "", male: 0, female: 0 },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDemographicsData = async () => {
      if (!selectedSite) return;
      setLoading(true);

      const fromUtc = selectedDate.getTime() - 8 * 60 * 60 * 1000;
      const toUtc = selectedDate.getTime();

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/analytics/demographics`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify({
              siteId: selectedSite.siteId,
              toUtc,
              fromUtc,
            }),
          }
        );

        if (response.status === 403) {
          logout(dispatch);
          console.error("Invalid or Expired token");
        }

        const data: DemographicsApiResponse = await response.json();

        if (data && data.buckets) {
          const formattedData = data.buckets.map((bucket) => ({
            month: new Date(bucket.utc).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            male: bucket.male,
            female: bucket.female,
          }));

          setChartData(formattedData);
        }
      } catch (error) {
        console.error("Error fetching demographics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemographicsData();
  }, [selectedSite, selectedDate]);

  if (loading) {
    return <DemographicsAnalysisSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg p-4 flex flex-col gap-4 w-full lg:w-2/3">
      <div className="flex flex-row items-center justify-between">
        <h3 className="font-medium text-[16px] text-[#1D1D1B]">
          Demographics Analysis
        </h3>
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#2A7F7D99]"></div>
            <span className="font-light text-sm text-[#0D0D0DA1]">Male</span>
          </div>
          <div className="flex flex-row items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#47B2B066]"></div>
            <span className="font-light text-sm text-[#0D0D0DA1]">Female</span>
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-auto pb-4">
        <ChartContainer config={chartConfig} className="h-80 min-w-120 w-full">
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
              dataKey="month"
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
              <linearGradient id="fillMale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-male)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-male)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <defs>
              <linearGradient id="fillFemale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-female)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-female)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="male"
              type="natural"
              fill="url(#fillMale)"
              fillOpacity={0.4}
              stroke="var(--color-male)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="female"
              type="natural"
              fill="url(#fillFemale)"
              fillOpacity={0.4}
              stroke="var(--color-female)"
              strokeWidth={2}
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
