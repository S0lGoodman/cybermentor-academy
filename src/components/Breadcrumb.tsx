import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  locked?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index > 0 && (
            <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
          )}
          {item.href && !item.locked ? (
            <Link
              to={item.href}
              className="hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              "text-foreground",
              item.locked && "opacity-50 flex items-center gap-1"
            )}>
              {item.label}
              {item.locked && <Lock className="h-3 w-3" />}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}; 