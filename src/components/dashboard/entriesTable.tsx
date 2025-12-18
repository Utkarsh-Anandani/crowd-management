import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Site } from "@/pages/DasboardPage";
import { convertDecimalToTime } from "@/helpers/dashboard/time";
import { API_BASE_URL } from "@/helpers/auth/loginHelper";

interface VisitorTableProps {
  itemsPerPage?: number;
  selectedSite: Site | null;
  selectedDate: Date;
}

interface Visitor {
  personId: string;
  personName: string;
  gender: "male" | "female";
  zoneId: string;
  zoneName: string;
  severity: "low" | "medium" | "high";
  entryLocal: string;
  exitLocal: string | null;
  dwellMinutes: number | null;
}

interface ApiResponse {
  siteId: string;
  fromUtc: string;
  toUtc: string;
  pageSize: number;
  pageNumber: number;
  totalRecords: number;
  totalPages: number;
  records: Visitor[];
}

export function VisitorTable({
  itemsPerPage = 10,
  selectedDate,
  selectedSite,
}: VisitorTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = async () => {
    if (!selectedSite) return;
    setLoading(true);
    setError(null);

    try {
      const authToken = localStorage.getItem("auth_token");
      if (!authToken) throw new Error("Authentication token missing");

      const fromUtc = new Date(selectedDate.setHours(0, 0, 0, 0)).getTime();
      const toUtc = new Date(selectedDate.setHours(23, 59, 59, 999)).getTime();

      const response = await fetch(`${API_BASE_URL}/api/analytics/entry-exit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          siteId: selectedSite.siteId,
          toUtc: toUtc.toString(),
          fromUtc: fromUtc.toString(),
          pageNumber: currentPage,
          pageSize: itemsPerPage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch visitors data");
      }

      const data: ApiResponse = await response.json();

      setVisitors(data.records);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [selectedSite, selectedDate, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`h-8 w-8 text-sm ${
              currentPage === i
                ? "text-foreground font-medium border-b-2 border-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`h-8 w-8 text-sm ${
            currentPage === 1
              ? "text-foreground font-medium border-b-2 border-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        buttons.push(
          <button
            key={2}
            onClick={() => goToPage(2)}
            className="h-8 w-8 text-sm text-muted-foreground hover:text-foreground"
          >
            2
          </button>
        );
      }

      if (currentPage > 4) {
        buttons.push(
          <span
            key="ellipsis-start"
            className="h-8 w-8 flex items-center justify-center text-muted-foreground"
          >
            ...
          </span>
        );
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (i !== 1 && i !== totalPages) {
          buttons.push(
            <button
              key={i}
              onClick={() => goToPage(i)}
              className={`h-8 w-8 text-sm ${
                currentPage === i
                  ? "text-foreground font-medium border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {i}
            </button>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        buttons.push(
          <span
            key="ellipsis-end"
            className="h-8 w-8 flex items-center justify-center text-muted-foreground"
          >
            ...
          </span>
        );
      }

      buttons.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`h-8 w-8 text-sm ${
            currentPage === totalPages
              ? "text-foreground font-medium border-b-2 border-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="w-full mx-auto overflow-auto">
      <div className="bg-neutral-100 rounded-lg w-fit md:w-full border border-[#1A1A1A1A]">
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            <div className="w-full grid grid-cols-[200px_100px_100px_100px_150px] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b bg-[#E8E8E8] border-neutral-200 rounded-t-lg">
              <div className="text-sm font-medium text-foreground">Name</div>
              <div className="text-sm font-medium text-foreground">Sex</div>
              <div className="text-sm font-medium text-foreground">Entry</div>
              <div className="text-sm font-medium text-foreground">Exit</div>
              <div className="text-sm font-medium text-foreground">
                Dwell Time
              </div>
            </div>

            <div className="divide-y divide-neutral-200">
              {visitors.map((visitor) => (
                <div
                  key={visitor.personId}
                  className="grid grid-cols-[200px_100px_100px_100px_150px] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={visitor.zoneName || "/placeholder.svg"}
                        alt={visitor.personName}
                      />
                      <AvatarFallback>
                        {visitor.personName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-foreground">
                      {visitor.personName}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {visitor.gender}
                  </div>
                  <div className="text-sm text-foreground">
                    {visitor.entryLocal.split(" ")[1].slice(0, 5)}
                  </div>
                  <div className="text-sm text-foreground">
                    {visitor.exitLocal?.split(" ")[1].slice(0, 5) || "--"}
                  </div>
                  <div className="text-sm text-foreground">
                    {visitor.dwellMinutes
                      ? convertDecimalToTime(visitor.dwellMinutes)
                      : "--"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-center gap-1 px-6 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderPaginationButtons()}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
