import * as z from "zod";

export const flightSearchSchema = z
  .object({
    flightType: z.enum(["oneWay", "roundTrip"]),
    from: z.string().min(2, "Please enter departure city"),
    to: z.string().min(2, "Please enter arrival city"),
    departureDate: z.date({
      required_error: "Please select departure date",
    }),
    // .nullable(),
    returnDate: z.date().nullable().optional(),
    passengers: z.object({
      adults: z.number().min(1).max(9),
      children: z.number().min(0).max(8),
    }),
  })
  .refine((data) => data.from.toLowerCase() !== data.to.toLowerCase(), {
    message: "Departure and arrival cities cannot be the same",
    path: ["to"], // This will show the error under the "to" field
  });
