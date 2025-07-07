//import modules
import express from "express";

//import middlewares
import { upload } from "../middleware/multer.middleware.js";

//import controllers
import {
    uploadFile,
    getAllFiles,
    deleteAllFiles,
} from "../controllers/file.controller.js";

//create router
const router = express.Router();

//route the API endpoints based on the method
router.get("/getall", getAllFiles);
router.post("/upload", upload().single("file"), uploadFile);
router.delete("/deleteAll", deleteAllFiles);

//export router
export default router;
