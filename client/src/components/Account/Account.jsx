//import modules
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

//import styles
import "../../styles/Account.css";

import { URL } from "../../constants/url";

//export function
function Account() {
    //states
    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );
    const userId = localStorage.getItem("userId");
    const [resetField, setResetField] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    //useEffects
    useEffect(() => {
        function checkLoginStatus() {
            //check if the user is logged in and update the state
            if (localStorage.getItem("token")) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        }

        checkLoginStatus();

        // Optional: Listen for storage events to sync across tabs
        window.addEventListener("storage", checkLoginStatus);

        return function () {
            window.removeEventListener("storage", checkLoginStatus);
        };
    }, []); // Empty dependency array

    function handleLogout() {
        //handle the logout functionality

        //remove the local storage keys and items
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("userId");
        window.dispatchEvent(new Event("authStatusChange"));

        //update the logged in status
        setLoggedIn(false);
        navigate("/login");
    }

    function handleResetClick() {
        if (resetField) {
            setResetField(false);
            return;
        }
        setResetField(true);
    }

    async function handleResetPassword() {
        if (
            oldPassword === "" ||
            newPassword === "" ||
            confirmPassword === ""
        ) {
            alert("Please fill in all field");
            return;
        }
        if (
            oldPassword.length <= 5 ||
            newPassword.length <= 5 ||
            confirmPassword.length <= 5
        ) {
            alert("All fields should contain at least 6 characters");
            return;
        }
        if (newPassword !== confirmPassword) {
            alert("New password and Confirm new password do not match");
            return;
        }

        try {
            await axios.post(`${URL}/api/user/resetPassword`, {
                userId,
                oldPassword,
                newPassword,
            });
        } catch (error) {
            console.log(error);
            alert("Error resetting password");
        }
    }

    return (
        <>
            <div className='account'>
                {/*Navigation based on the loggedIn status */}
                {!loggedIn && (
                    <>
                        {/* <Link to='/signup'>
                            <button>Add Secretary</button>
                        </Link> */}
                        <Link to='/login'>
                            <button>Log In</button>
                        </Link>
                    </>
                )}

                {loggedIn && (
                    <>
                        {!resetField && (
                            <>
                                <div className='accounts-button-align'>
                                    <p>
                                        Welcome!{" "}
                                        <b>{localStorage.getItem("name")}</b>{" "}
                                        {/*Render the name of Logged in user */}
                                    </p>
                                    <button onClick={handleLogout}>
                                        Log Out
                                    </button>
                                    <button onClick={handleResetClick}>
                                        Reset Password
                                    </button>
                                </div>
                            </>
                        )}
                        {resetField && (
                            <>
                                <div className='accounts-button-align'>
                                    <input
                                        value={oldPassword}
                                        onChange={() => {
                                            setOldPassword(event.target.value);
                                        }}
                                        placeholder='Old Password'
                                        className='reset-password-input'
                                    />
                                    <input
                                        value={newPassword}
                                        onChange={() => {
                                            setNewPassword(event.target.value);
                                        }}
                                        placeholder='New Password'
                                        className='reset-password-input'
                                    />
                                    <input
                                        value={confirmPassword}
                                        onChange={() => {
                                            setConfirmPassword(
                                                event.target.value
                                            );
                                        }}
                                        placeholder='Confirm New Password'
                                        className='reset-password-input'
                                    />
                                    <button
                                        // disabled={
                                        //     oldPassword !== "" ||
                                        //     oldPassword.length <= 5 ||
                                        //     newPassword !== confirmPassword ||
                                        //     newPassword.length <= 5 ||
                                        //     confirmPassword.length <= 5 ||
                                        //     newPassword === "" ||
                                        //     confirmPassword === ""
                                        // }
                                        onClick={handleResetPassword}
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

//export the function
export default Account;
