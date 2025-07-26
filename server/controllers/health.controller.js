//import logger
import { requestLog } from "../logs/request.logger.js";

//get health info of server
async function getHealth(req, res) {
    try {
        requestLog(req); //log the request details
        return res.status(200).json({
            message: "Server is running",
            success: true,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || "env variable not available",
        }); //return the health info
    } catch (error) {
        console.log("Error Getting health: ", error); //console log the error
        return res.status(500).json({ message: "Internal Server Error" }); //send error status to client
    }
}

//export health controller
export { getHealth };
