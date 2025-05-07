// import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/components/ui/command";
import { Input } from "@repo/ui/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@repo/ui/components/ui/popover";
import { Skeleton } from "@repo/ui/components/ui/skeleton";

// Simplified Autocomplete.tsx

type AutoCompleteProps = {
  value: string;
  onValueChange: (value: string) => void;
  onSelect: (value: string, id: number) => void;
  suggestions: Array<{
    id: number;
    name: string;
  }>;
  isLoading: boolean;
  placeholder?: string;
  emptyMessage?: string;
};
export function AutoComplete({
  value,
  onValueChange,
  onSelect,
  suggestions,
  isLoading,
  placeholder = "Search...",
}: AutoCompleteProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Command shouldFilter={false} className="bg-inherit">
          <PopoverAnchor asChild>
            <div className="relative">
              <CommandPrimitive.Input
                asChild
                value={value}
                onValueChange={onValueChange}
                onMouseDown={() => setOpen((open) => !!value || !open)}
                onKeyDown={(e) => setOpen(e.key !== "Escape")}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
              >
                <Input
                  className="bg-white/40 pl-6 focus:ring-0 focus:ring-offset-0"
                  placeholder={placeholder}
                />
              </CommandPrimitive.Input>
            </div>
          </PopoverAnchor>
          {!open && <CommandList aria-hidden="true" className="hidden" />}

          <PopoverContent
            asChild
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={(e) => {
              if (
                e.target instanceof Element &&
                e.target.hasAttribute("cmdk-input")
              ) {
                e.preventDefault();
              }
            }}
            className={`${
              suggestions?.length > 0
                ? "w-[--radix-popover-trigger-width] z-100"
                : "hidden"
            } p-0 `}
          >
            <CommandList>
              {isLoading && (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-6 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              )}
              {suggestions?.length > 0 && !isLoading
                ? (
                  <CommandGroup>
                    {suggestions.map((option: { id: number; name: string }) => (
                      <CommandItem
                        key={option.id}
                        value={option.name}
                        onMouseDown={(e) => e.preventDefault()}
                        onSelect={() => {
                          onSelect(option.name, option.id);
                          setOpen(false);
                        }}
                      >
                        {placeholder.includes("Departure")
                          ? <PlaneTakeoff className="opacity-40" />
                          : <PlaneLanding className="opacity-40" />}
                        <span>{option.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )
                : null}
              {/* // {!isLoading ? <CommandEmpty>{emptyMessage ?? "No items."}</CommandEmpty> : null} */}
            </CommandList>
          </PopoverContent>
        </Command>
      </Popover>
    </div>
  );
}
