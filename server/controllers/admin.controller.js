import mongoose from "mongoose";

import { requestLog } from "../logs/request.logger.js";

import { userModel } from "../models/user.model.js";

import { initGridFS } from "../middleware/file.middleware.js";

import File from "../models/file.model.js";

let bucket = null;

mongoose.connection.on("connected", () => {
    initGridFS();
});
mongoose.connection.on("reconnected", () => {
    initGridFS();
});

async function getAllUsers(req, res) {
    //function to get all users
    try {
        requestLog(req);
        const users = await userModel.find();
        if (users.length === 0) {
            return res.status(404).json({ message: "No Users Found" });
        }
        return res.status(200).json({
            message: "All Users Retrieved Successfully",
            users,
        });
    } catch (error) {
        console.log("Error Getting All Users: ", error);
        return res.status(500).json({ message: "Error Getting All Users" });
    }
}

async function getUserDetails(req, res) {
    //function to a specific users
    try {
        requestLog(req);
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User Details Retrieved Successfully",
            user,
        });
    } catch (error) {
        console.log("Error Getting User Details: ", error);
        return res.status(500).json({ message: "Error Getting User Details" });
    }
}

const getAllFilesByAllUser = async (req, res) => {
    try {
        const files = await File.find();

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
        return res.status(200).json({
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

const deleteAllFilesByAllUser = async (req, res) => {
    try {
        const files = await File.find();
        if (!files) {
            return res.status(404).json({
                success: false,
                message: "No files found",
            });
        }
        if (!bucket) {
            bucket = initGridFS();
            if (!bucket) {
                return res.status(500).json({
                    success: false,
                    message: "Internal server error while initializing GridFS",
                });
            }
        }

        let deletedFromGridFS = 0;
        files.map(async (file) => {
            if (!file.isActive) {
                console.log(`File is not active: ${file.fileName}`);
                return;
            }
            try {
                if (file.gridfsFileId) {
                    file.isActive = false;
                    await file.save();
                    await bucket.delete(file.gridfsFileId);
                    deletedFromGridFS++;
                }
            } catch (error) {
                console.error(`Error deleting file:  \n\n${file}`, error);
            }
        });
        return res.status(200).json({
            success: true,
            message: `Deleted ${deletedFromGridFS} files from GridFS`,
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

async function deleteUserByEmail(req, res) {
    try {
        requestLog(req);
        const { email } = req.params;
        console.log(req.params);
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        await user.deleteOne();
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting User:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting files",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
}

async function getUserDetailsByEmail(req, res) {
    try {
        requestLog(req);
        const { email } = req.params;
        console.log(req.params);
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User found successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error getting User:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while getting user",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
}

export {
    getAllUsers,
    getUserDetails,
    getAllFilesByAllUser,
    deleteAllFilesByAllUser,
    deleteUserByEmail,
    getUserDetailsByEmail,
};
