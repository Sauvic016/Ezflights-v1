import express from "express";
import * as flightController from "../controllers/flight-controller";

const router = express.Router();

// Create a new flight
router.post("/create-flight", flightController.create);
router.post("/reserve-seat", flightController.reserveSeat);
router.get("/get-flight/:id", flightController.get);
router.delete("/delete/:id", flightController.destroy);

export default router;
