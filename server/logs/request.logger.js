//import modules
import { config } from "dotenv";

//config env variables
config();

const environment = process.env.NODE_ENV; //environment info from env variables

// Function to log details of an incoming HTTP request
function requestLog(req) {
    // Log the request details to the console
    if (environment === "development") {
        console.log(
            `\nRequest: Origin - ${req.headers.origin}, Method - ${req.method}, Host - ${req.headers.host}, URL - ${req.url}`
        );
    } else if (environment === "production") {
        // console.log(
        //     `\nRequest: Origin - ${req.headers.origin}, Method - ${req.method}, Host - ${req.headers.host}, URL - ${req.url}`
        // );
    } else {
        console.log("Invalid / Unknown environment");
    }
}

// export the log function
export { requestLog };
