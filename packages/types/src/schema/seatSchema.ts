import { z } from "zod";

export const seatClassEnum = z.enum([
  "FIRST_CLASS",
  "BUSINESS",
  "PREMIUM_ECONOMY",
  "ECONOMY",
]);

export type SeatClass = z.infer<typeof seatClassEnum>;

export const seatNumberSchema = z
  .string()
  .regex(
    /^[1-9][0-9]*[A-F]$/,
    "Seat number must be in the format like '1A', '12C', '18D' (row number + column letter A-F)",
  );

export type SeatNumber = z.infer<typeof seatNumberSchema>;

export const seatSchema = z.object({
  id: z.number(),
  row: z.number(),
  column: z.string(),
  flightId: z.string(),
  seatClass: seatClassEnum,
  isBooked: z.boolean(),
});

export type Seat = z.infer<typeof seatSchema>;
