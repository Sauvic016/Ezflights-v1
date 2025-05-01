import express from "express";
import * as airportController from "../controllers/airport-controller";

const router = express.Router();

// Create a new flight
router.post("/create-airport", airportController.create);
router.post("/create-airports", airportController.createMany);

export default router;
