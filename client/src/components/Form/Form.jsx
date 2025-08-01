//import modules
import { useState, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext.jsx";

//import constants
import { URL } from "../../constants/url.js";

//import styles
import "../../styles/Form.css";

//export function
function Form() {
    // Get user data from AuthContext
    const { user } = useAuth();
    // console.log(user);
    //states
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [fetchedFiles, setFetchedFiles] = useState(null);
    const [loading, setLoading] = useState({
        upload: false,
        viewAll: false,
        deleteAll: false,
    });

    //functions

    // Handle file selection
    const handleFileChange = useCallback(
        (e) => {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);

            // Clear previous messages when new file is selected
            if (message) setMessage("");
        },
        [message]
    );

    // Function to handle file upload
    const handleUpload = useCallback(async () => {
        // Check if user is authenticated
        if (!user || !user.email) {
            setMessage("Please login to upload files");
            return;
        }

        // Check if user has required fields
        if (!user.id && !user.uid && !user._id && !user.userId) {
            setMessage("User ID is missing. Please logout and login again.");
            return;
        }

        // Validate file selection
        if (!file) {
            setMessage("Please select a file to upload");
            return;
        }

        // Validate file type (PDF only)
        if (file.type !== "application/pdf") {
            setMessage("Please select a valid PDF file");
            return;
        }

        // Validate file size (e.g., max 10MB)
        const maxSize = 50 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setMessage("File size must be less than 10MB");
            return;
        }

        try {
            // Set loading state for upload
            setLoading((prev) => ({ ...prev, upload: true }));
            setMessage("");

            // Create form data with the selected file and user details
            const formData = new FormData();
            formData.append("file", file);
            formData.append("userEmail", user.email);
            formData.append("userName", user.name || user.displayName || "");

            // Try different possible user ID fields
            const userId = user.id || user.uid || user._id || user.userId;
            formData.append("userId", userId);

            // Debug log to check what's being sent
            // console.log("Uploading with user data:", {
            //     userEmail: user.email,
            //     userName: user.name || user.displayName || "",
            //     userId: userId,
            //     fileSize: file.size,
            //     fileName: file.name,
            // });

            // Send file upload request to server
            const response = await fetch(`${URL}/api/file/upload`, {
                method: "POST",
                headers: {
                    // Don't set Content-Type for FormData - browser will set it automatically
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            });

            // Parse response data
            const data = await response.json();

            if (response.ok) {
                // Set success message
                setMessage(data.message || "File uploaded successfully!");

                // Clear file input after successful upload
                setFile(null);

                // Reset file input element
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = "";

                // Refresh file list if it was previously loaded
                if (fetchedFiles) {
                    handleViewAll();
                }
            } else {
                setMessage(data.message || "Failed to upload file");
                console.error("Upload failed:", data);
            }
        } catch (error) {
            // Log upload error
            console.error("Error uploading file:", error);
            setMessage(
                "Network error. Please check your connection and try again."
            );
        } finally {
            // Remove loading state
            setLoading((prev) => ({ ...prev, upload: false }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, fetchedFiles, user]);

    // Function to handle viewing all files
    const handleViewAll = useCallback(async () => {
        // Check if user is authenticated
        if (!user || !user.email) {
            setMessage("Please login to view files");
            return;
        }

        try {
            // Set loading state for view all
            setLoading((prev) => ({ ...prev, viewAll: true }));
            setMessage("");

            // Get userId for the request
            const userId = user.id || user.uid || user._id || user.userId;

            if (!userId) {
                setMessage(
                    "User ID is missing. Please logout and login again."
                );
                return;
            }

            // Build query parameters - use userId if available, otherwise use email
            const queryParams = new URLSearchParams();
            if (userId) {
                queryParams.append("userId", userId);
            } else {
                queryParams.append("userEmail", user.email);
            }

            // Send request to server to get all files for the current user
            const response = await fetch(
                `${URL}/api/file/getall?${queryParams.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            // Parse response data
            const data = await response.json();

            if (response.ok) {
                // Set fetched files data
                setFetchedFiles(data.files || []);

                // Set appropriate message based on files count
                if (data.files && data.files.length > 0) {
                    setMessage(`Found ${data.files.length} file(s)`);
                } else {
                    setMessage("No files found");
                    setFetchedFiles([]);
                }
            } else {
                setMessage(data.message || "Failed to fetch files");
                setFetchedFiles(null);
            }
        } catch (error) {
            // Log fetch error
            console.error("Error fetching files:", error);
            setMessage(
                "Network error. Please check your connection and try again."
            );
            setFetchedFiles(null);
        } finally {
            // Remove loading state
            setLoading((prev) => ({ ...prev, viewAll: false }));
        }
    }, [user]);

    // Function to handle deleting all files
    // const handleDeleteAll = useCallback(async () => {
    //     // Check if user is authenticated
    //     if (!user || !user.email) {
    //         setMessage("Please login to delete files");
    //         return;
    //     }

    //     // Confirm deletion with user
    //     const confirmDelete = window.confirm(
    //         "Are you sure you want to delete all your files? This action cannot be undone."
    //     );

    //     if (!confirmDelete) return;

    //     try {
    //         // Set loading state for delete all
    //         setLoading((prev) => ({ ...prev, deleteAll: true }));
    //         setMessage("");

    //         // Get userId for the request
    //         const userId = user.id || user.uid || user._id || user.userId;

    //         // Prepare request body
    //         const requestBody = {};
    //         if (userId) {
    //             requestBody.userId = userId;
    //         } else {
    //             requestBody.userEmail = user.email;
    //         }

    //         // Send request to server to delete all files for the current user
    //         const response = await fetch(`${URL}/api/file/deleteall`, {
    //             method: "DELETE",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${user.token}`,
    //             },
    //             body: JSON.stringify(requestBody),
    //         });

    //         // Parse response data
    //         const data = await response.json();

    //         if (response.ok) {
    //             // Set success message
    //             setMessage(data.message || "All files deleted successfully!");

    //             // Clear fetched files list
    //             setFetchedFiles(null);
    //         } else {
    //             setMessage(data.message || "Failed to delete files");
    //         }
    //     } catch (error) {
    //         // Log delete error
    //         console.error("Error deleting files:", error);
    //         setMessage(
    //             "Network error. Please check your connection and try again."
    //         );
    //     } finally {
    //         // Remove loading state
    //         setLoading((prev) => ({ ...prev, deleteAll: false }));
    //     }
    // }, [user]);

    // Function to handle downloading a file
    const handleDownload = useCallback(
        async (fileId, fileName) => {
            if (!user || !user.email) {
                setMessage("Please login to download files");
                return;
            }

            try {
                const userId = user.id || user.uid || user._id || user.userId;

                const response = await fetch(
                    `${URL}/api/file/download/${fileId}?userId=${userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    }
                );

                if (response.ok) {
                    // Create blob from response
                    const blob = await response.blob();

                    // Create download link
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);

                    setMessage("File downloaded successfully!");
                } else {
                    const data = await response.json();
                    setMessage(data.message || "Failed to download file");
                }
            } catch (error) {
                console.error("Error downloading file:", error);
                setMessage("Network error while downloading file");
            }
        },
        [user]
    );

    // If user is not authenticated, show login message
    if (!user || !user.email) {
        return (
            <div className='form-container'>
                <div className='form-header'>
                    <h2>File Management</h2>
                </div>
                <div className='message error'>
                    <b>Please login to access file management features</b>
                </div>
            </div>
        );
    }

    return (
        <div className='form-container'>
            <div className='form-header'>
                <h2></h2>
                <h2>Report Management</h2>
                <p>Upload your report pdf file here!</p>
            </div>

            <div className='file-operations'>
                {/* File input field to select PDF files */}
                <div className='file-input-container'>
                    <input
                        type='file'
                        accept='.pdf'
                        onChange={handleFileChange}
                        disabled={loading.upload}
                        className='file-input'
                    />
                    {file && (
                        <p className='selected-file'>
                            Selected: {file.name} (
                            {Math.round(file.size / 1024)} KB)
                        </p>
                    )}
                </div>

                {/* Button container */}
                <div className='button-container'>
                    {/* Upload button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || loading.upload}
                        className='action-button upload-button'
                    >
                        {loading.upload ? (
                            <>
                                <CircularProgress size={16} />
                                <span>Uploading...</span>
                            </>
                        ) : !file ? (
                            "Select a file to submit"
                        ) : (
                            "Submit"
                        )}
                    </button>

                    {/* View all files button */}
                    {/* <button
                        onClick={handleViewAll}
                        disabled={loading.viewAll}
                        className='action-button view-button'
                    >
                        {loading.viewAll ? (
                            <>
                                <CircularProgress size={16} />
                                <span>Loading...</span>
                            </>
                        ) : (
                            "View My Files"
                        )}
                    </button> */}

                    {/* Delete all files button */}
                    {/* <button
                        onClick={handleDeleteAll}
                        disabled={
                            loading.deleteAll ||
                            !fetchedFiles ||
                            fetchedFiles.length === 0
                        }
                        className='action-button delete-button'
                    >
                        {loading.deleteAll ? (
                            <>
                                <CircularProgress size={16} />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            "Delete All My Files"
                        )}
                    </button> */}
                </div>
            </div>

            {/* Display fetched files */}
            {fetchedFiles && fetchedFiles.length > 0 && (
                <div className='files-list'>
                    <h3>My Uploaded Files:</h3>
                    <div className='files-grid'>
                        {fetchedFiles.map((file, index) => (
                            <div key={index} className='file-item'>
                                <div className='file-info'>
                                    <span className='file-name'>
                                        {typeof file === "string"
                                            ? file
                                            : file.originalName ||
                                              file.fileName}
                                    </span>
                                    {typeof file === "object" && (
                                        <>
                                            {file.uploadDate && (
                                                <span className='file-date'>
                                                    Uploaded:
                                                    {new Date(
                                                        file.uploadDate
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                            {file.fileSize && (
                                                <span className='file-size'>
                                                    Size:{" "}
                                                    {Math.round(
                                                        file.fileSize / 1024
                                                    )}{" "}
                                                    KB
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                                {typeof file === "object" && file.id && (
                                    <button
                                        onClick={() =>
                                            handleDownload(
                                                file.id,
                                                file.originalName ||
                                                    file.fileName
                                            )
                                        }
                                        className='download-button'
                                    >
                                        Download
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Display success or error messages */}
            {message && (
                <div
                    className={`message ${
                        message.includes("successfully") ||
                        message.includes("Found")
                            ? "success"
                            : message.includes("No files found")
                            ? "info"
                            : "error"
                    }`}
                >
                    <b>{message}</b>
                </div>
            )}
        </div>
    );
}

//export the form component
export default Form;
