import { EntriesSection } from "@/components/dashboard/entriesSection";
import { Navbar } from "@/components/dashboard/navBar";
import { NotificationsPanel } from "@/components/dashboard/notificationPanel";
import { OverviewSection } from "@/components/dashboard/overviewSection";
import { Sidebar } from "@/components/dashboard/sideBar";
import { useEffect, useState } from "react";

type RouteType = "overview" | "entries";

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
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
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
