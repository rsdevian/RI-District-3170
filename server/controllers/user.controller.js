//import middleware
import { requestLog } from "../logs/request.logger.js";

//login controller
const userLogin = async (req, res) => {
    try {
        requestLog(req);
    } catch (error) {
        res.status(500).json({ message: "Error Logging In" });
        console.log("Error Logging In: ", error);
    }
};

export { userLogin };
