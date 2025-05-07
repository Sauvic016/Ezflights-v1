import React, { Suspense } from "react";
import FlightList from "./Flight";
import axios from "axios";
// import AirplaneInteriorSeatMap from "@/components/SeatNMeals/NewSeat";

// Mark this page as dynamic
export const dynamic = "force-dynamic";

interface FlightSearchParams {
  flightType: "roundTrip" | "oneWay";
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  adults: string;
  children: string;
}

interface PageProps {
  searchParams: FlightSearchParams;
}

async function getFlightsList(value: FlightSearchParams) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_flight_service}/api/get-flights?from=${value.from}&to=${value.to}&flightType=${value.flightType}&departureDate=${value.departureDate}&returnDate=${value.returnDate}&adults=${value.adults}&children=${value.children}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching flights:", error);
    return null;
  }
}

export default async function FlightsPage({ searchParams }: PageProps) {
  // Validate required search params
  if (!searchParams.from || !searchParams.to || !searchParams.departureDate) {
    return (
      <div className="my-24">
        <div>Please provide all required search parameters.</div>
      </div>
    );
  }

  const flightsData = await getFlightsList(searchParams);

  if (!flightsData) {
    return (
      <div className="my-24">
        <div>No flights found. Please try different search criteria.</div>
      </div>
    );
  }

  return (
    <div className="my-24">
      <Suspense fallback={<div>Loading flights...</div>}>
        <FlightList flightsData={flightsData} />
      </Suspense>
    </div>
  );
}
