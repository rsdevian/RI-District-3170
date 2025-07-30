import { model, Schema } from "mongoose";

const contactSchema = new Schema({
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
        trim: true,
        minlength: [5, "Email must be at least 5 characters long"],
    },

    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        minlength: [10, "Message must be at least 10 characters long"],
        maxlength: [50, "Message cannot exceed 50 characters"],
    },

    subject: {
        type: String,
        required: [true, "Subject is required"],
        trim: true,
        minlength: [2, "Subject must be at least 2 characters long"],
        maxlength: [50, "Subject cannot exceed 50 characters"],
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const contactModel = model("Contact", contactSchema);

export default contactModel;
