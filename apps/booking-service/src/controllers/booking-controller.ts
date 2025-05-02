import BookingService from "../services/booking-service";
import { RequestHandler } from "express";
import { createBookingSchema } from "../validators/booking-validator";

const bookingservice = new BookingService();

export const create: RequestHandler = async (req, res) => {
  try {
    const validationResult = createBookingSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        data: {},
        success: false,
        message: "Invalid data for booking creation",
        err: validationResult.error.format(),
      });
      return;
    }
    const validatedData = validationResult.data;

    const booking = await bookingservice.createGuestBooking(validatedData);
    res.status(201).json({
      data: booking,
      success: true,
      message: "Successfully created the booking",
      err: {},
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    const errorDetails = error instanceof Error ? error.stack : {};

    res.status(500).json({
      data: {},
      success: false,
      message: "Failed to create booking",
      err: {
        message: errorMessage,
        details: errorDetails,
      },
    });
  }
};
