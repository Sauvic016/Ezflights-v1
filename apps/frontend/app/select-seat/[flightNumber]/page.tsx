import React, { Suspense } from "react";
import AirplaneInteriorSeatMap from "@/components/SeatNMeals/NewSeat";
import axios from "axios";

interface FlightData {
  Seat: any[]; // Replace 'any' with your actual Seat type
  // Add other flight data properties as needed
}

interface PageProps {
  params: {
    flightNumber: string;
  };
}

async function getFlight(id: string): Promise<FlightData | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_flight_service}/api/flight/get-flight/${id}`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching flight:", error);
    return null;
  }
}

export default async function SelectSeatPage({ params }: PageProps) {
  const data = await getFlight(params.flightNumber);

  if (!data) {
    return (
      <div className="my-24 bg-sky-50">
        <div>Flight not found. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="my-24 bg-sky-50">
      <Suspense fallback={<div>Loading....</div>}>
        <AirplaneInteriorSeatMap FlightSeats={data.Seat} />
      </Suspense>
    </div>
  );
}
