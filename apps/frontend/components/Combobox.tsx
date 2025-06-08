"use client";

import * as React from "react";

import { useMediaQuery } from "@repo/ui/hooks/useMediaQuery";
import { Button } from "@repo/ui/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/ui/components/ui/command";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";

type Status = {
  value: string;
  label: string;
  id: number;
};

const statuses: Status[] = [
  { id: 1, label: "Delhi", value: "delhi" },
  { id: 2, label: "Mumbai", value: "mumbai" },
  { id: 3, label: "Bengaluru", value: "bengaluru" },
  { id: 4, label: "Hyderabad", value: "hyderabad" },
  { id: 5, label: "Chennai", value: "chennai" },
  { id: 6, label: "Kolkata", value: "kolkata" },
  { id: 7, label: "Ahmedabad", value: "ahmedabad" },
  { id: 8, label: "Kochi", value: "kochi" },
  { id: 9, label: "Pune", value: "pune" },
  { id: 10, label: "Dabolim (Goa)", value: "dabolim (goa)" },
  { id: 11, label: "Lucknow", value: "lucknow" },
  { id: 12, label: "Guwahati", value: "guwahati" },
];

export function ComboBoxResponsive() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedStatus, setSelectedStatus] = React.useState<Status | null>(
    null,
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) || null,
                );
                setOpen(false);
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
