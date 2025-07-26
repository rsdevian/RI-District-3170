//import logger
import { requestLog } from "../logs/request.logger.js";

//import middleware
import { validateEmail } from "../middleware/validation.middleware.js";
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
        if ((!email, !password)) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        //check if the user entry is available using user model
        const exisitingUser = await userModel.findOne({ email });

        //if there is no entry return error unavailability message
        if (!exisitingUser) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        //fetch the password stored in database
        const dbPassword = exisitingUser.password;

        //check if the password is correct using bcrypt middleware
        const isCorrectPassword = await comparePassword(password, dbPassword);

        //if the password is not correct return error message
        if (!isCorrectPassword) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
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

async function userSignup(req, res) {
    //function to handle the login API
    try {
        //log the request information
        requestLog(req);

        const { email, password, name } = req.body;

        //check the availability of email, password and name
        if ((!email, !password, !name)) {
            return res
                .status(400)
                .json({ message: "Email, password and name are required" });
        }

        //check if the email is valid using validation middleware
        const isValidEmail = validateEmail(email);

        //if the email is not valid return error message
        if (!isValidEmail) {
            return res.status(400).json({ message: "Invalid Email" });
        }

        //check if there is another user with same email
        const exisitingUser = await userModel.findOne({
            email: email.toLowerCase(),
        });

        //if there is a user with same email return error message
        if (exisitingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hash the password with salt using bcrypt middleware
        const newPassword = await hashPasswordWithSalt(password, 10);

        if (!newPassword) {
            return res.status(500).json({ message: "Error hashing password" });
        }

        //create new user
        const newUser = await userModel.create({
            email: email.toLowerCase(),
            name: name.trim(),
            password: newPassword,
        });

        //if there is an error in creating user return error message
        if (!newUser) {
            return res.status(500).json({ message: "Error Creating User" });
        }

        //return the success message of user creation
        return res
            .status(200)
            .json({ message: "New user created successfully" });
    } catch (error) {
        //if there is an error in signing up return error message
        console.log("Error Signing Up: ", error);
        return res.status(500).json({ message: "Error Signing Up" });
    }
}

//export controllers
export { userLogin, userSignup };
