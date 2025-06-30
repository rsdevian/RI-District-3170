//import modules
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

//import constants
import { URL } from "../../constants/url.js";

//import styles
import "./Login.css";

//export function
function Login() {
    //states
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formCompleted, setFormCompleted] = useState(false);
    const [details, setDetails] = useState({ email: "", password: "" });

    //navigator
    const navigate = useNavigate();

    //useEffects
    useEffect(() => {
        // If user is already logged in, redirect to account page
        if (localStorage.getItem("token")) {
            navigate("/account");
        }
    }, [navigate]);

    useEffect(() => {
        // If message is null login button will the disabled. If not (login button will be enabled)
        if (details.email !== "" && details.password !== "") {
            setFormCompleted(true);
        } else {
            setFormCompleted(false);
        }
    }, [details]);

    //functions
    async function handleLogin() {
        //function to handle login process
        try {
            //add loading status to disable queued request
            setLoading(true);

            const { email, password } = details;

            //return if any field is empty
            if (email === "" || password === "") {
                setMessage("Please fill in all fields");
                return;
            }

            //login API function
            const response = await fetch(`${URL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            //setting the fetched details in the local storage
            if (data?.exisitingUser) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("name", data.exisitingUser.name);
                localStorage.setItem("email", data.exisitingUser.email);
                navigate("/account");
            }

            //setting the response message
            setMessage(data.message);

            //navigating to the account page
        } catch (error) {
            //logging the login error
            console.log("Error Loggin in: ", error);

            //setting the error message in client side rendering|
            setMessage(error.message);
        } finally {
            //removing loading status after invalid / successful response message
            setLoading(false);
        }
    }

    return (
        <>
            <div className='login'>
                <input
                    value={details.email}
                    type='text'
                    placeholder='Email'
                    onChange={(e) => {
                        setDetails((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }));
                    }} //setting the details state with the modified email
                />

                <input
                    value={details.password}
                    type='password'
                    placeholder='Password'
                    onChange={(e) => {
                        setDetails((prev) => ({
                            ...prev,
                            password: e.target.value,
                        }));
                    }} //setting the details state with the modified password
                />

                {/* Login API call and loading status of API call */}
                <button
                    onClick={handleLogin}
                    disabled={!formCompleted || loading} //will be disabled if the form in incomplete or under API call
                >
                    {!formCompleted ? (
                        "Fill in all fields to login"
                    ) : loading ? (
                        <CircularProgress />
                    ) : (
                        "Login"
                    )}
                </button>

                {/* Navigation to the signup page */}
                <Link to='/signup'>
                    <button>Sign up Page</button>
                </Link>
            </div>

            {/*Renders the success or error message */}
            {message && <p>{message}</p>}
        </>
    );
}

export default Login;
