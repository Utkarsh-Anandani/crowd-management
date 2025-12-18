import { NavLink } from "./navLink";
import { Entries } from "@/icons/Entries";
import { Overview } from "@/icons/Overview";
import { Logout } from "@/icons/Logout";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/helpers/auth/loginHelper";

type RouteType = "overview" | "entries";

interface SidebarProps {
  isOpen: boolean;
  currentRoute: RouteType;
  onNavigate: (route: RouteType) => void;
  onClose: () => void;
}

export function Sidebar({ isOpen, currentRoute, onNavigate, onClose }: SidebarProps) {
  const dispatch = useDispatch();
  function handleLogout() {
    logout(dispatch);
  }
  return (
    <aside
      className={`bg-gray-800 text-white transition-all bg-cover bg-center bg-no-repeat duration-300 ease-in-out flex flex-col fixed lg:relative top-0 left-0 h-full z-50 ${
        isOpen ? "w-60" : "w-16 -translate-x-full lg:translate-x-0"
      }`}
      style={{
        backgroundImage: "url('/dashboard/sidebar-bg.png')",
        backgroundSize: "100% 100%",
      }}
    >
      {/* Logo Section with Close Button */}
      <div
        className={`p-3 flex items-center justify-between ${!isOpen ? "justify-center" : ""}`}
      >
        <div className={!isOpen ? "hidden" : ""}>
          {isOpen ? (
            <img src="/login/logo.png" alt="logo" />
          ) : (
            <img src="/dashboard/logo.png" alt="logo" />
          )}
        </div>
        {isOpen && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-gray-700 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        )}
        {!isOpen && (
          <img src="/dashboard/logo.png" alt="logo" />
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        <NavLink
          route="overview"
          icon={Overview}
          label="Overview"
          currentRoute={currentRoute}
          onClick={onNavigate}
          sidebarOpen={isOpen}
        />
        <NavLink
          route="entries"
          icon={Entries}
          label="Crowd Entries"
          currentRoute={currentRoute}
          onClick={onNavigate}
          sidebarOpen={isOpen}
        />
      </nav>

      {/* Logout Button */}
      <div className="px-3 py-5">
        <button
          className={`w-full flex items-center gap-4 ${
            isOpen ? "p-4" : "p-2 justify-center"
          } rounded-sm text-white font-normal text-[16px] cursor-pointer transition-colors`}
          aria-label="Logout"
          onClick={handleLogout}
        >
          <Logout size={20} />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-0 hidden w-0 overflow-hidden"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}