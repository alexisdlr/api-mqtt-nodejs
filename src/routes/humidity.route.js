import { Router } from "express";
import { getHum } from "../controllers/hum.controller.js";
const router = Router();

router.get("/", getHum);

export default router