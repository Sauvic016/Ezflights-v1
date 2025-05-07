import express from "express";
import { create, getCityByName } from "../controllers/city-controller";
const router = express.Router();

router.post("/create-city", create);
router.get("/get-city", getCityByName);

export default router;
