//import modules
import { useState } from "react";
import { Link } from "react-router-dom";

//import styles
import "./Header.css";
import { useEffect } from "react";

//export function
function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    console.log(localStorage.getItem("token"));
    console.log(!!localStorage.getItem("token"));
    useEffect(() => {
        function checkLoggedInStatus() {
            setLoggedIn(!!localStorage.getItem("token"));
        }

        checkLoggedInStatus();

        function handleStorageChanges(e) {
            if (e.key === "token") {
                checkLoggedInStatus();
            }
        }

        function handleAuthChange() {
            checkLoggedInStatus();
        }

        window.addEventListener("storage", handleStorageChanges);
        window.addEventListener("authStatusChange", handleAuthChange);

        return () => {
            window.removeEventListener("storage", handleStorageChanges);
            window.removeEventListener("authStatusChange", handleAuthChange);
        };
    }, []);

    //return JSX
    return (
        <>
            <div className='header-align'>
                <div className='button-align'>
                    {/*Added Navigation links in Header */}
                    <Link to='/'>Home</Link>
                    {loggedIn && <Link to='/form'>Form</Link>}
                    <Link to='/account'>Account</Link>
                </div>
            </div>
        </>
    );
}

//export the component
export default Header;
