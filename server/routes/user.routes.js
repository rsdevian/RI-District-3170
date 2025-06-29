//import modules
import express from "express";

//import controllers
import { userLogin } from "../controllers/user.controller.js";

//create router
const router = express.Router();

router.get("/login", userLogin);

//export the router
export default router;
