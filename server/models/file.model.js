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
        // For GridFS, we store the GridFS file ID instead of file path
        gridfsFileId: {
            type: mongoose.Schema.Types.ObjectId,
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

// Add indexes for better performance
fileSchema.index({ userId: 1, isActive: 1 });
fileSchema.index({ userEmail: 1, isActive: 1 });
fileSchema.index({ fileHash: 1, userId: 1 });
fileSchema.index({ gridfsFileId: 1 });

// Static method to find files by user ID
fileSchema.statics.findByUserId = function (userId) {
    return this.find({
        userId: userId,
        isActive: true,
        status: "completed",
    }).sort({ uploadDate: -1 });
};

// Static method to find files by user email
fileSchema.statics.findByUserEmail = function (userEmail) {
    return this.find({
        userEmail: userEmail.toLowerCase(),
        isActive: true,
        status: "completed",
    }).sort({ uploadDate: -1 });
};

// Static method to delete all files by user ID (soft delete)
fileSchema.statics.deleteAllByUserId = function (userId) {
    return this.updateMany(
        {
            userId: userId,
            isActive: true,
            status: "completed",
        },
        {
            $set: {
                isActive: false,
                updatedAt: new Date(),
            },
        }
    );
};

// Static method to delete all files by user email (soft delete)
fileSchema.statics.deleteAllByUserEmail = function (userEmail) {
    return this.updateMany(
        {
            userEmail: userEmail.toLowerCase(),
            isActive: true,
            status: "completed",
        },
        {
            $set: {
                isActive: false,
                updatedAt: new Date(),
            },
        }
    );
};

// Static method to get user file statistics
fileSchema.statics.getUserFileStats = function (userId) {
    return this.aggregate([
        {
            $match: {
                userId: userId,
                isActive: true,
                status: "completed",
            },
        },
        {
            $group: {
                _id: "$userId",
                totalFiles: { $sum: 1 },
                totalSize: { $sum: "$fileSize" },
                averageSize: { $avg: "$fileSize" },
                latestUpload: { $max: "$uploadDate" },
                oldestUpload: { $min: "$uploadDate" },
            },
        },
        {
            $project: {
                _id: 0,
                userId: "$_id",
                totalFiles: 1,
                totalSize: 1,
                averageSize: { $round: ["$averageSize", 2] },
                latestUpload: 1,
                oldestUpload: 1,
                // Convert bytes to MB for better readability
                totalSizeMB: {
                    $round: [{ $divide: ["$totalSize", 1048576] }, 2],
                },
                averageSizeMB: {
                    $round: [{ $divide: ["$averageSize", 1048576] }, 2],
                },
            },
        },
    ]);
};

// Instance method to get file info
fileSchema.methods.getFileInfo = function () {
    return {
        id: this._id,
        fileName: this.fileName,
        originalName: this.originalName,
        fileSize: this.fileSize,
        fileSizeMB: Math.round((this.fileSize / 1048576) * 100) / 100,
        uploadDate: this.uploadDate,
        status: this.status,
        gridfsFileId: this.gridfsFileId,
        userInfo: {
            userId: this.userId,
            userName: this.userName,
            userEmail: this.userEmail,
        },
    };
};

// Instance method to check if file belongs to user
fileSchema.methods.belongsToUser = function (userId, userEmail = null) {
    if (userEmail) {
        return (
            this.userId === userId || this.userEmail === userEmail.toLowerCase()
        );
    }
    return this.userId === userId;
};

// Pre-save middleware to ensure email is lowercase
fileSchema.pre("save", function (next) {
    if (this.userEmail) {
        this.userEmail = this.userEmail.toLowerCase();
    }
    next();
});

// Virtual for file size in MB
fileSchema.virtual("fileSizeMB").get(function () {
    return Math.round((this.fileSize / 1048576) * 100) / 100;
});

// Virtual for age in days
fileSchema.virtual("ageInDays").get(function () {
    const now = new Date();
    const diffTime = Math.abs(now - this.uploadDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are included in JSON output
fileSchema.set("toJSON", { virtuals: true });
fileSchema.set("toObject", { virtuals: true });

const File = mongoose.model("File", fileSchema);

export default File;
