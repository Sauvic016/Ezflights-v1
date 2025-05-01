import { z } from "zod";

// Define the schema for creating a flight
export const createFlightSchema = z.object({
  airplaneId: z.number().int().positive(
    "Airplane ID must be a positive integer",
  ),
  originId: z.number().int().positive("Origin ID must be a positive integer"),
  destinationId: z.number().int().positive(
    "Destination ID must be a positive integer",
  ),
  arrivalTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Arrival time must be a valid date",
  }),
  departureTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Departure time must be a valid date",
  }),
  basePrice: z.number().positive("Price must be a positive number"),
});

export type CreateFlightRequest = z.infer<typeof createFlightSchema>;
