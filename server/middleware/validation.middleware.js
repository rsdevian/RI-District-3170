//validation of email format
function validateEmail(email) {
    //deault regex for email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //return validation message
    return emailRegex.test(email);
}

//export the middleware
export { validateEmail };
