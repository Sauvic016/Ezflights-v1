import express from "express";
import * as bookingController from "../controllers/booking-controller";

const router = express.Router();

router.post("/create-booking", bookingController.create);

export default router;
