//import modules
import { useState } from "react";

//import styles
import "../../styles/Form.css";

//import constants
import { URL } from "../../constants/url.js";

//import render function
function Form() {
    //states
    const [message, setMessage] = useState(null);
    const [file, setFile] = useState(null);
    const [fetchedFiles, setFetchedFiles] = useState(null);

    //functions
    async function handleUpload() {
        //Function to handle the Upload Files

        try {
            //upload the file in a form data
            const formData = new FormData();
            formData.append("file", file);

            //send the request of file data to server
            const response = await fetch(`${URL}/api/file/upload`, {
                method: "POST",
                body: formData,
            });

            //check if the response is ok and set the response message
            const data = await response.json();

            //set message
            setMessage(data.message);
        } catch (error) {
            //log the errors
            console.error("Error Uploading the file: ", error);
            setMessage("Error Uploading the file");
        }
    }

    async function handleViewAll() {
        // Function to handle the view all button click

        try {
            //send the request to server to get all files
            const response = await fetch(`${URL}/api/file/getall`, {
                method: "GET",
            });
            //check if the response is ok and set the files & response data
            const data = await response.json();

            //setting all the fetched files
            setFetchedFiles(data.files);

            //set message
            setMessage(data.message);
        } catch (error) {
            //log the errors
            console.error("Error getting the files: ", error);
            setMessage("Error getting the files");
        }
    }

    async function handleDeleteAll() {
        //function to delete all the files in server
        try {
            //send request to server to delete all the files
            const response = await fetch(`${URL}/api/file/deleteall`, {
                method: "DELETE",
            });

            //check if the response is ok
            const data = await response.json();

            //set the response message
            setMessage(data.message);

            //set the files to null
            setFetchedFiles(null);
        } catch (error) {
            console.log("Error Deleting the files: ", error);
            setMessage("Error Deleting the files");
        }
    }

    return (
        <>
            <div className='flex items-center justify-center'>
                {/*Input field to upload the file to the database*/}
                <input
                    type='file'
                    accept='.pdf'
                    onChange={(e) => {
                        setFile(e.target.files[0]);
                    }}
                />

                {/*Upload Button to upload a file*/}
                <button onClick={handleUpload} className='w-300px'>
                    Upload File
                </button>

                {/*View All Button to view all files*/}
                <button onClick={handleViewAll} className='w-300px'>
                    View All Files
                </button>

                {/*Delete All Button to delete all files*/}
                <button onClick={handleDeleteAll} className='w-300px'>
                    Delete All Files
                </button>

                {/*Render the name of all the fetched files*/}
                {fetchedFiles &&
                    fetchedFiles.map((file, index) => {
                        return <div key={index}>{file}</div>;
                    })}

                {/*View the message set*/}
                {message && <p className='message'>{message}</p>}
            </div>
        </>
    );
}

//export the form component
export default Form;
