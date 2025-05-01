import { z } from "zod";

export const createAirportSchema = z.object({
  name: z
    .string()
    .min(5, { message: "airport name should be at least 5 characters long" }),
  cityId: z.number().int().positive("city ID must be a positive integer"),
});

export const createAirportsArraySchema = z.array(createAirportSchema);
