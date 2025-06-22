//import modules
import fs from "fs";
import path from "path";

//import loggers
import { requestLog } from "../logs/request.logger.js";
const fileUpload = async (req, res) => {
    //log resquest info
    requestLog(req);

    try {
        //return of there is no files
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded!",
                error: true,
            });
        }

        //get file details
        const fileDetails = {
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
            uploadedAt: new Date().toISOString(),
        };

        //return the upload status
        if (fileDetails) {
            res.status(200).json({
                message: "File has been uploaded successfully",
            });
        }
    } catch (error) {
        //return the error message
        console.error("Error Uploading File: ", error.message);
        res.status(500).json({
            message: "Error uploading file",
            error: true,
        });
    }
};

const getFiles = async (req, res) => {
    //log resquest info
    requestLog(req);

    const uploadsDir = "uploads/pdf";

    try {
        //get the stored directory
        if (!fs.existsSync(uploadsDir)) {
            return res.status(404).json({
                message: "No files found",
                success: true,
                error: false,
                data: { files: [], count: 0, totalSizes: 0 },
            });
        }

        //get the list of files in the directory
        const files = fs.readdirSync(uploadsDir);

        const fileDetails = [];

        //loop through the files and get the details
        files.forEach((file) => {
            const filePath = `${uploadsDir}/${file}`;
            const fileStat = fs.statSync(filePath);
            fileDetails.push({
                filename: file,
                size: fileStat.size,
                uploadedAt: fileStat.ctime.toISOString(),
            });

            if (
                fileStat.isFile() &&
                path.extname(file).toLowerCase() === ".pdf"
            ) {
                const fileInfo = {
                    filename: file,
                    originalName: file, // You might want to store original names in DB
                    mimetype: "application/pdf",
                    createdAt: fileStat.birthtime.toISOString(),
                    modifiedAt: fileStat.mtime.toISOString(),
                };
                fileDetails.push(fileInfo);
            }
        });

        //return the file details
        res.status(200).json({
            files,
            message: "All Files Fetched Successfully",
        });
    } catch (error) {
        //return the error message
        console.error("Error Getting all files: ", error);
        res.status(500).json({ message: "Error getting all files" });
    }
};

//export controllers
export { fileUpload, getFiles };
