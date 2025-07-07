// controllers/fileController.js

import File from "../models/file.model.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Helper function to generate file hash
const generateFileHash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("md5");
        const stream = fs.createReadStream(filePath);

        stream.on("data", (data) => hash.update(data));
        stream.on("end", () => resolve(hash.digest("hex")));
        stream.on("error", reject);
    });
};

// Helper function to ensure upload directory exists
const ensureUploadDir = (uploadPath) => {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
};

// Helper function to verify file exists and is readable
const verifyFileExists = (filePath) => {
    try {
        return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
    } catch (error) {
        console.error("Error verifying file:", error);
        return false;
    }
};

// Controller for file upload
const uploadFile = async (req, res) => {
    try {
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
            if (req.file.path) {
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
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });

            return res.status(400).json({
                success: false,
                message: "Only PDF files are allowed",
            });
        }

        // Verify the file was actually saved
        if (!verifyFileExists(req.file.path)) {
            return res.status(500).json({
                success: false,
                message: "File upload failed - file not found on server",
            });
        }

        // Generate file hash for duplicate detection
        const fileHash = await generateFileHash(req.file.path);

        // Check for duplicate files (same hash + same user)
        const duplicateFile = await File.findOne({
            fileHash: fileHash,
            userId: userId,
            isActive: true,
        });

        if (duplicateFile) {
            // Clean up uploaded file
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error deleting file:", err);
            });

            return res.status(409).json({
                success: false,
                message: "This file has already been uploaded",
                duplicateFile: duplicateFile.fileName,
            });
        }

        // Create new file record with additional path verification
        const newFile = new File({
            fileName: req.file.filename,
            originalName: req.file.originalname,
            filePath: req.file.path,
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

        // Final verification that file still exists after database save
        if (!verifyFileExists(req.file.path)) {
            console.error("Warning: File disappeared after database save");
        }

        // Return success response
        res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            file: {
                id: newFile._id,
                fileName: newFile.fileName,
                originalName: newFile.originalName,
                fileSize: newFile.fileSize,
                uploadDate: newFile.uploadDate,
                status: newFile.status,
                filePath: newFile.filePath, // Include path for debugging
            },
        });
    } catch (error) {
        console.error("Error uploading file:", error);

        // Clean up uploaded file in case of error
        if (req.file && req.file.path) {
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

// Controller to serve/download PDF files
const downloadFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { userId } = req.query;

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
                message: "File not found or you do not have permission to access it",
            });
        }

        // Check if file exists on filesystem
        if (!verifyFileExists(file.filePath)) {
            return res.status(404).json({
                success: false,
                message: "File not found on server",
            });
        }

        // Set appropriate headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.setHeader('Content-Length', file.fileSize);

        // Stream the file
        const fileStream = fs.createReadStream(file.filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: "Error streaming file",
                });
            }
        });

    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while downloading file",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

// Controller to get all files for a user with file existence check
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

        // Check file existence and filter out missing files
        const validFiles = [];
        const missingFiles = [];

        for (const file of files) {
            if (verifyFileExists(file.filePath)) {
                validFiles.push(file);
            } else {
                missingFiles.push(file);
                console.warn(`File missing: ${file.fileName} at ${file.filePath}`);
            }
        }

        // Return files with metadata
        res.status(200).json({
            success: true,
            message: `Found ${validFiles.length} files (${missingFiles.length} files missing from filesystem)`,
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

// Controller to get files by specific user selection
const getFilesByUser = async (req, res) => {
    try {
        const { selectedUserId, selectedUserEmail } = req.query;

        // Validate input
        if (!selectedUserId && !selectedUserEmail) {
            return res.status(400).json({
                success: false,
                message:
                    "Either selectedUserId or selectedUserEmail is required",
            });
        }

        let files;
        let userInfo;

        // Query based on available parameter
        if (selectedUserId) {
            files = await File.findByUserId(selectedUserId);
            userInfo =
                files.length > 0
                    ? {
                          userId: files[0].userId,
                          userName: files[0].userName,
                          userEmail: files[0].userEmail,
                      }
                    : null;
        } else {
            files = await File.findByUserEmail(selectedUserEmail);
            userInfo =
                files.length > 0
                    ? {
                          userId: files[0].userId,
                          userName: files[0].userName,
                          userEmail: files[0].userEmail,
                      }
                    : null;
        }

        // Get user statistics
        const stats = userInfo
            ? await File.getUserFileStats(userInfo.userId)
            : [];

        res.status(200).json({
            success: true,
            message: `Found ${files.length} files for selected user`,
            userInfo: userInfo,
            stats: stats.length > 0 ? stats[0] : null,
            count: files.length,
            files: files.map((file) => ({
                id: file._id,
                fileName: file.fileName,
                originalName: file.originalName,
                fileSize: file.fileSize,
                uploadDate: file.uploadDate,
                status: file.status,
                fileExists: verifyFileExists(file.filePath),
            })),
        });
    } catch (error) {
        console.error("Error fetching files by user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching files by user",
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

        // Validate input
        if (!userId && !userEmail) {
            return res.status(400).json({
                success: false,
                message: "Either userId or userEmail is required",
            });
        }

        // Get files to be deleted (for cleanup)
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

        // Soft delete files in database
        let result;
        if (userId) {
            result = await File.deleteAllByUserId(userId);
        } else {
            result = await File.deleteAllByUserEmail(userEmail);
        }

        // Delete actual files from filesystem
        let deletedFromFS = 0;
        const deletePromises = filesToDelete.map((file) => {
            return new Promise((resolve) => {
                if (verifyFileExists(file.filePath)) {
                    fs.unlink(file.filePath, (err) => {
                        if (err) {
                            console.error(
                                `Error deleting file ${file.fileName}:`,
                                err
                            );
                        } else {
                            deletedFromFS++;
                        }
                        resolve();
                    });
                } else {
                    console.warn(`File already missing: ${file.fileName}`);
                    resolve();
                }
            });
        });

        await Promise.all(deletePromises);

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.modifiedCount} files from database and ${deletedFromFS} files from filesystem`,
            deletedCount: result.modifiedCount,
            deletedFromFileSystem: deletedFromFS,
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

        // Soft delete the file
        file.isActive = false;
        await file.save();

        // Delete actual file from filesystem
        if (verifyFileExists(file.filePath)) {
            fs.unlink(file.filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${file.fileName}:`, err);
                }
            });
        }

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
    getFilesByUser,
    deleteAllFiles,
    deleteFile,
    getFileStats,
    downloadFile,
};