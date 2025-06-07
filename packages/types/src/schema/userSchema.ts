import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z
    .string()
    .min(10, { message: "Must be a valid mobile number" })
    .max(14, { message: "Must be a valid mobile number" }),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
});

export const loginUserSchema = createUserSchema.pick({
  email: true,
  password: true,
});

export const updateUserSchema = createUserSchema
  .omit({ password: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "You must provide at least one field to update",
  });

export const resetSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6),
});
export type updateUser = z.infer<typeof updateUserSchema>;
export type User = z.infer<typeof createUserSchema>;
