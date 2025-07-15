import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

import { Link } from "react-router-dom";
import "./District.css";

function District() {
    const [popupOpen, setPoppupOpen] = useState(false);
    return (
        <div className='about-container'>
            {/* Hero Section */}
            <section className='about-hero'>
                <div className='container'>
                    <h1>District</h1>
                    <p>
                        Empowering businesses with innovative solutions and
                        exceptional service since 2020
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className='mission-vision'>
                <div className='ab-container'>
                    <div className='mission-vision-grid-dis'>
                        <Link to='/login'>
                            <div className='mission-card'>
                                <div className='card-icon'>🎯</div>
                                <h2>District Council</h2>
                                <p>
                                    To deliver cutting-edge technology solutions
                                    that help businesses grow, innovate, and
                                    succeed in the digital age. We strive to
                                    make technology accessible, reliable, and
                                    transformative for our clients.
                                </p>
                            </div>
                        </Link>

                        <div
                            className='vision-card'
                            onClick={() => {
                                setPoppupOpen(true);
                            }}
                        >
                            <div className='card-icon'>🚀</div>
                            <h2>Zones</h2>
                            <p>
                                To become the leading technology partner for
                                businesses worldwide, known for our innovation,
                                reliability, and commitment to customer success.
                                We envision a future where technology seamlessly
                                enhances human potential.
                            </p>
                        </div>
                        <Link to='/login'>
                            <div className='vision-card'>
                                <div className='card-icon'>🚀</div>
                                <h2>District Initiatives</h2>
                                <p>
                                    To become the leading technology partner for
                                    businesses worldwide, known for our
                                    innovation, reliability, and commitment to
                                    customer success. We envision a future where
                                    technology seamlessly enhances human
                                    potential.
                                </p>
                            </div>
                        </Link>
                        <Link to='/login'>
                            <div className='vision-card'>
                                <div className='card-icon'>🚀</div>
                                <h2>District Events</h2>
                                <p>
                                    To become the leading technology partner for
                                    businesses worldwide, known for our
                                    innovation, reliability, and commitment to
                                    customer success. We envision a future where
                                    technology seamlessly enhances human
                                    potential.
                                </p>
                            </div>
                        </Link>
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
                <DialogTitle>Dialog Box</DialogTitle>
                <DialogContent>
                    <Typography>This is a dialog box</Typography>
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

export default District;
