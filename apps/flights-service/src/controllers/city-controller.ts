import { RequestHandler } from "express";
import CityService from "../services/city-service";
import { citySchema } from "@repo/types";

const cityService = new CityService();
// Export as a RequestHandler to ensure compatibility with Express
export const create: RequestHandler = async (req, res) => {
  try {
    // Validate request data
    const validationResult = citySchema.safeParse(req.body);

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
    const errorMessage = error instanceof Error
      ? error.message
      : "An unknown error occurred";
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

export const getCityByName: RequestHandler = async (req, res) => {
  try {
    const { name } = req.query;
    console.log(req.query);

    if (typeof name !== "string") {
      res.status(400).json({
        data: {},
        success: false,
        message: "Invalid city name",
        err: {},
      });
      return;
    }

    const cities = await cityService.getCityByName(name);
    res.status(200).json({
      data: cities,
    });
  } catch (error) {
    res.status(500).json({
      data: {},
    });
  }
};
