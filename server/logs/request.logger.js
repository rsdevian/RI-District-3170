import { config } from "dotenv";
// Function to log details of an incoming HTTP request

config();

const environment = process.env.NODE_ENV;

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
