import express from "express";

import { getZones, addZone } from "../controllers/zones.controller.js";

const router = express.Router();

router.get("/", getZones);

router.post("/addZone", addZone);

export default router;
