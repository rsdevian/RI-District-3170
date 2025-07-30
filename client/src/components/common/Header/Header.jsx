import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Person2Icon from "@mui/icons-material/Person2";
import "../../../styles/Header.css";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";

function Header() {
    const currentPage = useLocation();
    const [loggedIn, setLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [logOutConfirmBox, setLogOutConfirmBox] = useState(false);
    const navigate = useNavigate();

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

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("name");
        setLoggedIn(false);
        window.dispatchEvent(new Event("authStatusChange"));
        navigate("/login");
    };

    return (
        <>
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
                                <Link
                                    to='/'
                                    className={`${
                                        currentPage.pathname !== "/" &&
                                        "nav-link"
                                    } ${
                                        currentPage.pathname === "/"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    Home
                                </Link>
                                <Link
                                    to='/about'
                                    className={`${
                                        currentPage.pathname !== "/about" &&
                                        "nav-link"
                                    } ${
                                        currentPage.pathname === "/about"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    About
                                </Link>
                                <Link
                                    to='/district'
                                    className={`${
                                        currentPage.pathname !== "/district" &&
                                        "nav-link"
                                    }  ${
                                        currentPage.pathname === "/district"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    District
                                </Link>
                                <Link
                                    to='/clubs'
                                    className={`${
                                        currentPage.pathname !== "/clubs" &&
                                        "nav-link"
                                    } ${
                                        currentPage.pathname === "/clubs"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    Clubs
                                </Link>
                                <Link
                                    to='/contact'
                                    className={`${
                                        currentPage.pathname !== "/contact" &&
                                        "nav-link"
                                    } ${
                                        currentPage.pathname === "/contact"
                                            ? "active"
                                            : ""
                                    }`}
                                >
                                    Contact
                                </Link>
                                {!loggedIn && (
                                    <Link
                                        to='/login'
                                        className={`${
                                            currentPage.pathname !== "/login" &&
                                            "nav-link"
                                        } ${
                                            currentPage.pathname === "/login"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        Secretarial Login
                                    </Link>
                                )}
                                {loggedIn && (
                                    <Link
                                        to='/form'
                                        className={`${
                                            currentPage.pathname !== "/form" &&
                                            "nav-link"
                                        } ${
                                            currentPage.pathname === "/form"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        Secretarial Report
                                    </Link>
                                )}
                                {loggedIn && (
                                    <Link
                                        to='/account'
                                        className={`${
                                            currentPage.pathname !==
                                                "/account" && "nav-link"
                                        } ${
                                            currentPage.pathname === "/account"
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        Account
                                    </Link>
                                )}
                                {/* <Link to='/account' className='nav-link'> */}
                                {/* {!loggedIn &&
                                    currentPage.pathname !== "/login" && (
                                        <Link to='/login'>
                                            <button className='profile btn-login-header'>
                                                Secretarial Login{" "}
                                                <Person2Icon />
                                            </button>
                                        </Link>
                                    )} */}

                                {loggedIn && (
                                    <button
                                        className='btn-logout'
                                        // onClick={handleLogout}
                                        onClick={() => {
                                            setLogOutConfirmBox(true);
                                        }}
                                    >
                                        Log Out
                                    </button>
                                )}

                                {/* </Link> */}
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

                    <div className='mobile-auth-section'>
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
                    </div>
                </nav>

                {/* Mobile Overlay */}
                {isMenuOpen && <div className='mobile-overlay'></div>}
            </header>
            {logOutConfirmBox && (
                <Dialog
                    open={logOutConfirmBox}
                    className='logout-dialog'
                    maxWidth={false}
                    onClose={() => setLogOutConfirmBox(false)}
                >
                    <DialogTitle>Log Out😢?</DialogTitle>
                    <DialogContent className='layout-dialog-content'>
                        <div>
                            <p>
                                <b>Are you sure you want to logout?</b>
                            </p>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button
                            className='logout-confirm-btn'
                            onClick={() => {
                                setLogOutConfirmBox(false);
                                handleLogout();
                            }}
                        >
                            Log Out 🥺
                        </button>
                        <button
                            className='logout-cancel-btn'
                            onClick={() => setLogOutConfirmBox(false)}
                        >
                            Cancel
                        </button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}

export default Header;
