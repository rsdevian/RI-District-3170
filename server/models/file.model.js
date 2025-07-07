import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true,
            trim: true,
        },
        originalName: {
            type: String,
            required: true,
            trim: true,
        },
        filePath: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            required: true,
        },
        mimeType: {
            type: String,
            required: true,
            enum: ["application/pdf"], // Only PDF files allowed
            default: "application/pdf",
        },

        // User information
        userId: {
            type: String,
            required: true,
            trim: true,
        },
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        userEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        // Timestamps
        uploadDate: {
            type: Date,
            default: Date.now,
        },

        // Additional metadata
        fileHash: {
            type: String, // For duplicate detection
            sparse: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },

        // File processing status
        status: {
            type: String,
            enum: ["uploading", "completed", "failed"],
            default: "uploading",
        },

        // Error information (if any)
        errorMessage: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
        versionKey: false,
    }
);

const File = mongoose.model("File", fileSchema);

export default File;
