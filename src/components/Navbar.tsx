import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, LogOut, User, Search, Shield } from "lucide-react";
import { useSidebar } from "./Sidebar";
import { ThemeToggle } from "./theme-toggle";

interface NavbarProps {
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const { isAdmin } = useSidebar();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
          {!title && (
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-cyber-primary" />
              <span className="text-xl font-semibold">سايبر مينتور اكاديمي</span>
            </Link>
          )}
        </div>

        <div className="hidden md:block flex-1 px-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
            <Input
              type="search"
              placeholder="ابحث عن الدورات والوحدات "
              className="w-full rounded-full bg-background pl-8 focus-visible:ring-cyber-primary/30"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
                <Avatar className="h-9 w-9 border-2 border-cyber-primary/20">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={isAdmin ? "/admin/profile" : "/profile"} className="cursor-pointer flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  الملف الشخصي
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={isAdmin ? "/admin/settings" : "/settings"} className="cursor-pointer flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  الإعدادات
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
