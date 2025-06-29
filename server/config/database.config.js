//import modules
import mongoose from "mongoose";
import { config } from "dotenv";

//config env variables
config();

//connection to database
async function connectDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }
        console.log("\nConnecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected and can be accessed through server");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

//close connection when app is terminated
process.on("SIGINT", async () => {
    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
    } catch (error) {
        console.error("Error during graceful shutdown:", error);
        process.exit(1);
    }
});

//export the function
export { connectDB };
