//import modules
import multer from "multer";
import path from "path";
import fs from "fs";

//create storage engine
function storage() {
    return multer.diskStorage({
        //set file destination
        destination: (req, file, cb) => {
            //set upload directory
            const uploadDir = "uploads/pdf/";

            //check if directory exists, if not create it
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            //set destination
            cb(null, uploadDir);
        },

        //set file name
        filename: (req, file, cb) => {
            const uniqueName =
                file.originalname.slice(0, -4) +
                "_" +
                Date.now() +
                path.extname(file.originalname);

            //set file name
            cb(null, uniqueName);
        },
    });
}

//create upload function
function upload() {
    return multer({
        //set storage engine
        storage: storage(),

        //set file limit & filter
        limite: { fileSize: 1024 * 1024 * 25 }, // 50mb
        fileFilter: (req, file, cb) => {
            //check file type
            if (file.mimetype === "application/pdf") {
                cb(null, true);
            } else {
                cb(new Error("Only PDF files are allowed!"), false);
            }
        },
    });
}

//export upload function
export { upload };
