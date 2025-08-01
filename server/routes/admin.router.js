import express from "express";
import {
    getAllUsers,
    getUserDetailsByUserId,
    getUserDetailsByEmail,
    getAllFilesByAllUser,
    deleteAllFilesByAllUser,
    deleteUserByEmail,
    deleteUserByUserId,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users/getAll", getAllUsers); //get all user details
router.get("/user/getUserId/:userId", getUserDetailsByUserId); //get user details by userId
router.get("/user/getEmail/:email", getUserDetailsByEmail); //get user details by userId
router.delete("/user/deleteEmail/:email", deleteUserByEmail); //get user details by userId
router.delete("/user/deleteUserId/:userId", deleteUserByUserId); //get user details by userId
router.get("/files/getAll", getAllFilesByAllUser); //get all files in DB
router.delete("/files/deleteAllFiles", deleteAllFilesByAllUser); //get all files in DB

// download all files by userId
// download file by fileId
// download all files
// view all files
// view all files by userId

export default router;
