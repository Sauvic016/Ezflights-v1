"use client";

import * as React from "react";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-6 pt-10">
          <Link
            href="#"
            className="text-lg font-medium hover:text-sky-500"
            onClick={() => setOpen(false)}
          >
            Flights
          </Link>
          <Link
            href="#"
            className="text-lg font-medium hover:text-sky-500"
            onClick={() => setOpen(false)}
          >
            Hotels
          </Link>
          <Link
            href="#"
            className="text-lg font-medium hover:text-sky-500"
            onClick={() => setOpen(false)}
          >
            Packages
          </Link>
          <Link
            href="#"
            className="text-lg font-medium hover:text-sky-500"
            onClick={() => setOpen(false)}
          >
            Deals
          </Link>
          <div className="border-t pt-6 mt-6">
            <Link
              href="#"
              className="text-lg font-medium hover:text-sky-500"
              onClick={() => setOpen(false)}
              // className="text-lg font-medium hover:text-sky-500"
              // onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Button
              className="w-full mt-4 bg-sky-500 hover:bg-sky-600 rounded-full"
              onClick={() => setOpen(false)}
            >
              Register
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
