import { RequestHandler } from "express";
import AirportService from "../services/airport-service";
import {
  createAirportSchema,
  createAirportsArraySchema,
} from "../validators/airport-validator";

const airportService = new AirportService();

export const create: RequestHandler = async (req, res) => {
  try {
    const validationResult = createAirportSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        data: {},
        success: false,
        message: "Invalid data for airport creation",
        err: validationResult.error.format(),
      });
      return;
    }
    const validatedData = validationResult.data;

    const airport = await airportService.createAirport(validatedData);
    res.status(201).json({
      data: airport,
      success: true,
      message: "Successfully created the airport",
      err: {},
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
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

export const createMany: RequestHandler = async (req, res) => {
  try {
    const validationResult = createAirportsArraySchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        data: {},
        success: false,
        message: "Invalid data for airports creation",
        err: validationResult.error.format(),
      });
      return;
    }
    const validatedData = validationResult.data;

    const airports = await airportService.createAirports(validatedData);
    res.status(201).json({
      data: airports,
      success: true,
      message: "Successfully created the airports",
      err: {},
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
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
