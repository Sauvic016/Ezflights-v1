"use client";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { getDuration } from "@/lib/duration-finder";

import { FlightData } from "@repo/types";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface FlightCardsProps {
  flights: FlightData[];
  handleClick: (flight: FlightData) => void;
}

const FlightCards = ({ flights, handleClick }: FlightCardsProps) => {
  // const handleClick = (flight: Flight) => {
  //   console.log("Booking flight:", flight.id);
  //   Add your booking logic here
  // };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {flights.map((flight) => (
        <motion.div key={flight.id} variants={fadeInUp} className="group">
          <Card className="border border-white/20 bg-gradient-to-r from-white/40 to-white/30 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/50 overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {/* Airline and Flight Number */}
                <div className="space-y-1 flex flex-row sm:flex-col justify-between sm:justify-start items-start">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {"Ezfly"}
                    </div>
                    <div className="font-semibold">
                      {flight.id.replace("EZ", "EZ-")}
                    </div>
                  </div>

                  {/* Price - Visible on mobile, hidden on larger screens */}
                  <div className="sm:hidden flex flex-col items-end">
                    <div className="text-xl font-bold">₹{flight.basePrice}</div>
                    <div className="text-xs text-muted-foreground">
                      per person
                    </div>
                  </div>
                </div>

                {/* Flight Timeline */}
                <div className="flex justify-between items-center col-span-1 sm:col-span-2 space-x-2 sm:space-x-4 bg-white/30 p-3 rounded-lg">
                  {/* Departure */}
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold">
                      {format(new Date(flight.departureTime), "hh:mm a")}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[80px] sm:max-w-full">
                      {flight.origin.city.name}
                    </div>
                  </div>

                  {/* Flight Duration and Path */}
                  <div className="flex flex-col items-center flex-1 px-1 sm:px-3">
                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {getDuration(flight.departureTime, flight.arrivalTime)}
                    </div>
                    <div className="relative w-full h-[2px] bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30 my-1">
                      <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-primary" />

                      <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Non stop
                    </div>
                  </div>

                  {/* Arrival */}
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold">
                      {format(new Date(flight.arrivalTime), "hh:mm a")}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[80px] sm:max-w-full">
                      {flight.destination.city.name}
                    </div>
                  </div>
                </div>

                {/* Price - Hidden on mobile, visible on larger screens */}
                <div className="hidden sm:flex justify-center items-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ₹{flight.basePrice}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per person
                    </div>
                  </div>
                </div>

                {/* Book Now Button */}
                <div className="flex justify-center sm:justify-end items-center">
                  <Button
                    onClick={() => handleClick(flight)}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FlightCards;
