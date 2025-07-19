// Function to log details of an incoming HTTP request
function requestLog(req) {
    // Log the request details to the console
    console.log(
        `\nRequest: Origin - ${req.headers.origin}, Method - ${req.method}, Host - ${req.headers.host}, URL - ${req.url}`
    );
}

// export the log function
export { requestLog };
