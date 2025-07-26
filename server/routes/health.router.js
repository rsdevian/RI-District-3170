//import modules
import express from "express";

//import controllers
import { getHealth } from "../controllers/health.controller.js";

//create router
const router = express.Router();

//route the API endpoints based on the method
router.get("/", getHealth);

//export the router
export default router;
