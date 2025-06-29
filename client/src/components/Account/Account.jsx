//import modules
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//import styles
import "./Account.css";

//export function
function Account() {
    //states
    const [loggedIn, setLoggedIn] = useState(
        localStorage.getItem("token") ? true : false
    );

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

        //update the logged in status
        setLoggedIn(false);
    }

    return (
        <>
            <div className='account'>
                {/*Navigation based on the loggedIn status */}
                {!loggedIn && (
                    <>
                        <Link to='/signup'>
                            <button>Sign Up</button>
                        </Link>
                        <Link to='/login'>
                            <button>Log In</button>
                        </Link>
                    </>
                )}

                {loggedIn && (
                    <div className='accounts-button-align'>
                        <p>
                            Welcome! <b>{localStorage.getItem("name")}</b>{" "}
                            {/*Render the name of Logged in user */}
                        </p>
                        <button onClick={handleLogout}>Log Out</button>
                    </div>
                )}
            </div>
        </>
    );
}

//export the function
export default Account;
