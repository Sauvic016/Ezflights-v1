import express from "express";
import * as airplaneController from "../controllers/airplane-controller";

const router = express.Router();

// Create a new flight
router.post("/create-airplane", airplaneController.create);
router.post("/create-airplanes", airplaneController.createMany);

export default router;
