import "./About.css";
import { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    DialogActions,
    Button,
} from "@mui/material";

import about from "../../contents/about.js";

function About() {
    const [popupOpen, setPoppupOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Function to render content with proper paragraphs
    const renderContent = (content) => {
        return content.split("\n\n").map((paragraph, index) => (
            <Typography
                key={index}
                className='content-paragraph'
                style={{
                    marginBottom: "1rem",
                    lineHeight: "1.6",
                    textAlign: "justify",
                }}
            >
                {paragraph}
            </Typography>
        ));
    };

    return (
        <div className='about-container'>
            {/* Hero Section */}
            <section className='about-hero'>
                <div className='container'>
                    <h1>About Us</h1>
                    <p>
                        Empowering communities through service and leadership in
                        Rotary International District 3170
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className='mission-vision'>
                <div className='ab-container'>
                    <div className='mission-vision-grid'>
                        <div className='mission-card'>
                            <h2>About District 3170</h2>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    setPoppupOpen(true);
                                    setTitle("About District 3170");
                                    setContent(
                                        about["About District 3170"].content
                                    );
                                    setImage(
                                        about["About District 3170"].image
                                    );
                                }}
                            >
                                Click for More Info
                            </Button>
                        </div>

                        <div className='vision-card'>
                            <h2>District Governor</h2>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    setPoppupOpen(true);
                                    setTitle("District Governor");
                                    setContent(
                                        about["District Governor"].content
                                    );
                                    setImage(about["District Governor"].image);
                                }}
                            >
                                Click for More Info
                            </Button>
                        </div>

                        <div className='vision-card'>
                            <h2>District Rotaract Committee Chairperson</h2>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    setPoppupOpen(true);
                                    setTitle(
                                        "District Rotaract Committee Chairperson"
                                    );
                                    setContent(
                                        about[
                                            "District Rotaract Committee Chairperson"
                                        ].content
                                    );
                                    setImage(
                                        about[
                                            "District Rotaract Committee Chairperson"
                                        ].image
                                    );
                                }}
                            >
                                Click for More Info
                            </Button>
                        </div>

                        <div className='vision-card'>
                            <h2>District Rotaract Representative</h2>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    setPoppupOpen(true);
                                    setTitle(
                                        "District Rotaract Representative"
                                    );
                                    setContent(
                                        about[
                                            "District Rotaract Respresentative"
                                        ].content
                                    );
                                    setImage(
                                        about[
                                            "District Rotaract Respresentative"
                                        ].image
                                    );
                                }}
                            >
                                Click for More Info
                            </Button>
                        </div>

                        <div className='vision-card'>
                            <h2>District Rotaract Secretary</h2>
                            <Button
                                variant='contained'
                                onClick={() => {
                                    setPoppupOpen(true);
                                    setTitle("District Rotaract Secretary");
                                    setContent(
                                        about["District Rotaract Secretary"]
                                            .content
                                    );
                                    setImage(
                                        about["District Rotaract Secretary"]
                                            .image
                                    );
                                }}
                            >
                                Click for More Info
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog
                open={popupOpen}
                onClose={() => setPoppupOpen(false)}
                maxWidth='lg'
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: "12px",
                        maxHeight: "90vh",
                    },
                }}
            >
                <DialogTitle
                    className='dialog-title'
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        borderBottom: "1px solid #e0e0e0",
                        paddingBottom: "1rem",
                    }}
                >
                    {title}
                </DialogTitle>

                <DialogContent
                    className='dialog-content'
                    style={{
                        padding: "2rem",
                        display: "flex",
                        flexDirection: "row",
                        gap: "1.5rem",
                    }}
                >
                    <div className='content-container'>
                        {renderContent(content)}
                    </div>

                    {image && (
                        <div
                            className='img-container'
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "1rem",
                            }}
                        >
                            <div className='img-div'>
                                <img
                                    src={image}
                                    alt={title}
                                    style={{
                                        width: "250px",
                                        height: "auto",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    }}
                                    className='image'
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>

                <DialogActions style={{ padding: "1rem 2rem" }}>
                    <Button
                        onClick={() => setPoppupOpen(false)}
                        variant='contained'
                        color='primary'
                        className='close-button'
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default About;
