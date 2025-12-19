import { EntriesSection } from "@/components/dashboard/entriesSection";
import { Navbar } from "@/components/dashboard/navBar";
import { NotificationsPanel } from "@/components/dashboard/notificationPanel";
import { OverviewSection } from "@/components/dashboard/overviewSection";
import { Sidebar } from "@/components/dashboard/sideBar";
import { useEffect, useState } from "react";

type RouteType = "overview" | "entries";

export const defaultSite: Site = {
  siteId: "8bd0d580-fdac-44a4-a6e4-367253099c4e",
  name: "Dubai Mall",
  city: "Dubai",
  country: "UAE",
  timezone: "Asia/Dubai",
  zones: [
    {
      zoneId: "788ab32d-bc8f-4071-9dbc-0bf44ecdb6b1",
      name: "Dubai Mall HIGH Zone",
      securityLevel: "high",
    },
    {
      zoneId: "2201d536-2b05-4e47-a971-aba2129a3bbf",
      name: "Dubai Mall MEDIUM Zone",
      securityLevel: "medium",
    },
    {
      zoneId: "f100dd38-90f3-4e3e-a9f5-a3e40911c99c",
      name: "Dubai Mall LOW Zone",
      securityLevel: "low",
    },
  ],
};

export interface Zone {
  zoneId: string;
  name: string;
  securityLevel: "high" | "medium" | "low";
}

export interface Site {
  siteId: string;
  name: string;
  city: string;
  country: string;
  timezone: string;
  zones: Zone[];
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<RouteType>("overview");
  const [selectedSite, setSelectedSite] = useState<Site | null>(defaultSite);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const path: string = window.location.pathname;
    if (path.includes("/dashboard/entries")) {
      setCurrentRoute("entries");
    } else {
      setCurrentRoute("overview");
    }
  }, []);

  const handleNavigate = (route: RouteType): void => {
    setCurrentRoute(route);
    const newPath: string = `/dashboard/${route}`;
    window.history.pushState({}, "", newPath);
  };

  useEffect(() => {
    const handlePopState = (): void => {
      const path: string = window.location.pathname;
      if (path.includes("/dashboard/entries")) {
        setCurrentRoute("entries");
      } else {
        setCurrentRoute("overview");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const toggleSidebar = (): void => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = (): void =>
    setNotificationsOpen(!notificationsOpen);
  const closeNotifications = (): void => setNotificationsOpen(false);

  return (
    <main className="flex h-screen bg-gray-100 overflow-hidden font-plex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onClose={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          onToggleSidebar={toggleSidebar}
          onToggleNotifications={toggleNotifications}
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-2 md:p-6 bg-gray-50">
          {currentRoute === "overview" && (
            <OverviewSection
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              selectedSite={selectedSite}
            />
          )}
          {currentRoute === "entries" && (
            <EntriesSection
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              selectedSite={selectedSite}
            />
          )}
        </main>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={notificationsOpen}
        onClose={closeNotifications}
        selectedSite={selectedSite}
      />
    </main>
  );
}
