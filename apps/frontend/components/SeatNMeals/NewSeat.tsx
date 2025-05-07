"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@repo/ui/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Separator } from "@repo/ui/components/ui/separator";
import { ArrowRight, Clock, Luggage, Plane, X } from "lucide-react";
import { Seat, SeatClass } from "@repo/types";

import { useFlightStore, useUserDetails } from "@/store/Store";
import { useBookingStore } from "@/store/booking-store";
import { FlightData } from "@repo/types";
import { getDuration } from "@/lib/duration-finder";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import axios from "axios";

type SeatProps = Seat;

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AirplaneInteriorSeatMap(
  { FlightSeats }: { FlightSeats: SeatProps[] },
) {
  const [selectedSeats, setSelectedSeats] = useState<{
    [key: number]: { id?: number; seatNum?: string; price?: number };
  }>({});
  // const { toast } = useToast();
  const [start, setStart] = useState<number>(0);
  const minimap = useRef<HTMLInputElement>(null);
  const seatmap = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Get store values and actions
  const flight = useFlightStore((state) => state.flight as FlightData);
  const contact = useUserDetails((state) => state.contact);
  const travelers = useUserDetails((state) => state.travelers);
  const updateTraveler = useUserDetails((state) => state.updateTraveler);
  const { setBasePrice, setSelectedSeat } = useBookingStore();

  const flightGetter = async () => {
    await useFlightStore.persist.rehydrate();
    await useUserDetails.persist.rehydrate();
  };

  useEffect(() => {
    flightGetter();
  }, []);

  if (!flight || !flight.origin) {
    // router.push("/");
    return <div>Loading...</div>;
  }

  const handleOnSlide = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStart(Number(e.target.value));
    if (seatmap.current) {
      const { scrollWidth, clientWidth } = seatmap.current;
      const scrollAmount = (Number(e.target.value) / 100) *
        (scrollWidth - clientWidth);
      seatmap.current.scrollLeft = scrollAmount;
    }
  };

  const handleScroll = () => {
    if (seatmap.current) {
      const { scrollLeft, scrollWidth, clientWidth } = seatmap.current;
      const scrollPercentage = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setStart(scrollPercentage);
    }
  };

  const toggleSeatSelection = (seatId: number, travelerIndex: number) => {
    const seat = FlightSeats.find((s) => s.id === seatId);
    if (seat && !seat.isBooked) {
      setSelectedSeats((prev) => ({
        ...prev,
        [travelerIndex]: {
          id: seat.id,
          seatNum: `${seat.row}${seat.column}`,
        },
      }));
    }
  };

  const handleConfirmSelection = async () => {
    if (!contact) {
      console.error("Contact information is missing");
      return;
    }

    // Check if any seats are selected
    const hasSelectedSeats = Object.keys(selectedSeats).length > 0;

    // If seats are selected, ensure all travelers have seats
    if (hasSelectedSeats) {
      const allTravelersHaveSeats = travelers.every((_, index) =>
        selectedSeats[index]?.seatNum
      );

      if (!allTravelersHaveSeats) {
        console.error("All travelers must have seats selected");
        return;
      }

      // Update all travelers with their selected seats
      travelers.forEach((traveler, index) => {
        const selectedSeat = selectedSeats[index];
        if (selectedSeat?.seatNum) {
          updateTraveler(index, {
            ...traveler,
            seatNumber: selectedSeat.seatNum,
          });
        }
      });

      // Store booking details in the booking store
      setBasePrice(flight.basePrice);
      Object.entries(selectedSeats).forEach(([index, seat]) => {
        if (seat.id && seat.seatNum) {
          setSelectedSeat(Number(index), {
            id: seat.id,
            seatNum: seat.seatNum,
            price: seat.price || 0,
          });
        }
      });
    }

    router.push("/payments");
  };

  const renderSeat = (
    seat: SeatProps,
    { isSmall = false, travelerIndex = 0 }: {
      isSmall?: boolean;
      travelerIndex?: number;
    } = {},
  ) => {
    const getSeatColor = (seatClass: string) => {
      switch (seatClass) {
        case "FIRST_CLASS":
          return "bg-purple-200/80 hover:bg-purple-300/80";
        case "BUSINESS":
          return "bg-indigo-200/80 hover:bg-indigo-300/80";
        case "PREMIUM_ECONOMY":
          return "bg-green-200/80 hover:bg-green-300/80";
        case "ECONOMY":
          return "bg-sky-200/80 hover:bg-sky-300/80";
        default:
          return "bg-sky-200/80 hover:bg-sky-300/80";
      }
    };

    const isSelected = Object.values(selectedSeats).some((s) =>
      s.id === seat.id
    );
    const isSelectedByCurrentTraveler =
      selectedSeats[travelerIndex]?.id === seat.id;

    return (
      <motion.div
        key={seat.id}
        whileHover={!isSmall ? { scale: 1.05 } : {}}
        onClick={() => toggleSeatSelection(seat.id, travelerIndex)}
        className={`${
          isSmall
            ? `w-[5px] h-[5px] rounded-sm text-[2px]`
            : `w-8 h-8 m-1 rounded-lg text-xs font-bold`
        } flex items-center justify-center cursor-pointer transition-colors duration-200
          ${
          seat.isBooked
            ? "bg-gray-400/80 backdrop-blur-sm"
            : isSelectedByCurrentTraveler
            ? "bg-primary/80 text-white backdrop-blur-sm"
            : isSelected
            ? "bg-primary/40 backdrop-blur-sm"
            : getSeatColor(seat.seatClass)
        }`}
      >
        {!isSmall && (
          <span className="select-none">
            {seat.row}
            {seat.column}
          </span>
        )}
      </motion.div>
    );
  };
  return (
    <div className=" p-4 pt-14 bg-sky-50 h-full">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="space-y-8"
      >
        <motion.div className="flex items-center space-x-4 justify-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Plane className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Select Your Seat</h1>
        </motion.div>

        <motion.div className="flex justify-center gap-6 flex-wrap">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-purple-200/80 backdrop-blur-sm rounded">
            </div>
            <span>First Class</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-200/80 backdrop-blur-sm rounded">
            </div>
            <span>Business</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-200/80 backdrop-blur-sm rounded">
            </div>
            <span>Premium Economy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-sky-200/80 backdrop-blur-sm rounded">
            </div>
            <span>Economy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-400/80 backdrop-blur-sm rounded">
            </div>
            <span>Unavailable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary/80 backdrop-blur-sm rounded">
            </div>
            <span>Selected</span>
          </div>
        </motion.div>

        <div className="flex flex-col  lg:grid lg:grid-cols-3  gap-8">
          <motion.div className="flex flex-col col-span-2 justify-self-center items-center">
            <div className="minimap mt-8 relative bg-transparent flex">
              <input
                ref={minimap}
                type="range"
                value={start}
                className="bg-transparent z-20 slider appearance-none w-[16rem] select-none"
                onChange={handleOnSlide}
              />
              <div className="absolute top-[1px] flex px-2 items-center overflow-y-hidden scrollbar-none w-[16rem] h-[6vh]">
                <div className="w-[3rem]">
                  <Image
                    src="/images/cockpit.png"
                    alt="cockpit"
                    width={800}
                    height={900}
                    className="h-[36px] "
                  />
                </div>
                <div className="bg-white/40 backdrop-blur-md border-2 border-white/20 rounded-lg flex py-[2px] shadow-xl px-2 w-[13rem]">
                  <div className="flex flex-col justify-center w-full pl-[2px] my-[2px]">
                    <div className="flex flex-col">
                      {["F", "E", "D"].map((letter) => (
                        <div className="flex gap-[2px]" key={letter}>
                          {FlightSeats.filter((seat) =>
                            seat.column === letter
                          ).map((seat) =>
                            renderSeat(seat, { isSmall: true })
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="w-[2px] bg-transparent select-none mx-[2px]">
                    </div>
                    <div className="flex flex-col">
                      {["C", "B", "A"].map((letter) => (
                        <div className="flex gap-[2px]" key={letter}>
                          {FlightSeats.filter((seat) =>
                            seat.column === letter
                          ).map((seat) =>
                            renderSeat(seat, { isSmall: true })
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="seatmap mt-10 flex flex-col">
              <div className="z-10 flex justify-start w-[20rem] sm:w-[40rem]">
                <div
                  className="flex px-4 items-center overflow-y-hidden scrollbar-none w-[41rem] h-[50vh] outline-none"
                  ref={seatmap}
                  onScroll={handleScroll}
                >
                  <Image
                    src="/images/cockpit.png"
                    alt="cockpit"
                    width={800}
                    height={800}
                    className="h-[400px] object-contain"
                  />
                  <div className="bg-white/40 backdrop-blur-md border-2 border-white/20 rounded-lg flex py-2 shadow-xl px-2">
                    <div className="flex flex-col gap-4 justify-center w-full pl-2 my-2">
                      {["F", "E", "D"].map((letter) => (
                        <div className="flex gap-2" key={letter}>
                          {FlightSeats.filter((seat) =>
                            seat.column === letter
                          ).map((seat) =>
                            renderSeat(seat)
                          )}
                        </div>
                      ))}
                      <div className="w-8 bg-transparent select-none mx-1">
                      </div>
                      {["C", "B", "A"].map((letter) => (
                        <div className="flex gap-2" key={letter}>
                          {FlightSeats.filter((seat) =>
                            seat.column === letter
                          ).map((seat) =>
                            renderSeat(seat)
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <motion.div className="mt-8 text-center">
              <div className="space-y-4">
                <div className="font-semibold">
                  Selected Seats:
                  {travelers.map((traveler, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center gap-3 mt-2"
                    >
                      <span className="text-sm text-muted-foreground">
                        {traveler.firstName} {traveler.lastName}:
                      </span>
                      {selectedSeats[index]?.seatNum
                        ? (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center space-x-3 bg-white/80 backdrop-blur-md rounded-md px-2 py-2 shadow-lg"
                          >
                            <div className="rounded-lg bg-primary/80 flex items-center justify-center text-white font-bold text-sm p-1">
                              {selectedSeats[index].seatNum}
                            </div>
                            <span className="text-sm text-indigo-700 font-semibold">
                              {(() => {
                                const seat = FlightSeats.find((s) =>
                                  s.id === selectedSeats[index]!.id
                                );
                                switch (seat?.seatClass) {
                                  case "FIRST_CLASS":
                                    return "First Class";
                                  case "BUSINESS":
                                    return "Business";
                                  case "PREMIUM_ECONOMY":
                                    return "Premium Economy";
                                  case "ECONOMY":
                                    return "Economy";
                                  default:
                                    return "Economy";
                                }
                              })()}
                            </span>
                            <Button
                              variant="outline"
                              className="rounded-full p-2 h-auto bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300 transition-all duration-300"
                              onClick={() =>
                                setSelectedSeats((prev) => {
                                  const newSeats = { ...prev };
                                  delete newSeats[index];
                                  return newSeats;
                                })}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Cancel Selection</span>
                            </Button>
                          </motion.div>
                        )
                        : (
                          <p className="text-sm text-muted-foreground">
                            No seat selected
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div className="lg:w-96 lg: col-span-1 lg:justify-self-center">
            <Card className="border-2 border-white/20 bg-white/40 backdrop-blur-md shadow-xl sticky top-32">
              <CardHeader className="bg-white/40 backdrop-blur-sm border-b border-white/20">
                <div className="flex items-center space-x-2">
                  <Plane className="h-5 w-5 text-primary" />
                  <CardTitle>Flight Details</CardTitle>
                </div>
                <CardDescription className="text-lg font-medium">
                  {flight.origin.city.name} → {flight.destination.city.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Flight Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Plane className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Indigo {flight.id.replace("EZ", "EZ-")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {flight.airplane.model}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {" "}
                        {format(new Date(flight.departureTime), "hh:mm a")} -
                        {" "}
                        {format(new Date(flight.arrivalTime), "hh:mm a")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getDuration(flight.departureTime, flight.arrivalTime)}
                        {" "}
                        • Non-stop
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Luggage className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Baggage</p>
                      <p className="text-sm text-muted-foreground">
                        Cabin: 7kg • Check-in: 15kg
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                {/* Seat Selection */}
                {
                  /* <div className="space-y-4">
                  <h3 className="font-semibold">Selected Seat</h3>
                  {selectedSeat?.seatNum ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/80 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                          {selectedSeat.seatNum}
                        </div>
                        <span className="text-sm">
                          {FlightSeats.find((s) => s.id === selectedSeat.id)?.type === "first-class"
                            ? "First Class"
                            : "Economy"}
                        </span>
                      </div>
                      <span className="font-semibold">+ ₹{selectedSeat.price}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No seat selected</p>
                  )}
                </div> */
                }

                {/* <Separator className="bg-white/20" /> */}

                {/* Price Breakdown */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span>₹{flight.basePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seat Price</span>
                    <span>₹{selectedSeats[0]?.price || "0"}</span>
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      ₹{(selectedSeats[0]?.price || 0) + flight.basePrice}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={handleConfirmSelection}
                    // disabled={!selectedSeat?.seatNum || selectedSeat?.id === 0}
                    className="w-full bg-primary/80 backdrop-blur-sm hover:bg-primary/90 group"
                  >
                    {selectedSeats[0]?.seatNum?.length
                      ? `Confirm Selection`
                      : "Skip Selection"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
