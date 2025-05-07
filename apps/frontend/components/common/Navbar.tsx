import { PlaneTakeoffIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/components/ui/button";
import { MobileNav } from "../mobile-nav";
// import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between ">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600">
            <PlaneTakeoffIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold">EzFlights</span>
        </div>
        <nav className="hidden md:flex gap-8">
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors"
          >
            Flights
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors"
          >
            Hotels
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors"
          >
            Packages
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors"
          >
            Deals
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-sky-500 transition-colors hidden sm:inline-flex"
          >
            Sign In
          </Link>
          <Button className="bg-sky-500 hover:bg-sky-600 rounded-full px-6">
            Register
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
