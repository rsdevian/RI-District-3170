//import middleware
import { requestLog } from "../logs/request.logger.js";

//login controller
async function userLogin(req, res) {
    try {
        requestLog(req);
    } catch (error) {
        res.status(500).json({ message: "Error Logging In" });
        console.log("Error Logging In: ", error);
    }
}

export { userLogin };
