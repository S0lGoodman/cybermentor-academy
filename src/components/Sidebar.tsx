import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, BookOpen, Award, User, Settings, ChevronLeft, Menu, 
  Shield, Users, FileText, BarChart, Layers, Bell, GraduationCap, LogOut, X, FlaskConical, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SidebarContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expanded, setExpanded] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded, isAdmin, setIsAdmin }}>
      {children}
    </SidebarContext.Provider>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, href, active, onClick }) => {
  const { expanded } = useSidebar();
  const location = useLocation();
  
  // Check if the current path starts with the href (for nested routes)
  const isActive = active || location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-4 px-3 py-2 rounded-lg transition-all duration-300 group relative",
        isActive 
          ? "bg-gradient-to-r from-teal-500/20 to-lime-500/20 text-teal-500 font-medium dark:from-teal-500/10 dark:to-lime-500/10" 
          : "text-muted-foreground hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-lime-500/10 hover:text-teal-500"
      )}
      onClick={onClick}
    >
      <Icon size={20} className={cn("min-w-[20px]", isActive ? "text-teal-500" : "")} />
      <span className={cn(
        "text-sm whitespace-nowrap",
        expanded ? "opacity-100 visible" : "opacity-0 invisible w-0"
      )}>
        {label}
      </span>
    </Link>
  );
};

export const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const { expanded, setExpanded, setIsAdmin } = useSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expanded && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('button[data-expand-trigger="true"]')) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded, setExpanded]);

  const studentNavItems = [
    { icon: Home, label: "الرئيسية", href: "/student/dashboard" },
    { icon: BookOpen, label: "الدورات", href: "/student/courses" },
    { icon: FlaskConical, label: "المختبرات", href: "/student/labs" },
    { icon: Trophy, label: "لوحة المتصدرين", href: "/student/leaderboard" },
    { icon: Award, label: "الإنجازات", href: "/student/achievements" },
    { icon: Settings, label: "الإعدادات", href: "/student/settings" },
  ];

  const adminNavItems = [
    { icon: Home, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Students", href: "/admin/students" },
    { icon: BookOpen, label: "Courses", href: "/admin/courses" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const navItems = location.pathname.includes("/admin") ? adminNavItems : studentNavItems;

  const toggleAdmin = () => {
    setIsAdmin(prev => !prev);
    window.location.href = location.pathname.includes("/admin") ? "/student/dashboard" : "/admin/dashboard";
  };

  return (
    <aside 
      ref={sidebarRef}
      className={cn(
        "fixed top-0 z-40 h-screen border-border transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "dark:bg-muted/10 dark:supports-[backdrop-filter]:bg-background/10",
        expanded ? "w-64" : "w-16",
        location.pathname.includes("/admin") 
          ? "left-0 border-r" 
          : "right-0 border-l"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setExpanded(prev => !prev)}
          className={cn("text-teal-500 hover:bg-teal-500/10", !expanded && "hidden")}
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform rotate-180", !expanded && "rotate-0")} />
        </Button>
        <div className={cn("flex items-center gap-2", expanded ? "" : "justify-center w-full")}>
          <img 
            src="/logo.png" 
            alt="CyberMentor Academy"
            className={cn("object-contain", expanded ? "h-12 w-12" : "h-10 w-10")}
          />
          {expanded && (
            <span className="text-xl font-semibold text-foreground">
              Cybermentor Academy
            </span>
          )}
        </div>
      </div>

      {!expanded && (
        <Button 
          variant="ghost" 
          size="icon" 
          data-expand-trigger="true"
          onClick={() => setExpanded(true)}
          className={cn(
            "absolute top-6 h-8 w-8 rounded-full bg-background border border-border hover:bg-teal-500/10",
            location.pathname.includes("/admin") ? "-right-10" : "-left-10"
          )}
        >
          <Menu className="h-4 w-4 text-teal-500" />
        </Button>
      )}

      <div className="px-3 py-2">
        <p className={cn(
          "text-xs text-muted-foreground font-medium mb-2 px-3 transition-all duration-300",
          !expanded && "opacity-0 absolute"
        )}>
          {location.pathname.includes("/admin") ? "Main Menu" : "القائمة الرئيسية"}
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={item.href === location.pathname}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 space-y-2">
        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "w-full text-red-500 hover:bg-red-500/10 hover:text-red-500",
            !expanded && "px-2"
          )}
          onClick={() => {
            // Add logout logic here
            window.location.href = "/login";
          }}
        >
          <LogOut size={20} className="min-w-[20px]" />
          <span className={cn(
            "mr-2",
            expanded ? "opacity-100 visible" : "opacity-0 invisible w-0"
          )}>
            {location.pathname.includes("/admin") ? "Logout" : "تسجيل الخروج"}
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default AdminNavbar;
