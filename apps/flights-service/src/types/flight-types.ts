import type {
  Flight as PrismaFlight,
  Seat as PrismaSeat,
} from "@repo/database/client";

// Base type - complete model with all fields
export type Flight = PrismaFlight;

// Type for creating a new flight - omits auto-generated fields
export type CreateFlightInput = Omit<
  Flight,
  "id" | "createdAt" | "updatedAt"
>;

// Type for updating a flight - makes all fields optional
export type UpdateFlightInput = Partial<CreateFlightInput>;

// Type for seat with booking status
export interface SeatWithStatus extends PrismaSeat {
  isBooked: boolean;
}

// Type for flight response with seat information
export interface FlightWithDetails extends Flight {
  origin: {
    id: number;
    name: string;
    city: {
      id: number;
      name: string;
    };
  };
  destination: {
    id: number;
    name: string;
    city: {
      id: number;
      name: string;
    };
  };
  airplane: {
    id: number;
    model: string;
    totalSeat: number;
  };
  seatAvailability: {
    availableSeats: number;
    bookedSeats: number;
  };
}
