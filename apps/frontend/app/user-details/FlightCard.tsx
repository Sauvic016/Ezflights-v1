"use client";

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import { Calendar, Clock, ListChecks, Luggage, Plane } from "lucide-react";
import { useFlightStore } from "@/store/Store";
import { FlightData } from "@repo/types";
import { format } from "date-fns";
import { getDuration } from "@/lib/duration-finder";
import { useEffect } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const FlightCard = ({ flight }: { flight: FlightData }) => {
  const flightGetter = async () => {
    await useFlightStore.persist.rehydrate();
  };

  useEffect(() => {
    flightGetter();
  }, []);

  // Add loading state
  if (!flight || Object.keys(flight).length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <motion.div variants={fadeInUp}>
      <Card className="overflow-hidden border-2 border-white/20 bg-white/40  -md shadow-xl">
        <CardHeader className="bg-white/40  -sm border-b border-white/20">
          <div className="flex items-center space-x-2">
            <ListChecks className=" text-primary" />
            <CardTitle className="text-xl">Flight Summary</CardTitle>
          </div>
          <CardDescription className="text-md font-medium pl-6">
            {flight.origin.city.name} → {flight.destination.city.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pl-10">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div variants={fadeInUp} className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-primary" />{" "}
                <p className="font-medium">
                  {format(new Date(flight.departureTime), "EEE, MMM d")}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <p>
                  Duration: Non Stop •{" "}
                  {getDuration(flight.departureTime, flight.arrivalTime)}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Plane className="h-5 w-5 text-primary" />
                <p className=" font-medium">
                  Indigo {flight.id.replace("EZ", "EZ-")} •{" "}
                  {flight.airplane.model}
                </p>
              </div>
            </motion.div>
            <motion.div variants={fadeInUp} className="space-y-4">
              <div>
                <p className="text-xl font-bold">
                  {format(new Date(flight.departureTime), "hh:mm a")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {flight.origin.city.name}{" "}
                  ({flight.origin.city.name.substring(0, 3)
                    .toUpperCase()}
                  )
                  <br />
                  {flight.origin.name}
                </p>
              </div>
              <div>
                <p className="text-xl font-bold">
                  {format(new Date(flight.arrivalTime), "hh:mm a")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {flight.destination.city.name}{" "}
                  ({flight.destination.city.name.substring(0, 3)
                    .toUpperCase()}
                  )
                  <br />
                  {flight.destination.name}
                </p>
              </div>
            </motion.div>
          </div>
          <motion.div
            variants={fadeInUp}
            className="mt-6 p-4 bg-primary/5 rounded-lg space-y-2"
          >
            <div className="flex items-center space-x-3">
              <Luggage className="h-5 w-5 text-primary" />
              <div>
                <p>
                  Cabin Baggage:{" "}
                  <span className="font-medium">
                    7 Kgs (1 piece only) / Adult
                  </span>
                </p>
                <p>
                  Check-In Baggage:{" "}
                  <span className="font-medium">
                    15 Kgs (1 piece only) / Adult
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FlightCard;
