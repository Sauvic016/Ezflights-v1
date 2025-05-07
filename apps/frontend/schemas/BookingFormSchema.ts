import * as z from "zod";

const travelerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    required_error: "Please select a gender",
  }),
  dob: z.string().min(1, "Date of birth is required"),
});

export const bookingFormSchema = z.object({
  travelers: z.array(travelerSchema).min(
    1,
    "At least one traveler is required",
  ),
  countryCode: z.string().optional(),
  bookingCountryCode: z.string().min(1, "Country code is required"),
  bookingMobileNo: z.string().min(
    10,
    "Mobile number must be at least 10 digits",
  ),
  bookingEmail: z.string().email("Invalid email").min(1, "Email is required"),
});
