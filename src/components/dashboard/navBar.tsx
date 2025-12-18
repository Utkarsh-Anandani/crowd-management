import { Menu, User } from "lucide-react";
import { DropdownMenu } from "./dropdownMenu";
import type { Site } from "@/pages/DasboardPage";

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleNotifications: () => void;
  selectedSite: Site | null;
  setSelectedSite: (site: Site | null) => void;
}

export function Navbar({
  selectedSite,
  setSelectedSite,
  onToggleSidebar,
  onToggleNotifications,
}: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm px-3 sm:px-4 lg:px-6 py-3 sm:py-3.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0 flex-1">
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onToggleSidebar}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <h1 className="text-sm sm:text-base lg:text-lg font-medium text-[#1E1E1F] whitespace-nowrap">
              Crowd Solutions
            </h1>
          </div>
          <div className="hidden md:block h-5.5 w-px bg-[#1E1E1F80]"></div>
          <div className="hidden sm:block min-w-0">
            <DropdownMenu
              selectedSite={selectedSite}
              setSelectedSite={setSelectedSite}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 shrink-0">
          <button className="hidden lg:flex h-12 flex-row items-center p-2 border border-[#E2E2EA] rounded-full cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-[#47B2B0] flex items-center justify-center text-white font-light text-sm">
              En
            </div>
            <img className="w-8 h-8" src="/dashboard/Sort.svg" alt="sort-by" />
          </button>
          <button
            onClick={onToggleNotifications}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Open notifications"
          >
            <img src="/dashboard/Bell.svg" alt="bell" className="w-5 h-5" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5E61] rounded-full"
              aria-hidden="true"
            ></span>
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-teal-600 transition-colors">
            <User size={16} className="sm:w-4.5 sm:h-4.5" />
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <div className="sm:hidden mt-3 pt-3 border-t border-gray-200">
        <DropdownMenu
          selectedSite={selectedSite}
          setSelectedSite={setSelectedSite}
        />
      </div>
    </nav>
  );
}