import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, BookOpen, Award, User, Settings, ChevronLeft, Menu, 
  Shield, Users, FileText, BarChart, Layers, Bell, GraduationCap, LogOut, X, FlaskConical
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

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-4 px-3 py-2 rounded-lg transition-all duration-300 group relative",
        active 
          ? "bg-gradient-to-r from-teal-500/20 to-lime-500/20 text-teal-500 font-medium dark:from-teal-500/10 dark:to-lime-500/10" 
          : "text-muted-foreground hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-lime-500/10 hover:text-teal-500"
      )}
      onClick={onClick}
    >
      <Icon size={20} className={cn("min-w-[20px]", active ? "text-teal-500" : "")} />
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
    { icon: Home, label: "الرئيسية", href: "/dashboard" },
    { icon: BookOpen, label: "الدورات", href: "/courses" },
    { icon: FlaskConical, label: "المختبرات", href: "/labs" },
    { icon: Award, label: "الإنجازات", href: "/achievements" },
    { icon: Settings, label: "الإعدادات", href: "/settings" },
  ];

  const adminNavItems = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Students", href: "/admin/students" },
    { icon: BookOpen, label: "Courses", href: "/admin/courses" },
    { icon: Shield, label: "Security", href: "/admin/security" },
    { icon: BarChart, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const navItems = location.pathname.includes("/admin") ? adminNavItems : studentNavItems;

  const toggleAdmin = () => {
    setIsAdmin(prev => !prev);
    window.location.href = location.pathname.includes("/admin") ? "/dashboard" : "/admin";
  };

  return (
    <aside 
      ref={sidebarRef}
      className={cn(
        "fixed top-0 right-0 z-40 h-screen border-l border-border transition-all duration-300 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "dark:bg-muted/10 dark:supports-[backdrop-filter]:bg-background/10",
        expanded ? "w-64" : "w-16"
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
            alt="Cyber Mentor Academy"
            className={cn("object-contain", expanded ? "h-12 w-12" : "h-10 w-10")}
          />
          {expanded && (
            <span className="text-xl font-semibold text-foreground">
              سايبر مينتور اكاديمي
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
          className="absolute -left-10 top-6 h-8 w-8 rounded-full bg-background border border-border hover:bg-teal-500/10"
        >
          <Menu className="h-4 w-4 text-teal-500" />
        </Button>
      )}

      <div className="px-3 py-2">
        <p className={cn(
          "text-xs text-muted-foreground font-medium mb-2 px-3 transition-all duration-300",
          !expanded && "opacity-0 absolute"
        )}>
          القائمة الرئيسية
        </p>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={location.pathname === item.href}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div 
          className={cn(
            "flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-lime-500/10 transition-colors",
            !expanded && "flex-col"
          )}
        >
          <Avatar className="h-10 w-10 border-2 border-teal-500/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted-foreground truncate">john.doe@example.com</p>
            </div>
          )}
          {expanded && (
            <Button variant="outline" size="sm" className="text-teal-500 border-teal-500/30 hover:bg-teal-500/10" onClick={toggleAdmin}>
              {location.pathname.includes("/admin") ? "Student" : "Admin"}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminNavbar;
