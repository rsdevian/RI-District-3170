//import modules
import express from "express";

//import middlewares
import { upload } from "../middleware/multer.middleware.js";

//import controllers
import {
    uploadFile,
    getAllFiles,
    deleteAllFiles,
    deleteFile,
    getFileStats,
    downloadFile,
} from "../controllers/file.controller.js";

//create router
const router = express.Router();

//route the API endpoints based on the method
router.get("/getall", getAllFiles); //get all files in DB
router.post("/upload", upload().single("file"), uploadFile); //upload a file with user info
router.get("/download/:fileId", downloadFile); // download a specific file from DB
router.delete("/deleteall", deleteAllFiles); //delete all files from DB
router.delete("/delete/:fileId", deleteFile); // delete a specific file from DB
router.get("/stats", getFileStats); //statistics of all files in DB

//export router
export default router;
