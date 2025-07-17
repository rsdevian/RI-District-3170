import "./About.css";
import { useState } from "react";

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
    return (
        <div className='about-container'>
            {/* Hero Section */}
            <section className='about-hero'>
                <div className='container'>
                    <h1>About Us</h1>
                    <p>
                        Empowering businesses with innovative solutions and
                        exceptional service since 2020
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className='mission-vision'>
                <div className='ab-container'>
                    <div className='mission-vision-grid'>
                        <div className='mission-card'>
                            <div className='card-icon'>🎯</div>
                            <h2>About District 3170</h2>
                            <Button
                                onClick={() => {
                                    setPoppupOpen(true);
                                    setTitle(
                                        "District Rotaract Respresentative"
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
                            <div className='card-icon'>🚀</div>
                            <h2>District Governor</h2>
                            <Button
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
                            <div className='card-icon'>🚀</div>
                            <h2>District Rotaract Committee Chairperson</h2>
                            <Button
                                onClick={() => {
                                    setPoppupOpen(true);
                                    setTitle(
                                        "District Rotaract Respresentative"
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
                            <div className='card-icon'>🚀</div>
                            <h2>District Rotaract Respresentative</h2>
                            <Button
                                onClick={() => {
                                    setPoppupOpen(true);
                                    setTitle(
                                        "District Rotaract Respresentative"
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
                            <div className='card-icon'>🚀</div>
                            <h2>District Rotaract Secretary</h2>
                            <Button
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
                onClose={() => {
                    setPoppupOpen(false);
                }}
                maxWidth='lg'
                fullWidth
            >
                <DialogTitle className='dialog-title'>{title}</DialogTitle>
                <DialogContent className='dialog-content'>
                    <Typography className='content'>{content}</Typography>
                    <div className='img-container'>
                        <div className='img-div'>
                            <img
                                src={image}
                                alt={"image"}
                                width='250px'
                                className='image'
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setPoppupOpen(false)}
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
