import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { StudentFilters } from "@/types/student";
import { useState } from "react";

interface StudentFiltersProps {
  filters: StudentFilters;
  onFilterChange: (filters: StudentFilters) => void;
  onReset: () => void;
}

export function StudentFiltersBar({ filters, onFilterChange, onReset }: StudentFiltersProps) {
  const [dateOpen, setDateOpen] = useState(false);

  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value as any
    });
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...filters,
      search: value
    });
  };

  const handleDateChange = (dates: { from: Date; to: Date }) => {
    onFilterChange({
      ...filters,
      dateRange: dates
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search by name or email..."
            value={filters.search || ""}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-[240px] justify-start text-left font-normal ${
                !filters.dateRange && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                    {format(filters.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                "Filter by date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange?.from}
              selected={{
                from: filters.dateRange?.from || undefined,
                to: filters.dateRange?.to || undefined,
              }}
              onSelect={(range: any) => {
                handleDateChange(range || {});
                if (range?.to) setDateOpen(false);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          onClick={onReset}
          className="h-10 px-3"
        >
          <X className="h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
} 