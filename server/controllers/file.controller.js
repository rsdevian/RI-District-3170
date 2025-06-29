//import modules
import fs from "fs";
import path from "path";

//import loggers
import { requestLog } from "../logs/request.logger.js";

//constants
const uploadDir = "uploads/pdf";

async function fileUpload(req, res) {
    //handle the file upload function

    try {
        //log resquest info
        requestLog(req);

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

        //return the status of file details unavailability
        if (!fileDetails) {
            return res.status(400).json({
                message: "File Details not available",
            });
        }

        //return the upload status
        return res.status(200).json({
            message: "File has been uploaded successfully",
        });
    } catch (error) {
        //return the error message
        console.error("Error Uploading File: ", error.message);
        return res.status(500).json({
            message: "Error uploading file",
            error: true,
        });
    }
}

async function getFiles(req, res) {
    //handle the files fetch function

    try {
        //log resquest info
        requestLog(req);

        //get the stored directory
        if (!fs.existsSync(uploadDir)) {
            return res.status(404).json({
                message: "No files found",
                success: true,
                error: false,
                data: { files: [], count: 0, totalSizes: 0 },
            });
        }

        //get the list of files in the directory
        const files = fs.readdirSync(uploadDir);

        const fileDetails = [];

        //loop through the files and get the details
        files.forEach((file) => {
            const filePath = `${uploadDir}/${file}`;
            const fileStat = fs.statSync(filePath);
            fileDetails.push({
                filename: file,
                size: fileStat.size,
                uploadedAt: fileStat.ctime.toISOString(),
            });

            // get the total size of all files
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
        return res.status(200).json({
            files,
            message: "All Files Fetched Successfully",
        });
    } catch (error) {
        //return the error message
        console.error("Error Getting all files: ", error);
        return res.status(500).json({ message: "Error getting all files" });
    }
}

async function deleteFiles(req, res) {
    //handle the files deletion function

    try {
        //log request info
        requestLog(req);

        //check if directory exists
        if (!fs.existsSync(uploadDir)) {
            return res.status(200).json({
                message: "No files to delete",
                success: true,
                error: false,
            });
        }

        //get all files in directory
        const files = fs.readdirSync(uploadDir);

        //delete each file with deletion counter
        let deletedCount = 0;
        files.forEach((file) => {
            const filePath = path.join(uploadDir, file);
            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
                deletedCount++;
            }
        });

        //return success response
        return res.status(200).json({
            message: `Successfully deleted ${deletedCount} files`,
            success: true,
            error: false,
            data: { deletedCount },
        });
    } catch (error) {
        //return the error message
        console.error("Error Deleting All files: ", error);
        return res.status(500).json({
            message: "Error deleting all files",
            success: false,
            error: true,
        });
    }
}

//export controllers
export { fileUpload, getFiles, deleteFiles };
