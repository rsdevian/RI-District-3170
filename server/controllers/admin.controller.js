import { requestLog } from "../logs/request.logger.js";

import { userModel } from "../models/user.model.js";

async function getAllUsers(req, res) {
    //function to get all users
    try {
        requestLog(req);
        const users = await userModel.find();
        if (users.length === 0) {
            return res.status(404).json({ message: "No Users Found" });
        }
        return res.status(200).json({
            message: "All Users Retrieved Successfully",
            users,
        });
    } catch (error) {
        console.log("Error Getting All Users: ", error);
        return res.status(500).json({ message: "Error Getting All Users" });
    }
}

async function getUserDetails(req, res) {
    //function to a specific users
    try {
        requestLog(req);
        const { userId } = req.params;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User Details Retrieved Successfully",
            user,
        });
    } catch (error) {
        console.log("Error Getting User Details: ", error);
        return res.status(500).json({ message: "Error Getting User Details" });
    }
}

export { getAllUsers, getUserDetails };
