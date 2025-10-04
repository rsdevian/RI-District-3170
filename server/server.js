//import modules
import express from "express";
import cors from "cors";

//import routers
import fileRouter from "./routes/file.router.js";
import userRouter from "./routes/user.router.js";
import adminRouter from "./routes/admin.router.js";
import contactRouter from "./routes/contact.router.js";
import zoneRouter from "./routes/zones.router.js";
import clubRouter from "./routes/club.router.js";
import healthRouter from "./routes/health.router.js";

//import configs
import { connectDB } from "./config/database.config.js";
import { configFn } from "./config/env.config.js";

configFn(); //configure env variables

//app configuration
const app = express();
const port = process.env.PORT; //port info from env variables
const allowedOrigin = process.env.CORS_ORIGIN_ALLOWED; //cors origin from env variables
const allowedOriginPreview = process.env.CORS_ORIGIN_ALLOWED_PREVIEW; //cors origin from env variables

//cors
app.use(
    cors({
        origin: [allowedOrigin, allowedOriginPreview], //set cors origin restriction
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect to db
connectDB().then(() => {
    //listener
    app.listen(port, () => {
        console.log(`\nServer is ready to use!`);
    });
});

//routers
app.use("/api/file", fileRouter); //file router
app.use("/api/user", userRouter); //user router
app.use("/api/admin", adminRouter); //admin router
app.use("/api/contact", contactRouter); //admin router
app.use("/api/zones", zoneRouter); //admin router
app.use("/api/clubs", clubRouter); //admin router
app.use("/api/health", healthRouter); //health router
