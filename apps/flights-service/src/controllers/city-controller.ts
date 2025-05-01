import { RequestHandler } from "express";
import CityService from "../services/city-service";
import { createCitySchema } from "../validators/city-validator";

const cityService = new CityService();
// Export as a RequestHandler to ensure compatibility with Express
export const create: RequestHandler = async (req, res) => {
  try {
    // Validate request data
    const validationResult = createCitySchema.safeParse(req.body);

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
    const flight = await cityService.createCity(validatedData);

    res.status(201).json({
      data: flight,
      success: true,
      message: "Successfully created a flight",
      err: {},
    });
  } catch (error: unknown) {
    // Type guard for error handling
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    const errorDetails = error instanceof Error ? error.stack : {};

    res.status(500).json({
      data: {},
      success: false,
      message: "Failed to create city",
      err: {
        message: errorMessage,
        details: errorDetails,
      },
    });
  }
};
