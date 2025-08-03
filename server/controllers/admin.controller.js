//import modules
import mongoose from "mongoose";

//import middlewares
import { initGridFS } from "../middleware/file.middleware.js";
import { validateEmail } from "../middleware/validation.middleware.js";
import {
    hashPasswordWithSalt,
    comparePassword,
} from "../middleware/bcrypt.middleware.js";

//import loggers
import { requestLog } from "../logs/request.logger.js";

//import models
import { userModel } from "../models/user.model.js";
import File from "../models/file.model.js";

import nodemailer from "nodemailer";

let bucket = null;

//initiate connection with database for gridFS
mongoose.connection.on("connected", () => {
    initGridFS();
});
mongoose.connection.on("reconnected", () => {
    initGridFS();
});

async function adminStatusCheck(req, res) {
    //function to check if user is admin
    try {
        requestLog(req);
        const { userId } = req.params;

        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        if (user.isAdmin === true) {
            return res.status(200).json({ success: true, isAdmin: true });
        } else {
            return res.status(403).json({
                message: "You are not authorized to access this resource",
            });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error", error });
    }
}

async function getAllUsers(req, res) {
    //function to get all users
    try {
        requestLog(req);
        const users = await userModel.find();
        if (users.length === 0) {
            return res
                .status(404)
                .json({ success: false, message: "No Users Found" });
        }
        return res.status(200).json({
            success: true,
            message: "All Users Retrieved Successfully",
            users,
        });
    } catch (error) {
        console.log("Error Getting All Users: ", error);
        return res.status(500).json({
            success: false,
            message: "Error Getting All Users",
            error,
        });
    }
}

async function getUserDetailsByUserId(req, res) {
    //function to a specific users
    try {
        requestLog(req);
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        return res.status(200).json({
            success: true,
            message: "User Details Retrieved Successfully",
            user,
        });
    } catch (error) {
        console.log("Error Getting User Details: ", error);
        return res.status(500).json({
            success: false,
            message: "Error Getting User Details",
            error,
        });
    }
}

async function getUserDetailsByUserEmail(req, res) {
    try {
        requestLog(req);
        const { email } = req.params;
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
            error,
        });
    }
}

async function addUser(req, res) {
    //function to handle the login API
    try {
        //log the request information
        requestLog(req);

        const { email, name, password, phone, zone, position, club, isAdmin } =
            req.body;
        //check the availability of email, password and name
        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ message: "Email, password and name are required" });
        }

        //check if the email is valid using validation middleware
        const isValidEmail = validateEmail(email);

        //if the email is not valid return error message
        if (!isValidEmail) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        //check if there is another user with same email
        const exisitingUser = await userModel.findOne({
            email: email.toLowerCase(),
        });

        //if there is a user with same email return error message
        if (exisitingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const existingMobileNumber = await userModel.findOne({ phone: phone });

        if (existingMobileNumber) {
            return res.status(400).json({
                success: false,
                message:
                    "Mobile Number is already connected with another user account",
            });
        }

        //hash the password with salt using bcrypt middleware
        const newPassword = await hashPasswordWithSalt(password, 10);

        if (!newPassword) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        //create new user
        const newUser = await userModel.create({
            email: email.toLowerCase(),
            name: name.trim(),
            password: newPassword,
            phone,
            zone,
            position,
            club,
            isAdmin,
        });

        //if there is an error in creating user return error message
        if (!newUser) {
            return res.status(500).json({ message: "Error Creating User" });
        }

        //return the success message of user creation
        return res
            .status(200)
            .json({ message: "New user created successfully" });
    } catch (error) {
        //if there is an error in signing up return error message
        console.log("Error Creating User: ", error);
        return res.status(500).json({ message: "Error Creating User", error });
    }
}

async function sendMail(req, res) {
    try {
        const { reciever } = req.params;
        const { name, email, password } = req.body;
        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: reciever,
            subject: `Hello ${name}`,
            text: `Your Email is ${email} and your password is ${password}`,
        };
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            service: "gmail",
            auth: {
                user: process.env.MAIL_SENDER,
                pass: process.env.MAIL_APP_PASSWORD, //ydtrnaxipynzvsbg
            },
        });
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error Sending Mail: ", error);
                return res.status(500).json({ message: "Error Sending Mail" });
            } else {
                return res
                    .status(200)
                    .json({ message: "Email sent successfully" });
            }
        });
    } catch (error) {
        console.log("Error Sending Mail: ", error);
        return res.status(500).json({ message: "Error Sending Mail" });
    }
}

async function updateUserPassword(req, res) {
    try {
        const { adminId, userId } = req.params;
        const { adminPassword, newPassword } = req.body;

        const admin = await userModel.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin Not Found",
            });
        }

        if (admin.isAdmin !== true) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to perform this action",
            });
        }

        const isPasswordValid = await comparePassword(
            adminPassword,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Admin Password",
                working: "Yes function",
                admin,
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }

        const dbPassword = user.password;

        const isSamePassword = await comparePassword(newPassword, dbPassword);

        if (isSamePassword) {
            return res
                .status(400)
                .json({ message: "Updating password cannot be same password" });
        }

        const newHashedPassword = await hashPasswordWithSalt(newPassword, 10);

        user.password = newHashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Error updating password: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error,
        });
    }
}

async function editAllUserDetailsByUserId(req, res) {
    try {
        requestLog(req);
        const { userId } = req.params;

        const { editUser } = req.body;
        console.log(editUser);
        let user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update user details
        Object.assign(user, editUser);

        await user.save();

        return res
            .status(200)
            .json({ message: "User details updated successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

async function deleteAllUsers(req, res) {
    try {
        requestLog(req);
        const users = await userModel.find({ isAdmin: false });
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No Users found to delete",
            });
        }
        const deletedUsers = await userModel.deleteMany({ isAdmin: false });
        if (deletedUsers.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No Users deleted",
            });
        }
        return res.status(200).json({
            success: true,
            message: "All Users deleted successfully",
            data: deletedUsers,
        });
    } catch (error) {
        console.error("Error deleting Users:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting users",
            error,
        });
    }
}

async function deleteUserByUserId(req, res) {
    try {
        requestLog(req);
        const { userId } = req.params;
        const user = await userModel.findById(userId);
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
            data: {
                deletedUser: user,
            },
        });
    } catch (error) {
        console.error("Error deleting User:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting files",
            error,
        });
    }
}

async function deleteUserByUserEmail(req, res) {
    try {
        requestLog(req);
        const { email } = req.params;
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
            data: {
                deletedUser: user,
            },
        });
    } catch (error) {
        console.error("Error deleting User:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error while deleting files",
            error,
        });
    }
}

async function getZone(userId) {
    try {
        const user = await userModel.findById(userId);
        if (!user) return null;
        return user.zone || null;
    } catch (error) {
        console.error("Error fetching user zone:", error);
        return null;
    }
}

async function getAllFilesByAllUser(req, res) {
    try {
        requestLog(req);
        const files = await File.find();

        if (files.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No files found in database",
                files: [],
            });
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

        // Resolve async userZone fields
        const filesWithUserZone = await Promise.all(
            validFiles.reverse().map(async (file) => ({
                id: file._id,
                fileName: file.fileName,
                originalName: file.originalName,
                fileSize: file.fileSize,
                uploadDate: file.uploadDate,
                status: file.status,
                fileExists: true,
                isActive: file.isActive,
                userEmail: file.userEmail,
                userName: file.userName,
                userId: file.userId,
                userZone: await getZone(file.userId),
                uploadDetails: file._doc,
            }))
        );

        const missingFilesData = missingFiles.map((file) => ({
            id: file._id,
            fileName: file.fileName,
            originalName: file.originalName,
            fileExists: false,
            userEmail: file.userEmail,
            userName: file.userName,
            userId: file.userId,
            isActive: file.isActive,
            uploadDetails: file._doc,
        }));

        return res.status(200).json({
            success: true,
            message: `Found ${filesWithUserZone.length} files (${missingFilesData.length} files missing from GridFS)`,
            count: filesWithUserZone.length,
            missingCount: missingFilesData.length,
            files: filesWithUserZone,
            missingFiles: missingFilesData,
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
}

async function getFilesByUserId(req, res) {
    try {
        requestLog(req);
        const { userId } = req.params;
        const files = await File.find({ userId });

        if (!files) {
            return res.status(404).json({
                success: false,
                message: "No files found for the given user",
            });
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
}

async function getFilesByUserEmail(req, res) {
    try {
        requestLog(req);
        const { email } = req.params;
        const files = await File.find({ userEmail: email });

        if (!files) {
            return res.status(404).json({
                success: false,
                message: "No files found for the given email",
            });
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
}

async function deleteAllFilesByAllUser(req, res) {
    try {
        requestLog(req);
        const files = await File.find();
        if (files.length === 0) {
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
}

async function deleteFilesByUserId(req, res) {
    try {
        requestLog(req);
        const { userId } = req.params;
        const files = await File.find({ userId });
        if (files.length === 0) {
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
        const deletePromises = files.map(async (file) => {
            if (!file.isActive) {
                console.log(`File is not active: ${file.fileName}`);
                return false;
            }

            try {
                if (file.gridfsFileId) {
                    file.isActive = false;
                    await file.save();
                    await bucket.delete(file.gridfsFileId);
                    return true; // Successfully deleted
                }
            } catch (error) {
                console.error(`Error deleting file: ${file.fileName}`, error);
                return false;
            }
            return false;
        });

        const results = await Promise.all(deletePromises);
        deletedFromGridFS = results.filter((result) => result === true).length;

        const deleteFileEntry = await File.deleteMany({
            userId: userId,
            isActive: false,
        });

        if (deleteFileEntry.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No files found for the given email",
            });
        }
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
}

async function deleteFilesByUserEmail(req, res) {
    try {
        requestLog(req);
        const { email } = req.params;
        const files = await File.find({ userEmail: email });
        if (files.length === 0) {
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
        const deletePromises = files.map(async (file) => {
            if (!file.isActive) {
                console.log(`File is not active: ${file.fileName}`);
                return false;
            }

            try {
                if (file.gridfsFileId) {
                    file.isActive = false;
                    await file.save();
                    await bucket.delete(file.gridfsFileId);
                    return true; // Successfully deleted
                }
            } catch (error) {
                console.error(`Error deleting file: ${file.fileName}`, error);
                return false;
            }
            return false;
        });

        const results = await Promise.all(deletePromises);
        deletedFromGridFS = results.filter((result) => result === true).length;

        const deleteFileEntry = await File.deleteMany({
            userEmail: email,
            isActive: false,
        });

        if (deleteFileEntry.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No files found for the given email",
            });
        }
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
}

const downloadFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        // Check if GridFS bucket is initialized
        if (!bucket) {
            bucket = initGridFS();
            if (!bucket) {
                return res.status(500).json({
                    success: false,
                    message: "Database connection not ready",
                });
            }
        }

        // Validate input
        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: "File ID and User ID are required",
            });
        }

        // Find the file in database
        const file = await File.findOne({
            _id: fileId,
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

const deletedByFileId = async (req, res) => {
    try {
        const { fileId } = req.params;

        if (!fileId) {
            return res.status(400).json({
                success: false,
                message: "File ID is required",
            });
        }

        // Initialize GridFS bucket if not ready
        if (!bucket) {
            bucket = initGridFS();
            if (!bucket) {
                return res.status(500).json({
                    success: false,
                    message: "Database connection not ready",
                });
            }
        }

        // Find the file document
        const file = await File.findById(fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found",
            });
        }

        if (!file.isActive) {
            return res.status(400).json({
                success: false,
                message: `File "${file.fileName}" is already inactive`,
            });
        }

        // Delete from GridFS and mark the file inactive
        try {
            if (file.gridfsFileId) {
                await bucket.delete(file.gridfsFileId);
            }
            file.isActive = false;
            await file.save();
        } catch (error) {
            console.error(`Error deleting file: ${file.fileName}`, error);
            return res.status(500).json({
                success: false,
                message: "Error deleting file from storage",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            });
        }

        await File.deleteOne({ _id: fileId });

        return res.status(200).json({
            success: true,
            message: `File "${file.fileName}" has been deleted (marked inactive).`,
            fileId: fileId,
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while deleting file",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

export {
    adminStatusCheck,
    getAllUsers,
    getUserDetailsByUserId,
    getUserDetailsByUserEmail,
    addUser,
    sendMail,
    updateUserPassword,
    editAllUserDetailsByUserId,
    deleteAllUsers,
    deleteUserByUserId,
    deleteUserByUserEmail,
    getAllFilesByAllUser,
    getFilesByUserId,
    getFilesByUserEmail,
    deleteAllFilesByAllUser,
    deleteFilesByUserEmail,
    deleteFilesByUserId,
    downloadFile,
    deletedByFileId,
};
