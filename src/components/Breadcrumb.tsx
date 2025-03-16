import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "../lib/utils";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
  locked?: boolean;
  current?: boolean;
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
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.1 }}
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground/70 shrink-0" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: item.locked ? 1 : 1.05,
              transition: { duration: 0.2 }
            }}
            className="relative"
          >
            {item.href && !item.locked ? (
              <Link
                to={item.href}
                className={cn(
                  "text-sm transition-all duration-200 ease-in-out",
                  "hover:text-foreground relative",
                  "after:content-[''] after:absolute after:bottom-0 after:right-0",
                  "after:h-[2px] after:w-0 hover:after:w-full",
                  "after:transition-all after:duration-300 after:ease-in-out",
                  item.current
                    ? "text-foreground font-medium after:bg-[#00C896] after:w-full"
                    : "text-muted-foreground after:bg-foreground"
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-sm transition-all duration-200",
                  item.locked
                    ? "text-muted-foreground/50 cursor-not-allowed"
                    : item.current
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            )}
          </motion.div>
        </React.Fragment>
      ))}
    </nav>
  );
}; 