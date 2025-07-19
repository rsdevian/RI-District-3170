//import modules
import mongoose from "mongoose";
import { config } from "dotenv";

//config env variables
config();

//connection to database
async function connectDB() {
    //function to handle server connection to the database MongoDB
    try {
        //throw an error if there is no MongoDB URI in env variables
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }

        console.log("\nConnecting to Database...");
        //connect to the database
        await mongoose.connect(process.env.MONGODB_URI);
        //log success message
        console.log("Database connected and can be accessed through server");
    } catch (error) {
        //log the error message
        console.error(`Error Connecting to database: ${error.message}`);

        //exit the process
        process.exit(1);
    }
}

//close connection when app is terminated
async function gracefulShutdown(signal) {
    console.log(`\nReceived ${signal}. Closing MongoDB connection...`);

    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
    } catch (error) {
        console.error("Error during graceful shutdown:", error);
        process.exit(1);
    }
}

// Handle different termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Termination signal
process.on("SIGUSR2", () => gracefulShutdown("SIGUSR2")); // Nodemon restart

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    gracefulShutdown("uncaughtException");
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    gracefulShutdown("unhandledRejection");
});

//export the function
export { connectDB };
