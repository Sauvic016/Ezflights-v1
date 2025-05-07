import { z } from "zod";

export const citySchema = z.object({
  name: z
    .string()
    .min(2, { message: "city name must be 2 or more characters long" }),
});

export type cityRequest = z.infer<typeof citySchema>;
