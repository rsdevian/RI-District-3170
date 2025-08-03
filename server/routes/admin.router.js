//import modules
import express from "express";

//import controllers
import {
    adminStatusCheck,
    getAllUsers,
    getUserDetailsByUserId,
    getUserDetailsByUserEmail,
    addUser,
    sendMail,
    updateUserPassword,
    deleteAllUsers,
    deleteUserByUserId,
    deleteUserByUserEmail,
    getAllFilesByAllUser,
    getFilesByUserId,
    getFilesByUserEmail,
    deleteAllFilesByAllUser,
    deleteFilesByUserEmail,
    deleteFilesByUserId,
    deletedByFileId,
    downloadFile,
} from "../controllers/admin.controller.js";

//create router
const router = express.Router();

//check
router.get("/checkAdminStatus/:userId", adminStatusCheck);

//User Actions
//get
router.get("/users/getAll", getAllUsers); //get all users & details
router.get("/user/getByUserId/:userId", getUserDetailsByUserId); //get user details by userId
router.get("/user/getByUserEmail/:email", getUserDetailsByUserEmail); //get user details by userEmail

//post
router.post("/user/addUser", addUser); //add user
router.post("/user/sendMail/:reciever", sendMail); //send mail

//patch
router.patch("/user/resetPassword/:userId/:newPassword", updateUserPassword); //update user by userId

//delete
router.delete("/users/deleteAll", deleteAllUsers); //get user details by userId
router.delete("/user/deleteByUserId/:userId", deleteUserByUserId); //delete user by userId
router.delete("/user/deleteByUserEmail/:email", deleteUserByUserEmail); //delete user by userEmail

//File Actions
//get
router.get("/files/getAll", getAllFilesByAllUser); //get all files in DB
router.get("/files/getByUserId/:userId", getFilesByUserId); //get files by userId
router.get("/files/getByUserEmail/:email", getFilesByUserEmail); //get files by userEmail
router.get("/files/downloadFile/:fileId", downloadFile);

//delete
router.delete("/files/deleteAll", deleteAllFilesByAllUser); //delete all files in DB
router.delete("/files/deleteByUserEmail/:email", deleteFilesByUserEmail); //delete files by userId
router.delete("/files/deleteByUserId/:userId", deleteFilesByUserId); //delete files by userEmail
router.delete("/files/deleteByFileId/:fileId", deletedByFileId); //delete files by userEmail

// download all files by userId
// download file by fileId
// download all files

//export router
export default router;
