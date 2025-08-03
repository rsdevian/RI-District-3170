import express from "express";

import { getClubs, addClub } from "../controllers/club.controller.js";

const router = express.Router();

router.get("/", getClubs);

router.post("/addClub", addClub);

export default router;
