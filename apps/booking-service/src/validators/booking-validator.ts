import { z } from "zod";
import { GenderRole, PaymentMethod } from "@repo/database/client";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
);

export const seatNumberSchema = z
  .string()
  .regex(
    /^[1-9][0-9]*[A-F]$/,
    "Seat number must be in the format like '1A', '12C', '18D' (row number + column letter A-F)",
  );

export const travelerSchema = z.object({
  firstName: z.string().min(2, "firstname should be atleast 2 characters long"),
  lastName: z.string().min(2, "lastName should be atleast 2 characters long"),
  dob: z.string().datetime(),
  gender: z.nativeEnum(GenderRole, {
    errorMap: () => ({ message: "Invalid Gender" }),
  }),
  seatNumber: seatNumberSchema.optional(),
});

export const travelersSchema = z
  .array(travelerSchema)
  .min(1, "At least one traveler is required")
  .max(6, "Maximum 6 travelers bookings is allowed at a time");

export const createBookingSchema = z.object({
  flightId: z.string().min(4, "flightId must be minimum of lenth 5"),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().regex(phoneRegex, "Invalid Number!"),
  }),
  paymentMethod: z.nativeEnum(PaymentMethod, {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
  travelers: travelersSchema,
});

export type CreateBookingType = z.infer<typeof createBookingSchema>;
