//import logger
import { requestLog } from "../logs/request.logger.js";

//import middleware
import {
    hashPasswordWithSalt,
    comparePassword,
} from "../middleware/bcrypt.middleware.js";
import { generateToken } from "../middleware/token.middleware.js";

//import models
import { userModel } from "../models/user.model.js";

//login controller
async function userLogin(req, res) {
    //function to handle the login API
    try {
        //log the request information
        requestLog(req);

        const { email, password } = req.body;

        //check the availability of email and password
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        //check if the user entry is available using user model
        const exisitingUser = await userModel.findOne({ email });

        //if there is no entry return error unavailability message
        if (!exisitingUser) {
            return res.status(401).json({ message: "Invalid email" });
        }

        //fetch the password stored in database
        const dbPassword = exisitingUser.password;

        //check if the password is correct using bcrypt middleware
        const isCorrectPassword = await comparePassword(password, dbPassword);

        //if the password is not correct return error message
        if (!isCorrectPassword) {
            return res.status(401).json({ message: "Incorrect Password" });
        }

        //if the password is correct generate token using token middleware
        const token = generateToken(
            exisitingUser._id,
            exisitingUser.email,
            password
        );

        //if there is an error in generating token return error message
        if (!token) {
            return res.status(500).json({ message: "Error generating token" });
        }

        //return the token and user information
        return res.status(200).json({
            token,
            exisitingUser: {
                _id: exisitingUser._id,
                email: exisitingUser.email,
                name: exisitingUser.name,
            },
            message: "Logged in successfully",
        });
    } catch (error) {
        //if there is an error in logging in return error message
        res.status(500).json({ message: "Error Logging In" });
        console.log("Error Logging In: ", error);
    }
}

//password reset controller
async function userResetPassword(req, res) {
    //log the request information
    requestLog(req);
    try {
        const { userId, oldPassword, newPassword } = req.body;

        //check the required fields
        if (!userId || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //check if the user exists
        const user = await userModel.findOne({ _id: userId });

        //if user is not available return error message
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const dbPassword = user.password;

        //check the password match
        const isPasswordMatch = await comparePassword(oldPassword, dbPassword);

        //if the password is not match return error message as unauthorized
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        //check if the new password is same as old password
        const isSamePassword = await comparePassword(newPassword, dbPassword);

        // if the new password is same as the old password return error message
        if (isSamePassword) {
            return res.status(400).json({
                message: "New password cannot be same as old password",
            });
        }

        //hash the new password
        const hashedNewPassword = await hashPasswordWithSalt(newPassword, 10);

        //update the password
        user.password = hashedNewPassword;

        //save the new user information in the database
        await user.save();

        //return the success message
        return res
            .status(200)
            .json({ message: "Password updated successfully" });
    } catch (error) {
        //log the error
        console.error("Error Resetting Password:", error);
        //return the error message
        return res.status(500).json({ message: "Error Resetting Password" });
    }
}

//export controllers
export { userLogin, userResetPassword };
