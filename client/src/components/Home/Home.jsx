import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Home.css";

function Home() {
    const videoRef = useRef(null);
    const [_, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedData = () => {
            setVideoLoaded(true);
        };

        const handleError = () => {
            setVideoError(true);
        };

        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("error", handleError);

        // Performance optimization: pause video when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {
                        setVideoError(true);
                    });
                } else {
                    video.pause();
                }
            });
        });

        observer.observe(video);

        return () => {
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("error", handleError);
            observer.disconnect();
        };
    }, []);

    return (
        <div className='home-container'>
            {/* Hero Section with Video Background */}
            <section className={`hero-section ${videoError ? "fallback" : ""}`}>
                {/* Background Video */}
                {!videoError && (
                    <div className='hero-video'>
                        <video
                            ref={videoRef}
                            className='background-video'
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload='metadata'
                        >
                            <source
                                src='/assets/images/Home/background.mp4'
                                type='video/mp4'
                            />
                            <source
                                src='/assets/images/Home/background.webm'
                                type='video/webm'
                            />
                            {/* Fallback for browsers that don't support video */}
                        </video>
                    </div>
                )}

                {/* Video Overlay for better text readability */}
                {/* <div className='video-overlay'></div> */}

                {/* <div className='hero-content'>
                    <h1 className='hero-title'>Welcome to Our District</h1>
                    <p className='hero-subtitle'>
                        Building communities, fostering growth, and creating
                        opportunities for everyone in our vibrant district.
                    </p>
                    <div className='hero-buttons'>
                        <Link to='/services' className='btn btn-primary'>
                            Our Services
                        </Link>
                        <Link to='/about' className='btn btn-secondary'>
                            Learn More
                        </Link>
                    </div>
                </div> */}
            </section>

            {/* Features Section */}
            {/* <section className='features-section'>
                <div className='container'>
                    <h2 className='section-title'>Why Choose Our District</h2>
                    <div className='features-grid'>
                        <div className='feature-card'>
                            <div className='feature-icon'>🏛️</div>
                            <h3>Efficient Governance</h3>
                            <p>
                                Experience streamlined public services with our
                                modern administrative approach.
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>🌱</div>
                            <h3>Sustainable Development</h3>
                            <p>
                                Committed to environmental protection and
                                sustainable growth for future generations.
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>🤝</div>
                            <h3>Community Focused</h3>
                            <p>
                                Building stronger communities through inclusive
                                programs and citizen engagement.
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>📈</div>
                            <h3>Economic Growth</h3>
                            <p>
                                Fostering business development and job creation
                                for regional prosperity.
                            </p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* CTA Section */}
            <section className='cta-section'>
                <div className='container'>
                    <div className='cta-content'>
                        <h2>Get Involved in Our Community</h2>
                        <p>
                            Join us in building a better future for our district
                        </p>
                        <Link to='/contact' className='btn btn-cta'>
                            Contact Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
