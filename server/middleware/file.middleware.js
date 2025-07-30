import crypto from "crypto";
import fs from "fs";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

// Initialize GridFS bucket when connection is ready
const initGridFS = () => {
    if (mongoose.connection.readyState === 1) {
        return new GridFSBucket(mongoose.connection.db, {
            bucketName: "uploads",
        });
    }
    return null;
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

// Helper function to generate file hash from buffer
const generateFileHashFromBuffer = (buffer) => {
    return crypto.createHash("md5").update(buffer).digest("hex");
};

export { initGridFS, generateFileHash, generateFileHashFromBuffer };
