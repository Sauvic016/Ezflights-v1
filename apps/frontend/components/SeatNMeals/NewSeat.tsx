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
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Luggage,
  Plane,
  User,
  X,
} from "lucide-react";
import { Seat, SeatClass } from "@repo/types";

import { useFlightStore, useUserDetails } from "@/store/Store";
import { useBookingStore } from "@/store/booking-store";
import { FlightData } from "@repo/types";
import { getDuration } from "@/lib/duration-finder";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type SeatProps = Seat;

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AirplaneInteriorSeatMap({
  FlightSeats,
}: {
  FlightSeats: SeatProps[];
}) {
  const [selectedSeats, setSelectedSeats] = useState<{
    [key: number]: { id?: number; seatNum?: string; price?: number };
  }>({});
  const [currentTravelerIndex, setCurrentTravelerIndex] = useState<number>(0);
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

  // Calculate total seat price
  const totalSeatPrice = Object.values(selectedSeats).reduce(
    (total, seat) => total + (seat.price || 0),
    0,
  );

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

  const toggleSeatSelection = (seatId: number) => {
    const seat = FlightSeats.find((s) => s.id === seatId);

    // Only allow selection if seat is not booked and not already selected by another traveler
    if (seat && !seat.isBooked) {
      // Check if this seat is already selected by another traveler
      const isSeatTakenByAnotherTraveler = Object.entries(selectedSeats).some(
        ([idx, s]) => s.id === seatId && Number(idx) !== currentTravelerIndex,
      );

      if (isSeatTakenByAnotherTraveler) {
        return; // Don't allow selection if another traveler has this seat
      }

      // Get seat price based on class
      let seatPrice = 0;
      switch (seat.seatClass) {
        case "FIRST_CLASS":
          seatPrice = 2000;
          break;
        case "BUSINESS":
          seatPrice = 1500;
          break;
        case "PREMIUM_ECONOMY":
          seatPrice = 1000;
          break;
        case "ECONOMY":
          seatPrice = 500;
          break;
      }

      setSelectedSeats((prev) => ({
        ...prev,
        [currentTravelerIndex]: {
          id: seat.id,
          seatNum: `${seat.row}${seat.column}`,
          price: seatPrice,
        },
      }));

      // Automatically move to the next traveler if there are more travelers without seats
      const nextUnselectedIndex = findNextUnselectedTravelerIndex(
        currentTravelerIndex,
      );
      if (nextUnselectedIndex !== currentTravelerIndex) {
        setCurrentTravelerIndex(nextUnselectedIndex);
      }
    }
  };

  // Find the next traveler without a seat selected
  const findNextUnselectedTravelerIndex = (currentIndex: number): number => {
    // First check travelers after the current one
    for (let i = currentIndex + 1; i < travelers.length; i++) {
      if (!selectedSeats[i]?.id) {
        return i;
      }
    }

    // If all travelers after have seats, check from the beginning
    for (let i = 0; i < currentIndex; i++) {
      if (!selectedSeats[i]?.id) {
        return i;
      }
    }

    // If all travelers have seats or current is the only one without a seat, stay on current
    return currentIndex;
  };

  const handleConfirmSelection = async () => {
    if (!contact) {
      console.error("Contact information is missing");
      return;
    }

    // Check if any seats are selected
    const hasSelectedSeats = Object.keys(selectedSeats).length > 0;

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

    router.push("/payments");
  };

  const allTravelersHaveSeats = travelers.every(
    (_, index) => selectedSeats[index]?.seatNum,
  );

  const renderSeat = (seat: SeatProps, { isSmall = false } = {}) => {
    const getSeatColor = (seatClass: string) => {
      switch (seatClass) {
        case "FIRST_CLASS":
          return "bg-purple-200/80 hover:bg-purple-300/90 hover:shadow-md";
        case "BUSINESS":
          return "bg-indigo-200/80 hover:bg-indigo-300/90 hover:shadow-md";
        case "PREMIUM_ECONOMY":
          return "bg-green-200/80 hover:bg-green-300/90 hover:shadow-md";
        case "ECONOMY":
          return "bg-sky-200/80 hover:bg-sky-300/90 hover:shadow-md";
        default:
          return "bg-sky-200/80 hover:bg-sky-300/90 hover:shadow-md";
      }
    };

    // Check if this seat is selected by any traveler
    const selectedByTravelerIndex = Object.entries(selectedSeats).find(
      ([_, s]) => s.id === seat.id,
    )?.[0];

    const isSelected = selectedByTravelerIndex !== undefined;
    const isSelectedByCurrentTraveler =
      selectedSeats[currentTravelerIndex]?.id === seat.id;

    return (
      <motion.div
        key={seat.id}
        whileHover={!isSmall
          ? { scale: 1.05, transition: { duration: 0.2 } }
          : {}}
        onClick={() => !isSmall && toggleSeatSelection(seat.id)}
        className={`${
          isSmall
            ? `w-[5px] h-[5px] rounded-sm text-[2px]`
            : `w-7 h-7 sm:w-8 sm:h-8 m-1 rounded-lg text-xs font-bold transform transition-all duration-200 ease-in-out`
        } flex items-center justify-center cursor-pointer transition-all
          ${
          seat.isBooked
            ? "bg-gray-400/80 backdrop-blur-sm cursor-not-allowed opacity-50"
            : isSelectedByCurrentTraveler
            ? "bg-primary/90 text-white backdrop-blur-sm shadow-md ring-2 ring-primary/70"
            : isSelected
            ? "bg-primary/40 text-white backdrop-blur-sm shadow-sm"
            : getSeatColor(seat.seatClass)
        }`}
        title={seat.isBooked
          ? "Seat unavailable"
          : isSelected && !isSelectedByCurrentTraveler
          ? `Selected by Traveler ${Number(selectedByTravelerIndex) + 1}`
          : `${seat.row}${seat.column} - ${seat.seatClass.replace("_", " ")}`}
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
    <div className="p-4 pt-14 bg-sky-50 h-full">
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

        {/* Traveler Selection */}
        <motion.div className="flex justify-center">
          <div className="bg-white/90 backdrop-blur-md rounded-lg shadow-md p-4 w-full max-w-3xl border border-gray-100">
            <h2 className="text-center font-medium mb-3 text-gray-700">
              Select seat for:
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {travelers.map((traveler, index) => (
                <Button
                  key={index}
                  variant={currentTravelerIndex === index
                    ? "outline"
                    : "default"}
                  className={`gap-2 text-black ${
                    selectedSeats[index]?.id
                      ? "border-green-500 bg-green-50 hover:bg-green-100"
                      : "bg-white hover:bg-gray-50 border-gray-200"
                  } transition-all duration-200 ${
                    currentTravelerIndex === index && !selectedSeats[index]?.id
                      ? "ring-2 ring-primary/30"
                      : ""
                  }`}
                  onClick={() => setCurrentTravelerIndex(index)}
                >
                  <User
                    className={`h-4 w-4 ${
                      selectedSeats[index]?.id
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span className="hidden xs:inline">
                    {traveler.firstName} {traveler.lastName.charAt(0)}.
                  </span>
                  <span className="xs:hidden">
                    {traveler.firstName.charAt(0)}
                    {traveler.lastName.charAt(0)}
                  </span>
                  {selectedSeats[index]?.id && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </Button>
              ))}
            </div>
            <p className="text-center text-sm mt-3 text-gray-500">
              Currently selecting for:{" "}
              <span className="font-medium text-primary">
                {travelers[currentTravelerIndex]?.firstName}{" "}
                {travelers[currentTravelerIndex]?.lastName}
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div className="flex justify-center gap-3 sm:gap-6 flex-wrap px-2 sm:px-0">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-200/80 backdrop-blur-sm rounded">
            </div>
            <span className="text-xs sm:text-sm">First Class</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-indigo-200/80 backdrop-blur-sm rounded">
            </div>
            <span className="text-xs sm:text-sm">Business</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-200/80 backdrop-blur-sm rounded">
            </div>
            <span className="text-xs sm:text-sm">Premium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-sky-200/80 backdrop-blur-sm rounded">
            </div>
            <span className="text-xs sm:text-sm">Economy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-400/80 backdrop-blur-sm rounded">
            </div>
            <span className="text-xs sm:text-sm">Unavailable</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary/80 backdrop-blur-sm rounded">
            </div>
            <span className="text-xs sm:text-sm">Selected</span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
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
                          {FlightSeats.filter(
                            (seat) =>
                              seat.column === letter,
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
                          {FlightSeats.filter(
                            (seat) =>
                              seat.column === letter,
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
                          {FlightSeats.filter(
                            (seat) =>
                              seat.column === letter,
                          ).map((seat) =>
                            renderSeat(seat)
                          )}
                        </div>
                      ))}
                      <div className="w-8 bg-transparent select-none mx-1">
                      </div>
                      {["C", "B", "A"].map((letter) => (
                        <div className="flex gap-2" key={letter}>
                          {FlightSeats.filter(
                            (seat) =>
                              seat.column === letter,
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
                <div className="font-semibold text-gray-700">
                  Selected Seats:
                  <div className="mt-3 grid grid-cols-1 gap-3 max-w-md mx-auto">
                    {travelers.map((traveler, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-3 bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm"
                      >
                        <span className="text-sm font-medium text-gray-800 truncate max-w-[120px]">
                          {traveler.firstName} {traveler.lastName}
                        </span>
                        {selectedSeats[index]?.seatNum
                          ? (
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="flex items-center space-x-3 ml-auto"
                            >
                              <div className="rounded-lg bg-primary/90 flex items-center justify-center text-white font-bold text-sm p-1 shadow-sm">
                                {selectedSeats[index].seatNum}
                              </div>
                              <span className="text-xs text-indigo-700 font-medium hidden sm:inline">
                                {(() => {
                                  const seat = FlightSeats.find(
                                    (s) => s.id === selectedSeats[index]!.id,
                                  );
                                  switch (seat?.seatClass) {
                                    case "FIRST_CLASS":
                                      return "First Class";
                                    case "BUSINESS":
                                      return "Business";
                                    case "PREMIUM_ECONOMY":
                                      return "Premium";
                                    case "ECONOMY":
                                      return "Economy";
                                    default:
                                      return "Economy";
                                  }
                                })()}
                              </span>
                              <Button
                                variant="outline"
                                className="rounded-full p-1.5 h-auto bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border-red-100 hover:border-red-200 transition-all duration-300 ml-1"
                                onClick={() => {
                                  setSelectedSeats((prev) => {
                                    const newSeats = { ...prev };
                                    delete newSeats[index];
                                    return newSeats;
                                  });
                                  if (currentTravelerIndex !== index) {
                                    setCurrentTravelerIndex(index);
                                  }
                                }}
                              >
                                <X className="h-3.5 w-3.5" />
                                <span className="sr-only">
                                  Cancel Selection
                                </span>
                              </Button>
                            </motion.div>
                          )
                          : (
                            <span className="text-sm text-gray-500 ml-auto">
                              No seat selected
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          <motion.div className="lg:w-full xl:w-96 lg:col-span-1 lg:justify-self-center">
            <Card className="border border-gray-200 bg-white/90 backdrop-blur-md shadow-md sticky top-32">
              <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Plane className="h-5 w-5 text-primary" />
                  <CardTitle>Flight Details</CardTitle>
                </div>
                <CardDescription className="text-base sm:text-lg font-medium">
                  {flight.origin.city.name} → {flight.destination.city.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
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
                      <p className="text-sm text-gray-500">
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
                        {format(
                          new Date(flight.departureTime),
                          "hh:mm a",
                        )} - {format(new Date(flight.arrivalTime), "hh:mm a")}
                      </p>
                      <p className="text-sm text-gray-500">
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
                      <p className="text-sm text-gray-500">
                        Cabin: 7kg • Check-in: 15kg
                      </p>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-200" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="font-medium">
                      ₹{flight.basePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Seat Prices ({Object.keys(selectedSeats).length} seats)
                    </span>
                    <span className="font-medium">
                      ₹{totalSeatPrice.toLocaleString()}
                    </span>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ₹{(totalSeatPrice + flight.basePrice).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 pt-4">
                  <Button
                    onClick={handleConfirmSelection}
                    className={`w-full backdrop-blur-sm group ${
                      allTravelersHaveSeats
                        ? "bg-primary/90 hover:bg-primary text-white"
                        : "bg-amber-500/90 hover:bg-amber-500 text-white"
                    } shadow-sm transition-all duration-300`}
                  >
                    {allTravelersHaveSeats
                      ? "Confirm All Seats"
                      : Object.keys(selectedSeats).length > 0
                      ? "Continue with Selected Seats"
                      : "Skip Seat Selection"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  {!allTravelersHaveSeats &&
                    Object.keys(selectedSeats).length > 0 && (
                    <p className="text-xs text-center text-amber-700">
                      Note: Not all travelers have seats selected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
