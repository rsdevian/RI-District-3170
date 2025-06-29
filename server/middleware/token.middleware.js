//import modules
import jwt from "jsonwebtoken";

//token geneation
function generateToken(userId, email, password) {
    //return the generated token with userId, email, and password
    return jwt.sign({ userId, email, password }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
}

//export the middleware
export { generateToken };
