import { Router } from "express";
import { publishMss, getTemp } from "../controllers/temp.controller.js";
const router = Router();

router.get("/", getTemp);
router.post("/", publishMss);

export default router;
