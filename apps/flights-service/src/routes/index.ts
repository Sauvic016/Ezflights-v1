import cityRoutes from "./city-route";
import flightRoutes from "./flight-route";
import airportRoutes from "./airport-route";
import airplaneRoutes from "./airplane-route";
import DummyService from "../dummy/flight-dummy-service";
const dummyService = new DummyService();

import express from "express";
const router = express.Router();

router.use("/city", cityRoutes);
router.use("/flight", flightRoutes);
router.use("/airport", airportRoutes);
router.use("/airplane", airplaneRoutes);
router.get("/get-flights", async (req, res) => {
  try {
    const { from, to, flightType, departureDate, returnDate } = req.query;

    console.log(from, to, flightType, departureDate, returnDate);
    // do zod validation
    if (
      typeof from !== "string" ||
      typeof to !== "string" ||
      typeof flightType !== "string" ||
      typeof departureDate !== "string" ||
      typeof returnDate !== "string"
    ) {
      res.status(400).json({
        data: {},
        success: false,
        message: "Invalid city name",
        err: {},
      });
      return;
    }

    const flight = await dummyService.getFlights({
      from,
      to,
      flightType,
      departureDate,
      returnDate,
    });
    res.status(201).json({
      message: "flight",
      data: flight,
    });
  } catch (error) {
    res.status(500).json({
      data: [],
    });
  }
});

export default router;
