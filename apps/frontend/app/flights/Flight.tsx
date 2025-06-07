"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  // MapPin,
  ArrowRight,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  CornerUpLeft,
  Plane,
  // Luggage,
} from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import { Label } from "@repo/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { getDuration } from "@/lib/duration-finder";
import { format } from "date-fns";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { FlightData } from "@repo/types";
import { useFlightStore } from "@/store/Store";
// import FlightSearchComponent from "@/components/FlightSearch";
import FlightSearch from "@/components/Flights/flight-search";
import FlightCards from "@/components/Flights/FlightCards";
// import { AnimatedModalDemo } from "@/components/BookingModal/BookingModal";
// import Link from "next/link";

// Mock data for flights
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

interface FlightApiResponse {
  totalItems: number;
  Items: Array<FlightData>;
  totalPages: number;
}

export default function FlightList({
  flightsData,
}: {
  flightsData: FlightApiResponse;
}) {
  const [sortBy, setSortBy] =
    useState<keyof (typeof flightsData.Items)[0]>("basePrice");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  // const [filterAirline, setFilterAirline] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 5;

  const router = useRouter();
  const addFlight = useFlightStore((state) => state.addFlight);

  // const sortedAndFilteredFlights = useMemo(() => {
  //   return flightsData.Items
  //     .filter((flight) => filterAirline === "" || flight.airline.toLowerCase().includes(filterAirline.toLowerCase()))
  //     .sort((a, b) => {
  //       if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
  //       if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
  //       return 0;
  //     });
  // }, [filterAirline, sortBy, sortOrder]);

  const recommendedFlight = useMemo(() => {
    return flightsData.Items.reduce(
      (min, flight) => (flight.basePrice < min!.basePrice ? flight : min),
      flightsData.Items[0],
    );
  }, [flightsData.Items]);

  const handleClick = (flight: FlightData) => {
    addFlight(flight);
    router.push("/user-details");
  };
  // const totalPages = Math.ceil((sortedAndFilteredFlights.length - 1) / itemsPerPage);
  // const paginatedFlights = sortedAndFilteredFlights
  //   .filter((flight) => flight.id !== recommendedFlight.id)
  //   .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="container mx-auto px-4 py-8 ">
      <span
        onClick={() => router.replace("/")}
        className="shadow-md rounded p-2 flex w-fit font-semibold cursor-pointer gap-2"
      >
        <CornerUpLeft />
        Go Back
      </span>
      <div className="my-6 flex flex-wrap justify-between gap-4 items-center">
        <motion.h1 className="text-2xl font-bold mt- ml-2 flex  text-sky-800 ">
          Available Flights
        </motion.h1>
        <div className="flex items-end gap-2">
          <div>
            <Label htmlFor="sortBy" className="text-sky-700">
              Sort by
            </Label>
            {/* <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/50 border-sky-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="departureTime">Departure Time</SelectItem>
                <SelectItem value="arrivalTime">Arrival Time</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select> */}
            <Select
              value={sortBy}
              onValueChange={(value) =>
                setSortBy(value as keyof (typeof flightsData.Items)[0])
              }
            >
              <SelectTrigger className="bg-white/50 border-sky-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="departureTime">Departure Time</SelectItem>
                <SelectItem value="arrivalTime">Arrival Time</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white"
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-sky-500/80 rounded-xl shadow-xl border border-white/20 transition duration-300 hover:bg-sky-600/80 text-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recommended Flight</span>
              <Badge variant="secondary" className="bg-white text-sky-600">
                Best Deal
              </Badge>
            </CardTitle>
            <CardDescription className="text-sky-100">
              Lowest price available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Plane className="h-8 w-8" />
                <div>
                  <p className="font-semibold">{"Ezfly"}</p>
                  <p className="text-sm">
                    {recommendedFlight?.origin.city.name} to{" "}
                    {recommendedFlight?.destination.city.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ₹{recommendedFlight?.basePrice}
                </p>
                <p className="text-sm">
                  {getDuration(
                    recommendedFlight!.departureTime,
                    recommendedFlight!.arrivalTime,
                  )}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <div>
              <p className="text-sm">
                <Clock className="inline mr-1 h-4 w-4" />{" "}
                {format(new Date(recommendedFlight!.departureTime), "hh:mm a")}{" "}
                - {format(new Date(recommendedFlight!.arrivalTime), "hh:mm a")}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => handleClick(recommendedFlight!)}
              className="bg-white text-sky-600 hover:bg-sky-100"
            >
              Book Now
            </Button>
          </CardFooter>
        </Card>

        <motion.div variants={fadeInUp} className="space-y-4">
          {flightsData.Items.map((flight) => (
            <FlightCards
              key={flight.id}
              flights={[flight]}
              handleClick={handleClick}
            />
          ))}
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button // onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          // disabled={currentPage === 1}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <span className="text-sky-800">
          Page {1} of {flightsData.totalPages}
        </span>
        <Button // onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          // disabled={currentPage === totalPages}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <motion.div className="mt-12">
        <motion.h1 className="text-3xl font-bold  mb-2  text-sky-800">
          Search Flights
        </motion.h1>
        <FlightSearch />
      </motion.div>
      {/* <AnimatedModalDemo/> */}
    </main>
  );
}
