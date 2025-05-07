import { RequestHandler } from "express";
import AirplaneService from "../services/airplane-service";
import { createAirplanesArraySchema, createAirplaneSchema } from "@repo/types";

const airplaneService = new AirplaneService();

export const create: RequestHandler = async (req, res) => {
  try {
    const validationResult = createAirplaneSchema.safeParse(req.body);
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

    const airplane = await airplaneService.createAirplane(validatedData);
    res.status(201).json({
      data: airplane,
      success: true,
      message: "Successfully created the airport",
      err: {},
    });
  } catch (error: unknown) {
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

export const createMany: RequestHandler = async (req, res) => {
  try {
    const validationResult = createAirplanesArraySchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        data: {},
        success: false,
        message: "Invalid data for airplane creation",
        err: validationResult.error.format(),
      });
      return;
    }
    const validatedData = validationResult.data;

    const airplanes = await airplaneService.createAirplanes(validatedData);
    res.status(201).json({
      data: airplanes,
      success: true,
      message: "Successfully created the airplanes",
      err: {},
    });
  } catch (error: unknown) {
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
