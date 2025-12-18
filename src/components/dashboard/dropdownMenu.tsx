import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Location from "@/icons/Location";
import type { Site } from "@/pages/DasboardPage";
import { useDispatch } from "react-redux";
import { API_BASE_URL, logout } from "@/helpers/auth/loginHelper";

interface DropdownMenuProps {
  selectedSite: Site | null;
  setSelectedSite: (site: Site | null) => void;
  icon?: React.ReactNode;
  onChange?: (value: string) => void;
}

export function DropdownMenu({
  selectedSite,
  setSelectedSite,
  icon = <Location size={16} />,
  onChange,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const authToken = localStorage.getItem("auth_token");
        if (!authToken) return;

        const response = await fetch(
          `${API_BASE_URL}/api/sites`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        if (response.status === 403) {
          logout(dispatch);
          console.error("Invalid or Expired token");
        }
        const data = await response.json();
        setSites(data);
        setSelectedSite(data[0]);
      } catch (error) {
        console.error("Error fetching sites:", error);
      }
    };

    fetchSites();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (site: Site) => {
    setSelectedSite(site);
    setIsOpen(false);
    onChange?.(site.name);
  };

  return (
    <div className="relative inline-block w-full sm:w-auto" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-fit h-9 flex items-center justify-between gap-2 px-2 sm:px-3 bg-white border border-[#1E1E1F33] rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-gray-600 shrink-0">{icon}</span>
          <span className="text-sm sm:text-base font-normal text-[#1E1E1F] truncate">
            {selectedSite?.name || "Select a Site"}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-[#1E1E1F] transition-transform shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 sm:w-fit sm:min-w-50 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-[60vh] overflow-y-auto">
          {sites.map((site) => (
            <button
              key={site.siteId}
              onClick={() => handleSelect(site)}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                selectedSite?.siteId === site.siteId
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-700"
              }`}
            >
              {site.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}