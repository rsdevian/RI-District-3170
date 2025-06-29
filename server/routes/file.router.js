//import modules
import express from "express";

//import middlewares
import { upload } from "../middleware/multer.js";

//import controllers
import { fileUpload, getFiles } from "../controllers/file.controller.js";

//create router
const router = express.Router();

router.get("/getall", getFiles);
router.post("/upload", upload().single("file"), fileUpload);

//export router
export default router;
