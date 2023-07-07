import { Router } from "express";
import { handleLed } from "../controllers/led.controller.js";
const router = Router();

router.get("/:state", handleLed);

export default router;