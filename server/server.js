//import modules
import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";

//import routers
import fileRouter from "./routes/file.router.js";

//env configuration
config();

//app configuration
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: ["http://localhost:3001", "http://localhost:5173"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routers
app.use("/api/file", fileRouter);

//health check
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server is running",
        success: true,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

//listener
app.listen(PORT, () => {
    console.log(`\nServer running on port: http://localhost:${PORT}`);
});
