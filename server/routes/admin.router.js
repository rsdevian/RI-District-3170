import express from "express";
import {
    getAllUsers,
    getUserDetails,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users/all", getAllUsers); //get all user details
router.get("/user/:userId", getUserDetails); //get user details by userId

export default router;
