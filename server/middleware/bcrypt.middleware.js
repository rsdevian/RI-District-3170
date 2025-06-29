//import middlewares
import { genSalt, hash, compare } from "bcryptjs";

//function for hashing and password storing
async function hashPassword(password, saltRounds) {
    //hash password
    try {
        const hashedPassword = await hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        //return the error message
        console.log("Error Hashing Password: ", error);
    }
}

async function hashPasswordWithSalt(password, saltRounds) {
    //hash password with salt
    try {
        //hash with salt generation
        const salt = await genSalt(saltRounds);
        const hashedPasswordwWithSalt = await hash(password, salt);
        return hashedPasswordwWithSalt;
    } catch (error) {
        //return the error message
        console.log("Error Hashing Password with Salt: ", error);
    }
}

async function comparePassword(password, hashedPassword) {
    //compare password with hashed password
    try {
        //compare the manual password from client and hashed-stored password in db
        const isMatch = await compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        //return the error message
        console.log("Error Comparing Password: ", error);
    }
}

//export the middlewares
export { hashPasswordWithSalt, hashPassword, comparePassword };
