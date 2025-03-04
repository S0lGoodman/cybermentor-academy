import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "../lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  locked?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-4 space-x-reverse" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronLeft className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <div>
            {item.href && !item.locked ? (
              <Link
                to={item.href}
                className={cn(
                  "text-sm hover:text-foreground transition-colors",
                  index === items.length - 1
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-sm",
                  item.locked
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : "text-foreground font-medium"
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
}; 