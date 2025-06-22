import express from "express";
import mongoose from "mongoose";
import { config } from "dotenv";
import cors from "cors";

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (_, res) => {
    res.status(200).json({ message: "Task Manager API is running!" });
});

app.get("/api/hello", (_, res) => {
    res.status(200).json({ message: "Fetched using GET: /api/hello" });
    return;
});

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`);
});
