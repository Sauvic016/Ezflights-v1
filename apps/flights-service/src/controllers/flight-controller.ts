import { RequestHandler } from "express";
import FlightService from "../services/flight-service";
import { createFlightSchema } from "@repo/types";

const flightService = new FlightService();
// Export as a RequestHandler to ensure compatibility with Express
export const create: RequestHandler = async (req, res) => {
  try {
    // Validate request data
    const validationResult = createFlightSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        data: {},
        success: false,
        message: "Invalid flight data",
        err: validationResult.error.format(),
      });
      return;
    }

    const validatedData = validationResult.data;

    // Pass the validated data directly to the service
    const flight = await flightService.createFlight(validatedData);

    res.status(201).json({
      data: flight,
      success: true,
      message: "Successfully created a flight",
      err: {},
    });
  } catch (error: unknown) {
    // Type guard for error handling
    const errorMessage = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    const errorDetails = error instanceof Error ? error.stack : {};

    res.status(500).json({
      data: {},
      success: false,
      message: "Failed to create flight",
      err: {
        message: errorMessage,
        details: errorDetails,
      },
    });
  }
};

export const get: RequestHandler = async (req, res) => {
  try {
    // const id: string = req.params.id;
    const id = "EZ00001";
    const flight = await flightService.getFlightById(id);
    res.status(200).json({
      data: flight,
      success: true,
      message: "Successfully retrieved a flight",
      err: {},
    });
  } catch (error: unknown) {
    // Type guard for error handling
    const errorMessage = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    const errorDetails = error instanceof Error ? error.stack : {};

    res.status(500).json({
      data: {},
      success: false,
      message: "Failed to fetch flight",
      err: {
        message: errorMessage,
        details: errorDetails,
      },
    });
  }
};

export const destroy: RequestHandler = async (req, res) => {
  try {
    const id: string = req.params.id;
    const flight = await flightService.deleteFlight(id);
    res.status(200).json({
      data: flight,
      success: true,
      message: "Successfully deleted the flight",
      err: {},
    });
  } catch (error: unknown) {
    // Type guard for error handling
    const errorMessage = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    const errorDetails = error instanceof Error ? error.stack : {};

    res.status(500).json({
      data: {},
      success: false,
      message: "Failed to create flight",
      err: {
        message: errorMessage,
        details: errorDetails,
      },
    });
  }
};

export const reserveSeat: RequestHandler = async (req, res) => {
  try {
    let { flightId, seatNumbers } = req.body;
    flightId = "EZ00001";
    const isAvailable = await flightService.reserveSeat(
      flightId,
      seatNumbers,
    );
    res.status(200).json({
      data: isAvailable,
      success: true,
    });
  } catch (error: unknown) {
    // Type guard for error handling
    const errorMessage = error instanceof Error
      ? error.message
      : "An unknown error occurred";

    res.status(500).json({
      data: { available: false },
      success: false,
      err: {
        message: errorMessage,
      },
    });
  }
};
