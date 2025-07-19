//import modules
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

//import constants
import { URL } from "../../constants/url.js";

//import styles
import "./Login.css";

//export function
function Login() {
    //states
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [formCompleted, setFormCompleted] = useState(false);
    const [details, setDetails] = useState({
        email: "",
        password: "",
    });

    //navigator
    const navigate = useNavigate();

    //useEffects

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        // If user is already logged in, redirect to account page
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/account");
        }
    }, [navigate]);

    useEffect(() => {
        // Check if form is complete to enable/disable login button
        const isFormComplete = details.email.trim() && details.password.trim();
        setFormCompleted(isFormComplete);
    }, [details]);

    //functions

    // Handle Enter key press for form submission
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Enter" && formCompleted && !loading) {
                e.preventDefault();
                handleLogin();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [formCompleted, loading]
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

    // Main login function
    const handleLogin = useCallback(async () => {
        // Function to handle login process
        try {
            // Add loading status to disable queued requests
            setLoading(true);
            setMessage("");

            const { email, password } = details;

            // Validate fields
            if (!email.trim() || !password.trim()) {
                setMessage("Please fill in all fields");
                return;
            }

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setMessage("Please enter a valid email address");
                return;
            }

            // Login API call
            const response = await fetch(`${URL}/api/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok && data?.exisitingUser) {
                // Store user data in localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("name", data.exisitingUser.name);
                localStorage.setItem("email", data.exisitingUser.email);
                localStorage.setItem("userId", data.exisitingUser._id);

                // Dispatch auth status change event
                window.dispatchEvent(new Event("authStatusChange"));

                // Show success message briefly before navigation
                setMessage("Login successful! Redirecting...");

                // Navigate to home page after successful login
                setTimeout(() => navigate("/"), 1000);
            } else {
                // Set error message from server response
                setMessage(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            // Log the login error
            console.error("Error logging in:", error);

            // Set user-friendly error message
            setMessage(
                "Network error. Please check your connection and try again."
            );
        } finally {
            // Remove loading status after response
            setLoading(false);
        }
    }, [details, navigate]);

    return (
        <div className='login'>
            <div>
                <h1>LOGIN</h1>
            </div>

            {/* Email input field */}
            <input
                value={details.email}
                type='email'
                placeholder='Email'
                onChange={handleInputChange("email")}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete='email'
            />

            {/* Password input field */}
            <input
                value={details.password}
                type='password'
                placeholder='Password'
                onChange={handleInputChange("password")}
                onKeyDown={handleKeyDown}
                disabled={loading}
                autoComplete='current-password'
            />

            {/* Login button with loading state */}
            <button
                onClick={handleLogin}
                disabled={!formCompleted || loading}
                className={loading ? "loading" : ""}
            >
                {loading ? (
                    <>
                        <CircularProgress size={20} />
                        <span style={{ marginLeft: "8px" }}>Logging in...</span>
                    </>
                ) : !formCompleted ? (
                    "Fill in all fields to login"
                ) : (
                    "Login"
                )}
            </button>

            {/* Navigation to the signup page */}
            <Link to='/signup'>
                <button type='button' disabled={loading}>
                    Don't have an account? Sign up
                </button>
            </Link>

            {/* Render success or error message */}
            {message && (
                <p
                    className={`message ${
                        message.includes("successful") ? "success" : "error"
                    }`}
                >
                    <b>{message}</b>
                </p>
            )}
        </div>
    );
}

export default Login;
