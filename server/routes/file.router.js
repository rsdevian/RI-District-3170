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
router.get("/getall", getAllFiles);
router.post("/upload", upload().single("file"), uploadFile);
router.get("/download/:fileId", downloadFile); // Fixed download route
router.delete("/deleteall", deleteAllFiles);
router.delete("/delete/:fileId", deleteFile);
router.get("/stats", getFileStats);

//export router
export default router;