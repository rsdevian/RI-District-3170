import { requestLog } from "../logs/request.logger.js";

async function getHealth(req, res) {
    try {
        requestLog(req);
        return res.status(200).json({
            message: "Server is running",
            success: true,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || "env variable not available",
        });
    } catch (error) {
        console.log("Error Getting health: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export { getHealth };
