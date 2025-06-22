//import modules
import React from "react";

//import styles
import "../../styles/Form.css";

//import constants
import { URL } from "../../constants/url.js";

//import render function
function Form() {
    //states
    const [message, setMessage] = React.useState(null);
    const [file, setFile] = React.useState(null);
    const [getFiles, setGetFiles] = React.useState(null);

    //functions
    const handleUpload = async () => {
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
            setMessage(data.message);
        } catch (error) {
            //log the errors
            console.error("Error Uploading the file: ", error);
            setMessage("Error Uploading the file");
        }
    };

    const handleViewAll = async () => {
        // Function to handle the view all button click

        try {
            //send the request to server to get all files
            const response = await fetch(`${URL}/api/file/getall`, {
                method: "GET",
            });
            //check if the response is ok and set the files & response data
            const data = await response.json();
            setGetFiles(data.files);
            setMessage(data.message);
        } catch (error) {
            //log the errors
            console.error("Error getting the files: ", error);
            setMessage("Error getting the files");
        }
    };

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

                {/*Render the name of all the fetched files*/}
                {getFiles &&
                    getFiles.map((file, index) => {
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
