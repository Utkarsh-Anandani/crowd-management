import { useSocket } from "@/helpers/dashboard/socketContext";
import type { Site } from "@/pages/DasboardPage";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Severity = 'Low' | 'Medium' | 'High';

interface Notification {
  personName: string;
  severity: Severity;
  zoneName: string;
  timestamp: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSite: Site | null;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose, selectedSite }) => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket || !selectedSite) return;

    socket.on("alert", (data: any) => {
      if (data.siteId === selectedSite.siteId) {
        const newNotification: Notification = {
          personName: data.personName,
          severity: data.severity as Severity,
          zoneName: data.zoneName,
          timestamp: new Date(data.ts).toLocaleString(),
        };

        setNotifications((prevNotifications) => {
          const updatedNotifications = [newNotification, ...prevNotifications];
          if (updatedNotifications.length > 10) {
            updatedNotifications.pop();
          }
          return updatedNotifications;
        });
      }
    });

    return () => {
      socket.off("alert");
    };
  }, [socket, selectedSite]);

  return (
    <>
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <h3 className="text-base font-semibold text-gray-900">Alerts</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close notifications"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>
        <div className="p-3 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
          {notifications.map((notification, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg border ${
                notification.severity === 'High' 
                  ? 'bg-red-50 border-red-100' 
                  : notification.severity === 'Medium' 
                  ? 'bg-orange-50 border-orange-100' 
                  : 'bg-teal-50 border-teal-100'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-xs text-gray-600">{notification.timestamp}</div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    notification.severity === 'High' 
                      ? 'bg-red-600 text-white' 
                      : notification.severity === 'Medium' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-teal-600 text-white'
                  }`}
                >
                  {notification.severity}
                </span>
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{notification.personName} Entered</p>
              <p className="text-xs text-gray-600 flex items-center">
                <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {notification.zoneName}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[#0000004C] z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};