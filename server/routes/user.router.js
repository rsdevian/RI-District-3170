//import modules
import express from "express";

//import controllers
import { userLogin, userSignup } from "../controllers/user.controller.js";

//create router
const router = express.Router();

//route the API endpoints based on the method
router.post("/login", userLogin); //login user details in client
router.post("/signup", userSignup); //save user details in DB

//export the router
export default router;
