import express from "express";

import { saveContactRequest } from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/message", saveContactRequest);

export default router;
