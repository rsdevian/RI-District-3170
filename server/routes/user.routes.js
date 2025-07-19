//import modules
import express from "express";

//import controllers
import { userLogin, userSignup } from "../controllers/user.controller.js";

//create router
const router = express.Router();

//route the API endpoints based on the method
router.post("/login", userLogin);
router.post("/signup", userSignup);

//export the router
export default router;
