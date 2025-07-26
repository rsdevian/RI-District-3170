//import modules
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { CircularProgress } from "@mui/material";

//import constants
import { URL } from "../../constants/url";

//import styles
import "../../styles/Signup.css";

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
        const isFormComplete =
            details.email.trim() &&
            details.password.trim() &&
            details.name.trim();
        setFormCompleted(isFormComplete);
    }, [details]);

    //functions
    const handleSignup = useCallback(async () => {
        // Handle form submission

        try {
            //add loading status to disable queued request
            setLoading(true);
            setMessage("");

            const { email, password, name } = details;

            // Validate fields
            if (!email.trim() || !password.trim() || !name.trim()) {
                setMessage("Please fill in all fields");
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setMessage("Please enter a valid email address");
                return;
            }

            // Password validation
            if (password.length < 6) {
                setMessage("Password must be at least 6 characters long");
                return;
            }

            const response = await fetch(`${URL}/api/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                    name: name.trim(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                //setting the response message
                setMessage(data.message || "Account created successfully!");
                // Small delay before navigation for better UX and navigating to login page
                setTimeout(() => navigate("/login"), 1500);
            } else {
                setMessage(data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            //logging the signup error
            console.error("Signup error:", error);

            //setting the error message in client side rendering|
            setMessage(
                "Network error. Please check your connection and try again."
            );
        } finally {
            //removing loading status after invalid / successful response message
            setLoading(false);
        }
    }, [details, navigate]);

    // Handle Enter key press
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && formCompleted && !loading) {
                e.preventDefault();
                handleSignup();
            }
        },
        [formCompleted, loading, handleSignup]
    );

    // Handle input changes
    const handleInputChange = useCallback(
        (field) => (e) => {
            setDetails((prev) => ({
                ...prev,
                [field]: e.target.value,
            }));
            // Clear message on input change
            if (message) setMessage("");
        },
        [message]
    );

    return (
        <div className='signup-form'>
            <div>
                <h1>SIGNUP FORM</h1>
            </div>

            <input
                placeholder='Email'
                type='email'
                value={details.email}
                onChange={handleInputChange("email")}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete='email'
            />

            <input
                placeholder='Password'
                type='password'
                value={details.password}
                onChange={handleInputChange("password")}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete='new-password'
                minLength='6'
            />

            <input
                placeholder='Full Name'
                type='text'
                value={details.name}
                onChange={handleInputChange("name")}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete='name'
            />

            {/* Sign up API call and loading status of API call */}
            <button
                onClick={handleSignup}
                disabled={!formCompleted || loading} //will be disabled if the form in incomplete or under API call
                className={loading ? "loading" : ""}
            >
                {loading ? (
                    <>
                        <CircularProgress size={20} />
                        <span style={{ marginLeft: "8px" }}>
                            Creating Account...
                        </span>
                    </>
                ) : !formCompleted ? (
                    "Fill in all fields to Signup"
                ) : (
                    "Create Account"
                )}
            </button>

            {/* Navigation to the login page */}
            <Link to='/login'>
                <button type='button' disabled={loading}>
                    Already have an account? Login
                </button>
            </Link>

            {/*Renders the success or error message */}
            {message && (
                <p
                    className={`message ${
                        message.includes("success") ? "success" : "error"
                    }`}
                >
                    <b>{message}</b>
                </p>
            )}
        </div>
    );
}

export default Signup;
