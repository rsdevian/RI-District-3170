//import modules
import express from "express";
import { config } from "dotenv";
import cors from "cors";

//import routers
import fileRouter from "./routes/file.router.js";
import userRouter from "./routes/user.routes.js";

//import db config
import { connectDB } from "./config/database.config.js";

//config env variables
config();

//app configuration
const app = express();
const PORT = process.env.PORT || 3000;
const allowedCorsOrigin = process.env.CORS_ORIGIN_ALLOW;

//cors
app.use(
    cors({
        origin: [
            // "http://localhost:3001",
            // "http://localhost:5173",
            // "https://docs-hub-green.vercel.app",
            // "https://rotractdistrict3170.vercel.app",
            allowedCorsOrigin,
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to db
connectDB().then(() => {
    //listener
    app.listen(PORT, () => {
        console.log(`\nServer running on port: http://localhost:${PORT}`);
    });
});

//routers
app.use("/api/file", fileRouter); //file router
app.use("/api/user", userRouter); //user router

//health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        message: "Server is running",
        success: true,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});
