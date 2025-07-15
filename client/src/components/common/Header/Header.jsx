import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Person2Icon from "@mui/icons-material/Person2";
import "./Header.css";

function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    return (
        <header className='header-align'>
            <div className='header-container'>
                {/* Logo Section */}
                <div className='logo'>
                    <Link to='/' className='logo-link'>
                        <span className='logo-text'>
                            ROTARY INTERNATIONAL DISTRICT 3170
                        </span>
                    </Link>
                </div>

                <div className='user-nav-actions'>
                    {/* Desktop Navigation */}
                    <nav className='desktop-nav'>
                        <div className='button-align-header'>
                            <Link to='/' className='nav-link'>
                                Home
                            </Link>
                            <Link to='/about' className='nav-link'>
                                About
                            </Link>
                            <Link to='/district' className='nav-link'>
                                District
                            </Link>
                            <Link to='/clubs' className='nav-link'>
                                Clubs
                            </Link>
                            <Link to='/contact' className='nav-link'>
                                Contact
                            </Link>
                            <Link to='/account' className='nav-link'>
                                <span className='profile'>
                                    Profile <Person2Icon />
                                </span>
                            </Link>
                            {/* {loggedIn && (
                                <Link to='/form' className='nav-link'>
                                    Form
                                </Link>
                            )} */}
                        </div>
                    </nav>

                    {/* User Actions */}
                    {/* <div className='user-actions'>
                        {loggedIn ? (
                            <div className='auth-section'>
                                <button
                                    onClick={handleLogout}
                                    className='btn btn-logout'
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className='auth-section'>
                                <Link to='/login' className='btn btn-login'>
                                    Login
                                </Link>
                                <Link to='/signup' className='btn btn-signup'>
                                    Add Secretary
                                </Link>
                            </div>
                        )}
                    </div> */}

                    {/* Mobile Menu Toggle */}
                    {/* <button
                        // className={`mobile-menu-toggle ${
                        //     isMenuOpen ? "active" : ""
                        // }`}
                        // onClick={toggleMenu}
                        aria-label='Toggle mobile menu'
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button> */}
                </div>
            </div>

            {/* Mobile Navigation */}
            <nav className={`mobile-nav ${isMenuOpen ? "active" : ""}`}>
                <Link
                    to='/'
                    className='mobile-nav-link'
                    // onClick={closeMenu}
                >
                    Home
                </Link>
                <Link
                    to='/about'
                    className='mobile-nav-link'
                    // onClick={closeMenu}
                >
                    About
                </Link>
                <Link
                    to='/contact'
                    className='mobile-nav-link'
                    // onClick={closeMenu}
                >
                    Contact
                </Link>
                {/* {loggedIn && (
                    <Link
                        to='/form'
                        className='mobile-nav-link'
                        onClick={closeMenu}
                    >
                        Form
                    </Link>
                )} */}

                {/* <div className='mobile-auth-section'>
                    {loggedIn ? (
                        <>
                            <Link
                                to='/account'
                                className='mobile-nav-link'
                                onClick={closeMenu}
                            >
                                Account
                            </Link>
                            <button
                                onClick={handleLogout}
                                className='mobile-logout-btn'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className='mobile-auth-buttons'>
                            <Link
                                to='/login'
                                className='btn btn-login'
                                onClick={closeMenu}
                            >
                                Login
                            </Link>
                            <Link
                                to='/signup'
                                className='btn btn-signup'
                                onClick={closeMenu}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div> */}
            </nav>

            {/* Mobile Overlay */}
            {isMenuOpen && <div className='mobile-overlay'></div>}
        </header>
    );
}

export default Header;
