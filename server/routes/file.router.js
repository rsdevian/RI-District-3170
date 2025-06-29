//import modules
import express from "express";

//import middlewares
import { upload } from "../middleware/multer.middleware.js";

//import controllers
import {
    fileUpload,
    getFiles,
    deleteFiles,
} from "../controllers/file.controller.js";

//create router
const router = express.Router();

//route the API endpoints based on the method
router.get("/getall", getFiles);
router.post("/upload", upload().single("file"), fileUpload);
router.delete("/deleteAll", deleteFiles);

//export router
export default router;
