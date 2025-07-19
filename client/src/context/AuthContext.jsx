import { createContext, useState, useEffect, useContext } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the app
function AuthProvider({ children }) {
    // State management for authentication
    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize auth state and set up event listeners
    useEffect(() => {
        // Initial load of user data from localStorage
        fetchUserFromStorage();

        // Event listener for localStorage changes (cross-tab sync)
        function handleStorageChange(e) {
            if (e.key === "token" || e.key === "name" || e.key === "email") {
                fetchUserFromStorage();
            }
        }

        // Event listener for custom auth status changes
        function handleAuthChange() {
            fetchUserFromStorage();
        }

        // Add event listeners
        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("authStatusChange", handleAuthChange);

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("authStatusChange", handleAuthChange);
        };
    }, []); // Empty dependency array - only run once on mount

    // Function to fetch user data from localStorage
    function fetchUserFromStorage() {
        try {
            const token = localStorage.getItem("token");
            const name = localStorage.getItem("name");
            const email = localStorage.getItem("email");
            const userId = localStorage.getItem("userId");

            // Check if all required user data exists
            if (token && name && email) {
                setUser({ token, name, email, userId });
                setLoggedIn(true);
            } else {
                // Clear any partial data
                setUser(null);
                setLoggedIn(false);
            }
        } catch (error) {
            console.error("Error getting user from storage:", error);
            setUser(null);
            setLoggedIn(false);
        } finally {
            // Always set loading to false after attempting to fetch
            setLoading(false);
        }
    }

    // Function to handle user login
    function login(userData) {
        try {
            // Store user data in localStorage
            localStorage.setItem("token", userData.token);
            localStorage.setItem("name", userData.name);
            localStorage.setItem("email", userData.email);
            localStorage.setItem("userId", userData._id);

            // Update state
            setUser(userData);
            setLoggedIn(true);

            // Dispatch custom event for other components
            window.dispatchEvent(new Event("authStatusChange"));
        } catch (error) {
            console.error("Error during login:", error);
        }
    }

    // Function to handle user logout
    function logout() {
        try {
            // Remove user data from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem("email");

            // Clear state
            setUser(null);
            setLoggedIn(false);

            // Dispatch custom event for other components
            window.dispatchEvent(new Event("authStatusChange"));
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }

    // Function to update user data
    function updateUser(userData) {
        if (user) {
            try {
                // Merge existing user data with new data
                const updatedUser = { ...user, ...userData };

                // Update localStorage with new data
                localStorage.setItem("name", updatedUser.name);
                localStorage.setItem("email", updatedUser.email);

                // Update state
                setUser(updatedUser);

                // Dispatch custom event for other components
                window.dispatchEvent(new Event("authStatusChange"));
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
    }

    // Context value object
    const contextValue = {
        user,
        loggedIn,
        loading,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use the AuthContext
function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
