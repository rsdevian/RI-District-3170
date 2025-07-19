// controllers/fileController.js

import File from "../models/file.model.js";
import mongoose from "mongoose";
import crypto from "crypto";
import fs from "fs";
import { GridFSBucket } from "mongodb";

// Initialize GridFS bucket
let bucket;

// Initialize GridFS bucket when connection is ready
const initGridFS = () => {
    if (mongoose.connection.readyState === 1) {
        bucket = new GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads",
        });
    }
};

// Monitor connection state
mongoose.connection.on("connected", initGridFS);
mongoose.connection.on("reconnected", initGridFS);

// Helper function to generate file hash from buffer
const generateFileHashFromBuffer = (buffer) => {
    return crypto.createHash("md5").update(buffer).digest("hex");
};

// Helper function to generate file hash from file path
const generateFileHash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("md5");
        const stream = fs.createReadStream(filePath);

        stream.on("data", (data) => hash.update(data));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", reject);
    });
};

// Controller for file upload with GridFS
const uploadFile = async (req, res) => {
    try {
        // Check if GridFS bucket is initialized
        if (!bucket) {
            initGridFS();
            if (!bucket) {
                return res.status(500).json({
                    success: false,
                    message: "Database connection not ready",
                });
            }
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Extract user details from request
        const { userEmail, userName, userId } = req.body;

        // Validate required fields
        if (!userEmail || !userName || !userId) {
            // Clean up uploaded file if validation fails
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting file:", err);
                });
            }

            return res.status(400).json({
                success: false,
                message:
                    "User details (userEmail, userName, userId) are required",
            });
        }

        // Validate file type
        if (req.file.mimetype !== "application/pdf") {
            // Clean up uploaded file
            if (req.file.path && fs.existsSync(req.file.path)) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error("Error deleting file:", err);
                });
            }

            return res.status(400).json({
                success: false,
                message: "Only PDF files are allowed",
            });
        }

        // Generate file hash for duplicate detection
        const fileHash = await generateFileHash(req.file.path);

        // Check for duplicate files (same hash + same user)
        // const duplicateFile = await File.findOne({
        //     fileHash: fileHash,
        //     userId: userId,
        //     isActive: true,
        // });

        // if (duplicateFile) {
        //     // Clean up uploaded file
        //     if (req.file.path && fs.existsSync(req.file.path)) {
        //         fs.unlink(req.file.path, (err) => {
        //             if (err) console.error("Error deleting file:", err);
        //         });
        //     }

        //     return res.status(409).json({
        //         success: false,
        //         message: "This file has already been uploaded",
        //         duplicateFile: duplicateFile.fileName,
        //     });
        // }

        // Upload file to GridFS
        const uploadStream = bucket.openUploadStream(req.file.filename, {
            metadata: {
                originalName: req.file.originalname,
                userId: userId,
                userName: userName,
                userEmail: userEmail,
                fileHash: fileHash,
                uploadDate: new Date(),
            },
        });

        // Read file and upload to GridFS
        const fileBuffer = fs.readFileSync(req.file.path);

        // Create a promise to handle the upload
        const gridfsUpload = new Promise((resolve, reject) => {
            uploadStream.end(fileBuffer);

            uploadStream.on("finish", () => {
                resolve(uploadStream.id);
            });

            uploadStream.on("error", (error) => {
                reject(error);
            });
        });

        // Wait for GridFS upload to complete
        const gridfsFileId = await gridfsUpload;

        // Create new file record
        const newFile = new File({
            fileName: req.file.filename,
            originalName: req.file.originalname,
            gridfsFileId: gridfsFileId,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            userId: userId,
            userName: userName,
            userEmail: userEmail,
            fileHash: fileHash,
            status: "completed",
        });

        // Save to database
        await newFile.save();

        // Clean up temporary file
        if (req.file.path && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting temporary file:", err);
            });
        }

        // Return success response
        res.status(201).json({
            success: true,
            message: "File uploaded successfully to MongoDB",
            file: {
                id: newFile._id,
                fileName: newFile.fileName,
                originalName: newFile.originalName,
                fileSize: newFile.fileSize,
                uploadDate: newFile.uploadDate,
                status: newFile.status,
                gridfsFileId: gridfsFileId,
            },
        });
    } catch (error) {
        console.error("Error uploading file:", error);

        // Clean up uploaded file in case of error
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error during file upload",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

// Controller to serve/download PDF files from GridFS
const downloadFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { userId } = req.query;

        // Check if GridFS bucket is initialized
        if (!bucket) {
            initGridFS();
            if (!bucket) {
                return res.status(500).json({
                    success: false,
                    message: "Database connection not ready",
                });
            }
        }

        // Validate input
        if (!fileId || !userId) {
            return res.status(400).json({
                success: false,
                message: "File ID and User ID are required",
            });
        }

        // Find the file in database
        const file = await File.findOne({
            _id: fileId,
            userId: userId,
            isActive: true,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message:
                    "File not found or you do not have permission to access it",
            });
        }

        // Check if file exists in GridFS
        const files = await bucket.find({ _id: file.gridfsFileId }).toArray();

        if (files.length === 0) {
            return res.status(404).json({
                success: false,
                message: "File not found in database",
            });
        }

        const gridfsFile = files[0];

        // Set appropriate headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${file.originalName}"`
        );
        res.setHeader("Content-Length", gridfsFile.length);

        // Stream the file from GridFS
        const downloadStream = bucket.openDownloadStream(file.gridfsFileId);

        downloadStream.on("error", (error) => {
            console.error("Error streaming file from GridFS:", error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: "Error streaming file",
                });
            }
        });

        // Pipe the stream to response
        downloadStream.pipe(res);
    } catch (error) {
        console.error("Error downloading file:", error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: "Internal server error while downloading file",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            });
        }
    }
};

// Controller to get all files for a user
const getAllFiles = async (req, res) => {
    try {
        const { userId, userEmail } = req.query;

        // Validate input - need either userId or userEmail
        if (!userId && !userEmail) {
            return res.status(400).json({
                success: false,
                message: "Either userId or userEmail is required",
            });
        }

        let files;

        // Query based on available parameter
        if (userId) {
            files = await File.findByUserId(userId);
        } else {
            files = await File.findByUserEmail(userEmail);
        }

        // Check GridFS file existence
        const validFiles = [];
        const missingFiles = [];

        if (bucket) {
            for (const file of files) {
                try {
                    const gridfsFiles = await bucket
                        .find({ _id: file.gridfsFileId })
                        .toArray();
                    if (gridfsFiles.length > 0) {
                        validFiles.push(file);
                    } else {
                        missingFiles.push(file);
                        console.warn(
                            `GridFS file missing: ${file.fileName} with ID ${file.gridfsFileId}`
                        );
                    }
                } catch (error) {
                    console.error(
                        `Error checking GridFS file ${file.fileName}:`,
                        error
                    );
                    missingFiles.push(file);
                }
            }
        } else {
            // If GridFS is not available, assume all files are valid
            validFiles.push(...files);
        }

        // Return files with metadata
        res.status(200).json({
            success: true,
            message: `Found ${validFiles.length} files (${missingFiles.length} files missing from GridFS)`,
            count: validFiles.length,
            missingCount: missingFiles.length,
            files: validFiles.map((file) => ({
                id: file._id,
                fileName: file.fileName,
                originalName: file.originalName,
                fileSize: file.fileSize,
                uploadDate: file.uploadDate,
                status: file.status,
                fileExists: true,
            })),
            missingFiles: missingFiles.map((file) => ({
                id: file._id,
                fileName: file.fileName,
                originalName: file.originalName,
                fileExists: false,
            })),
        });
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching files",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

// Controller to delete all files for a user
const deleteAllFiles = async (req, res) => {
    try {
        const { userId, userEmail } = req.body;

        // Check if GridFS bucket is initialized
        if (!bucket) {
            initGridFS();
            if (!bucket) {
                return res.status(500).json({
                    success: false,
                    message: "Database connection not ready",
                });
            }
        }

        // Validate input
        if (!userId && !userEmail) {
            return res.status(400).json({
                success: false,
                message: "Either userId or userEmail is required",
            });
        }

        // Get files to be deleted
        let filesToDelete;
        if (userId) {
            filesToDelete = await File.find({
                userId: userId,
                isActive: true,
                status: "completed",
            });
        } else {
            filesToDelete = await File.find({
                userEmail: userEmail.toLowerCase(),
                isActive: true,
                status: "completed",
            });
        }

        if (filesToDelete.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No files found to delete",
            });
        }

        // Delete files from GridFS
        let deletedFromGridFS = 0;
        const deletePromises = filesToDelete.map(async (file) => {
            try {
                await bucket.delete(file.gridfsFileId);
                deletedFromGridFS++;
            } catch (error) {
                console.error(
                    `Error deleting GridFS file ${file.fileName}:`,
                    error
                );
            }
        });

        await Promise.all(deletePromises);

        // Soft delete files in database
        let result;
        if (userId) {
            result = await File.deleteAllByUserId(userId);
        } else {
            result = await File.deleteAllByUserEmail(userEmail);
        }

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.modifiedCount} files from database and ${deletedFromGridFS} files from GridFS`,
            deletedCount: result.modifiedCount,
            deletedFromGridFS: deletedFromGridFS,
        });
    } catch (error) {
        console.error("Error deleting files:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting files",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

// Controller to delete a specific file
const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { userId } = req.body;

        // Check if GridFS bucket is initialized
        if (!bucket) {
            initGridFS();
            if (!bucket) {
                return res.status(500).json({
                    success: false,
                    message: "Database connection not ready",
                });
            }
        }

        // Validate input
        if (!fileId || !userId) {
            return res.status(400).json({
                success: false,
                message: "File ID and User ID are required",
            });
        }

        // Find the file
        const file = await File.findOne({
            _id: fileId,
            userId: userId,
            isActive: true,
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message:
                    "File not found or you do not have permission to delete it",
            });
        }

        // Delete from GridFS
        try {
            await bucket.delete(file.gridfsFileId);
        } catch (error) {
            console.error(
                `Error deleting GridFS file ${file.fileName}:`,
                error
            );
        }

        // Soft delete the file
        file.isActive = false;
        await file.save();

        res.status(200).json({
            success: true,
            message: "File deleted successfully",
            fileName: file.fileName,
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting file",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

// Controller to get file statistics
const getFileStats = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const stats = await File.getUserFileStats(userId);

        res.status(200).json({
            success: true,
            message: "File statistics retrieved successfully",
            stats:
                stats.length > 0
                    ? stats[0]
                    : {
                          totalFiles: 0,
                          totalSize: 0,
                          averageSize: 0,
                          latestUpload: null,
                      },
        });
    } catch (error) {
        console.error("Error fetching file stats:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching file statistics",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

export {
    uploadFile,
    getAllFiles,
    deleteAllFiles,
    deleteFile,
    getFileStats,
    downloadFile,
};
