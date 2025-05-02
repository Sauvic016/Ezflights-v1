import type {
  Flight as PrismaFlight,
  Seat as PrismaSeat,
} from "@repo/database/client";

// Base type - complete model with all fields
export type Flight = PrismaFlight;

// Type for creating a new flight - omits auto-generated fields
export type CreateFlightInput = Omit<Flight, "id" | "createdAt" | "updatedAt">;

// Type for updating a flight - makes all fields optional
export type UpdateFlightInput = Partial<CreateFlightInput>;
