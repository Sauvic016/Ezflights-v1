import { z } from "zod";

export const createAirplaneSchema = z.object({
  model: z
    .string()
    .min(3, { message: "airplane name should be at least 3 characters long" }),
  totalSeat: z
    .number()
    .min(100, { message: "totalSeat should be atleast greater than 100" }),
});

export const createAirplanesArraySchema = z.array(createAirplaneSchema);
