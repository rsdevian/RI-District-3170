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

//cors
app.use(
    cors({
        origin: ["http://localhost:3001", "http://localhost:5173"],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().then(() => {
    //listener
    app.listen(PORT, () => {
        console.log(`\nServer running on port: http://localhost:${PORT}`);
    });
});

//routers
app.use("/api/file", fileRouter); //pdf router
app.use("/api/user", userRouter); //user router

//health check
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server is running",
        success: true,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});
