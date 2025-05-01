import express from "express";
import { create } from "../controllers/city-controller";
const router = express.Router();

router.post("/create-city", create);

export default router;
