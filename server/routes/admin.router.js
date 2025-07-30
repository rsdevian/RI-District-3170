import express from "express";
import {
    getAllUsers,
    getUserDetails,
    getAllFilesByAllUser,
    deleteAllFilesByAllUser,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users/all", getAllUsers); //get all user details
router.get("/user/:userId", getUserDetails); //get user details by userId
router.get("/files/all", getAllFilesByAllUser); //get all files in DB
router.get("/files/deleteall", deleteAllFilesByAllUser); //get all files in DB

export default router;
