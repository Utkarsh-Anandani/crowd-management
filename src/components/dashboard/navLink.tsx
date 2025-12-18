type RouteType = 'overview' | 'entries';

interface NavLinkProps {
  route: RouteType;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  currentRoute: RouteType;
  onClick: (route: RouteType) => void;
  sidebarOpen: boolean;
}

export const NavLink: React.FC<NavLinkProps> = ({ 
  route, 
  icon: Icon, 
  label, 
  currentRoute, 
  onClick,
  sidebarOpen 
}) => {
  const isActive: boolean = currentRoute === route;
  
  return (
    <button
      onClick={() => onClick(route)}
      className={`w-full h-12.5 flex items-center gap-4 ${sidebarOpen ? "p-4" : "p-2 justify-center"} rounded-sm transition-colors text-white font-normal text-[16px] relative cursor-pointer ${
        isActive
          ? 'bg-[#FFFFFF4D]'
          : 'bg-transparent'
      }`}
      aria-label={label}
      aria-current={isActive ? 'page' : undefined}
    >
      {isActive && <div className="w-1.5 h-8.5 bg-white rounded-full absolute left-0 top-1/2 -translate-y-1/2"></div>}
      <Icon size={20} />
      <span 
        className={`whitespace-nowrap transition-opacity duration-500 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 hidden w-0 overflow-hidden'
        }`}
      >
        {label}
      </span>
    </button>
  );
};