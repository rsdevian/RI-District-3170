//import modules
import { model, Schema } from "mongoose";

//import middleware
import { validateEmail } from "../middleware/validation.middleware.js";

//create schema
const userSchema = new Schema({
    // Basic user information
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: (email) => validateEmail(email),
            message: "Please enter a valid email address",
        },
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: true, // Don't include password in queries by default
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim: true,
        minlength: [10, "Phone number must be at least 10 characters long"],
        maxlength: [10, "Phone number cannot exceed 10 characters"],
    },
    zone: {
        type: String,
        required: [true, "Zone is required"],
        trim: true,
    },
    position: {
        type: String,
    },
    club: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

//assign the model with a schema
const userModel = model("User", userSchema);

//export the model
export { userModel };
