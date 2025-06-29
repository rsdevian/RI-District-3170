//import modules
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";

//import constants
import { URL } from "../../constants/url";

//import styles
import "./Signup.css";

//export function
function Signup() {
    //states
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formCompleted, setFormCompleted] = useState(false);
    const [details, setDetails] = useState({
        email: "",
        password: "",
        name: "",
    });

    //navigator
    const navigate = useNavigate();

    //useEffects
    useEffect(() => {
        // If message is null login button will the disabled. If not (login button will be enabled)
        if (
            details.email === "" ||
            details.password === "" ||
            details.name === ""
        ) {
            setFormCompleted(false);
        } else {
            setFormCompleted(true);
        }
    }, [details]);

    //functions
    async function handleSignup() {
        //function to handle signup process
        try {
            //add loading status to disable queued request
            setLoading(true);

            const { email, password, name } = details;

            //return if any field is empty
            if (email === "" || password === "" || name === "") {
                setMessage("Please fill in all fields");
                return;
            }

            //Signup API function
            const response = await fetch(`${URL}/api/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, name }),
            });
            const data = await response.json();

            //setting the response message
            setMessage(data.message);

            //navigating to login page
            navigate("/login");
        } catch (error) {
            //logging the signup error
            console.log("Error Signup: ", error);

            //setting the error message in client side rendering|
            setMessage(error.message);
        } finally {
            //removing loading status after invalid / successful response message
            setLoading(false);
        }
    }

    return (
        <>
            <div className='signup-form'>
                <input
                    placeholder='Email'
                    type='text'
                    value={details.email}
                    onChange={(e) => {
                        setDetails((prev) => {
                            return { ...prev, email: e.target.value };
                        });
                    }} //setting the details state with modified email
                />

                <input
                    placeholder='Password'
                    type='password' //hides the entered value
                    value={details.password}
                    onChange={(e) => {
                        setDetails((prev) => {
                            return { ...prev, password: e.target.value };
                        });
                    }} //setting the details state with modified password
                />

                <input
                    placeholder='Name'
                    type='text'
                    value={details.name}
                    onChange={(e) => {
                        setDetails((prev) => {
                            return { ...prev, name: e.target.value };
                        });
                    }} //setting the details state with modified name
                />

                {/* Sign up API call and loading status of API call */}
                <button
                    onClick={handleSignup}
                    disabled={!formCompleted || loading} //will be disabled if the form in incomplete or under API call
                >
                    {!formCompleted ? (
                        "Fill in all field to signup"
                    ) : loading ? (
                        <CircularProgress />
                    ) : (
                        "Signup"
                    )}
                </button>

                {/* Navigation to the login page */}
                <Link to='/login'>
                    <button>Login Page</button>
                </Link>
            </div>

            {/*Renders the success or error message */}
            {message && <p>{message}</p>}
        </>
    );
}

export default Signup;
