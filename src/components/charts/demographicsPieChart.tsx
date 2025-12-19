import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import React, { useEffect, useState } from "react";
import type { Site } from "@/pages/DasboardPage";
import { API_BASE_URL, logout } from "@/helpers/auth/loginHelper";
import DemographicsAnalysisPieSkeleton from "../skeletons/DemographicsPieChartSkeleton";
import { useDispatch } from "react-redux";

interface PieChartProps {
  selectedSite: Site | null;
  selectedDate: Date;
}

const chartConfig = {
  male: {
    label: "Males",
    color: "#47B2B066",
  },
  female: {
    label: "Females",
    color: "#2A7F7D99",
  },
} satisfies ChartConfig;

export function DemographicsPieChart({
  selectedDate,
  selectedSite,
}: PieChartProps) {
  const [chartData, setChartData] = useState([
    { gender: "Male", count: 0, fill: chartConfig.male.color },
    { gender: "Female", count: 0, fill: chartConfig.female.color },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const toUtc = (date: Date): number => {
      return date.getTime();
    };

    const fetchDemographicsData = async () => {
      if (!selectedSite) return;
      setLoading(true);

      const fromUtc = toUtc(selectedDate) - 24 * 60 * 60 * 1000;
      const toUtcTime = toUtc(selectedDate);

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
              toUtc: toUtcTime,
              fromUtc: fromUtc,
            }),
          }
        );

        if (response.status === 403) {
          logout(dispatch);
          console.error("Invalid or Expired token");
        }

        const data = await response.json();

        if (data && data.buckets) {
          const totalMale = data.buckets.reduce(
            (acc: any, bucket: any) => acc + bucket.male,
            0
          );
          const totalFemale = data.buckets.reduce(
            (acc: any, bucket: any) => acc + bucket.female,
            0
          );

          setChartData([
            { gender: "Male", count: totalMale, fill: chartConfig.male.color },
            {
              gender: "Female",
              count: totalFemale,
              fill: chartConfig.female.color,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching demographics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemographicsData();
  }, [selectedSite, selectedDate]);

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  if (loading) {
    return <DemographicsAnalysisPieSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg py-4 flex flex-col w-full lg:items-start items-center lg:w-1/3">
      <h3 className="font-medium text-[16px] ml-4 text-[#1D1D1B]">
        Demographics Analysis
      </h3>
      <ChartContainer config={chartConfig} className="aspect-square h-50 w-50">
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="gender"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {Math.round((totalVisitors / totalVisitors) * 100)}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Crowd
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="flex flex-col gap-1 ml-4">
        <div className="flex flex-row items-center gap-3">
          <img src="/dashboard/male.svg" alt="male" />
          <p className="font-normal text-[16px] text-[#030303]">
            <span className="font-medium">
              {Math.round((chartData[0].count / totalVisitors) * 100)}%
            </span>{" "}
            Males
          </p>
        </div>
        <div className="flex flex-row items-center gap-3">
          <img src="/dashboard/female.svg" alt="female" />
          <p className="font-normal text-[16px] text-[#030303]">
            <span className="font-medium">
              {Math.round((chartData[1].count / totalVisitors) * 100)}%
            </span>{" "}
            Females
          </p>
        </div>
      </div>
    </div>
  );
}
