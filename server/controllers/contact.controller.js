import { requestLog } from "../logs/request.logger.js";

import contactModel from "../models/contact.model.js";

async function saveContactRequest(req, res) {
    try {
        requestLog(req);
        const { name, email, message, subject } = req.body;

        if (!name || !email || !message || !subject) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const contact = new contactModel({
            name,
            email,
            message,
            subject,
        });
        await contact.save();
        return res.status(200).json({ message: "Contact saved successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { saveContactRequest };
