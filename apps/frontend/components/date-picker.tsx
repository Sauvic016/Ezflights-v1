"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@repo/ui/lib/utils";
import { Button } from "@repo/ui/components/ui/button";
import { Calendar } from "@repo/ui/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  source?: "userDetails" | "flightSearch";
}

export function DatePicker({
  date,
  onSelect,
  className,
  source = "flightSearch",
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined,
  );
  const [open, setOpen] = React.useState(false);

  const handleSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    onSelect(newDate);
    setOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground",
              source === "userDetails" && "bg-white/50 border-indigo-200",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "LLL dd, y")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            initialFocus
            fromYear={source === "userDetails" ? 1900 : undefined}
            toYear={
              source === "userDetails" ? new Date().getFullYear() : undefined
            }
            captionLayout="dropdown-buttons"
            className="rounded-md border shadow-md"
            classNames={{
              caption:
                source === "userDetails"
                  ? "flex justify-center pt-1 relative items-center"
                  : "flex justify-center pt-1 relative items-center text-sm font-medium",
              caption_label:
                source === "userDetails" ? "hidden" : "text-sm font-medium",
              nav:
                source === "userDetails"
                  ? "hidden"
                  : "space-x-1 flex items-center",
              nav_button:
                source === "userDetails"
                  ? "hidden"
                  : cn(
                      "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                      "text-sky-600",
                    ),
              nav_button_previous:
                source === "userDetails" ? "hidden" : "absolute left-1",
              nav_button_next:
                source === "userDetails" ? "hidden" : "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                source === "userDetails" &&
                  "hover:bg-sky-100 hover:text-sky-900",
              ),
              day_range_end: "day-range-end",
              day_selected: cn(
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                source === "userDetails" &&
                  "bg-sky-600 hover:bg-sky-700 focus:bg-sky-700",
              ),
              day_outside:
                "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle:
                "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
              dropdown:
                source === "userDetails"
                  ? "border rounded-md shadow-sm bg-white"
                  : "hidden",
              dropdown_icon:
                source === "userDetails"
                  ? cn("ml-2 h-4 w-4", "text-sky-600")
                  : "hidden",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
