import cityRoutes from "./city-route";
import flightRoutes from "./flight-route";
import airportRoutes from "./airport-route";
import airplaneRoutes from "./airplane-route";

import express from "express";
const router = express.Router();

router.use("/city", cityRoutes);
router.use("/flight", flightRoutes);
router.use("/airport", airportRoutes);
router.use("/airplane", airplaneRoutes);

export default router;
