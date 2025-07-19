import { useState, useEffect } from "react";
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

import respresentatives from "../../contents/zones.representatives";

function District() {
    const [popupOpen, setPoppupOpen] = useState(false);
    const [eventPopupOpen, setEventsPoppupOpen] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
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
                        <Link to='/district/council'>
                            <div className='mission-card'>
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
                            <h2>Zones</h2>
                            <p>
                                To become the leading technology partner for
                                businesses worldwide, known for our innovation,
                                reliability, and commitment to customer success.
                                We envision a future where technology seamlessly
                                enhances human potential.
                            </p>
                        </div>
                        <Link to='/district/initiatives'>
                            <div className='vision-card'>
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
                        <div
                            className='vision-card'
                            onClick={() => {
                                setEventsPoppupOpen(true);
                            }}
                        >
                            <h2>Events</h2>
                            <p>
                                To become the leading technology partner for
                                businesses worldwide, known for our innovation,
                                reliability, and commitment to customer success.
                                We envision a future where technology seamlessly
                                enhances human potential.
                            </p>
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
                <DialogTitle>Zones</DialogTitle>
                <DialogContent>
                    <div className='rep-content'>
                        {respresentatives.map((item, index) => {
                            return (
                                <div key={index} className='rep-card'>
                                    {/* Flag Section */}
                                    <div className='flag-section'>
                                        <img
                                            src={item.flag}
                                            alt='Zone flag'
                                            className='flag-image'
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    </div>

                                    {/* Name and Club Section - Centered */}
                                    <div className='name-container'>
                                        <h3 className='rep-name'>
                                            {item.name}
                                        </h3>
                                        <p className='rep-club'>{item.club}</p>
                                    </div>

                                    {/* Profile Image Section */}

                                    <div className='profile-section'>
                                        <img
                                            src={item.image}
                                            alt={item.name || "Representative"}
                                            className='rep-image'
                                            onError={(e) => {
                                                e.target.src =
                                                    "https://via.placeholder.com/100x100/667eea/white?text=" +
                                                    (item.name
                                                        ? item.name.charAt(0)
                                                        : "R");
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
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
            <Dialog
                open={eventPopupOpen}
                onClose={() => {
                    setEventsPoppupOpen(false);
                }}
                maxWidth='lg'
                fullWidth
            >
                <DialogTitle>District Events</DialogTitle>
                <DialogContent>
                    <div className='events-content'>
                        <Link to='/district/events' className='event-card'>
                            <div className='event-header'>
                                <h3 className='event-title'>District Events</h3>
                            </div>
                        </Link>

                        {/* Example Event Card 2 */}
                        <Link
                            to='/district/events/rsamdio'
                            className='event-card'
                        >
                            <div className='event-header'>
                                <h3 className='event-title'>
                                    Rotaract South Asia Multi District
                                    Information Organization (RSA MDIO)
                                </h3>
                            </div>
                        </Link>

                        {/* Example Event Card 3 */}
                        <div to='/' className='event-card'>
                            <div className='event-header'>
                                <h3 className='event-title'>
                                    South East Asia Rotract Information Center
                                    (SEARIC MDIO)
                                </h3>
                            </div>
                        </div>

                        <div to='/' className='event-card'>
                            <div className='event-header'>
                                <h3 className='event-title'>
                                    Rotary International Convention - Taipei
                                </h3>
                            </div>
                        </div>
                        {/* If no events, show this instead */}
                        {/* 
            <div className='no-events'>
                <div className='no-events-title'>No Events Available</div>
                <div className='no-events-message'>
                    Check back later for upcoming district events and activities.
                </div>
            </div>
            */}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setEventsPoppupOpen(false)}
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
