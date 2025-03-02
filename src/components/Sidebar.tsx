
import React, { createContext, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, BookOpen, Award, User, Settings, ChevronLeft, Menu, 
  Shield, Users, FileText, BarChart, Layers, Bell
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
        "flex items-center gap-4 px-3 py-2 rounded-lg transition-all duration-300 group",
        active 
          ? "bg-cyber-primary/10 text-cyber-primary font-medium" 
          : "text-cyber-dark/70 hover:bg-cyber-primary/5 hover:text-cyber-primary"
      )}
      onClick={onClick}
    >
      <Icon size={20} className={cn("min-w-[20px]", active ? "text-cyber-primary" : "")} />
      {expanded && <span className="text-sm">{label}</span>}
    </Link>
  );
};

export const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const { expanded, setExpanded, setIsAdmin } = useSidebar();

  const studentNav = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
    { icon: Award, label: "Certifications", href: "/certifications" },
    { icon: FileText, label: "Assessments", href: "/assessments" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  const adminNav = [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Students", href: "/admin/students" },
    { icon: BookOpen, label: "Courses", href: "/admin/courses" },
    { icon: Shield, label: "Security", href: "/admin/security" },
    { icon: BarChart, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const navItems = location.pathname.includes("/admin") ? adminNav : studentNav;

  const toggleAdmin = () => {
    setIsAdmin(prev => !prev);
    window.location.href = location.pathname.includes("/admin") ? "/dashboard" : "/admin";
  };

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-white border-r border-slate-100 shadow-sm transition-all duration-300",
        expanded ? "w-64" : "w-20"
      )}
    >
      <div className="p-4 flex justify-between items-center">
        <div className={cn("flex items-center gap-2", expanded ? "" : "justify-center w-full")}>
          <Shield className="text-cyber-primary h-8 w-8" />
          {expanded && <span className="text-xl font-semibold">CyberEdu</span>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setExpanded(prev => !prev)}
          className={cn("", !expanded && "hidden")}
        >
          <ChevronLeft className={cn("h-5 w-5 transition-transform", !expanded && "rotate-180")} />
        </Button>
        {!expanded && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(prev => !prev)}
            className="absolute -right-4 top-6 h-8 w-8 rounded-full bg-white border border-slate-200 shadow-sm"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="px-3 py-2">
        <p className={cn("text-xs text-gray-500 font-medium mb-2 px-3", !expanded && "sr-only")}>
          MAIN MENU
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
            "flex items-center gap-3 rounded-lg p-3 cursor-pointer hover:bg-cyber-light transition-colors",
            !expanded && "flex-col"
          )}
        >
          <Avatar className="h-10 w-10 border-2 border-cyber-primary/20">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {expanded && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-gray-500 truncate">john.doe@example.com</p>
            </div>
          )}
          {expanded && (
            <Button variant="outline" size="sm" onClick={toggleAdmin}>
              {location.pathname.includes("/admin") ? "Student" : "Admin"}
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminNavbar;
