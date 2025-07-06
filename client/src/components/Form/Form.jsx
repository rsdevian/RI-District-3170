//import modules
import { useState, useCallback } from "react";
import { CircularProgress } from "@mui/material";

//import constants
import { URL } from "../../constants/url.js";

//import styles
import "../../styles/Form.css";

//export function
function Form() {
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
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setMessage("File size must be less than 10MB");
            return;
        }

        try {
            // Set loading state for upload
            setLoading((prev) => ({ ...prev, upload: true }));
            setMessage("");

            // Create form data with the selected file
            const formData = new FormData();
            formData.append("file", file);

            // Send file upload request to server
            const response = await fetch(`${URL}/api/file/upload`, {
                method: "POST",
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
    }, [file, fetchedFiles]);

    // Function to handle viewing all files
    const handleViewAll = useCallback(async () => {
        try {
            // Set loading state for view all
            setLoading((prev) => ({ ...prev, viewAll: true }));
            setMessage("");

            // Send request to server to get all files
            const response = await fetch(`${URL}/api/file/getall`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

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
    }, []);

    // Function to handle deleting all files
    const handleDeleteAll = useCallback(async () => {
        // Confirm deletion with user
        const confirmDelete = window.confirm(
            "Are you sure you want to delete all files? This action cannot be undone."
        );

        if (!confirmDelete) return;

        try {
            // Set loading state for delete all
            setLoading((prev) => ({ ...prev, deleteAll: true }));
            setMessage("");

            // Send request to server to delete all files
            const response = await fetch(`${URL}/api/file/deleteall`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Parse response data
            const data = await response.json();

            if (response.ok) {
                // Set success message
                setMessage(data.message || "All files deleted successfully!");

                // Clear fetched files list
                setFetchedFiles(null);
            } else {
                setMessage(data.message || "Failed to delete files");
            }
        } catch (error) {
            // Log delete error
            console.error("Error deleting files:", error);
            setMessage(
                "Network error. Please check your connection and try again."
            );
        } finally {
            // Remove loading state
            setLoading((prev) => ({ ...prev, deleteAll: false }));
        }
    }, []);

    return (
        <div className='form-container'>
            <div className='form-header'>
                <h2>File Management</h2>
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
                        ) : (
                            "Upload File"
                        )}
                    </button>

                    {/* View all files button */}
                    <button
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
                            "View All Files"
                        )}
                    </button>

                    {/* Delete all files button */}
                    <button
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
                            "Delete All Files"
                        )}
                    </button>
                </div>
            </div>

            {/* Display fetched files */}
            {fetchedFiles && fetchedFiles.length > 0 && (
                <div className='files-list'>
                    <h3>Uploaded Files:</h3>
                    <div className='files-grid'>
                        {fetchedFiles.map((fileName, index) => (
                            <div key={index} className='file-item'>
                                <span className='file-name'>{fileName}</span>
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
