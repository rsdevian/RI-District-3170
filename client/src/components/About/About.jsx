import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
    return (
        <div className='about-container'>
            {/* Hero Section */}
            <section className='about-hero'>
                <div className='container'>
                    <h1>About Our Company</h1>
                    <p>
                        Empowering businesses with innovative solutions and
                        exceptional service since 2020
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className='mission-vision'>
                <div className='container'>
                    <div className='mission-vision-grid'>
                        <div className='mission-card'>
                            <div className='card-icon'>🎯</div>
                            <h2>Our Mission</h2>
                            <p>
                                To deliver cutting-edge technology solutions
                                that help businesses grow, innovate, and succeed
                                in the digital age. We strive to make technology
                                accessible, reliable, and transformative for our
                                clients.
                            </p>
                        </div>
                        <div className='vision-card'>
                            <div className='card-icon'>🚀</div>
                            <h2>Our Vision</h2>
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

            {/* Story Section */}
            <section className='story-section'>
                <div className='container'>
                    <div className='story-content'>
                        <div className='story-text'>
                            <h2>Our Story</h2>
                            <p>
                                Founded in 2020 by a team of passionate
                                technologists, our company began with a simple
                                yet powerful vision: to bridge the gap between
                                complex technology and business needs.
                            </p>

                            <p>
                                What started as a small startup in Pune has
                                grown into a trusted partner for businesses
                                across India and beyond. Our journey has been
                                marked by continuous innovation, unwavering
                                commitment to quality, and a deep understanding
                                of our clients' challenges.
                            </p>

                            <p>
                                Today, we serve hundreds of clients ranging from
                                startups to enterprise-level organizations,
                                helping them leverage technology to achieve
                                their business objectives and stay competitive
                                in an ever-evolving digital landscape.
                            </p>

                            <div className='story-stats'>
                                <div className='stat'>
                                    <span className='stat-number'>500+</span>
                                    <span className='stat-label'>
                                        Happy Clients
                                    </span>
                                </div>
                                <div className='stat'>
                                    <span className='stat-number'>1000+</span>
                                    <span className='stat-label'>
                                        Projects Completed
                                    </span>
                                </div>
                                <div className='stat'>
                                    <span className='stat-number'>5+</span>
                                    <span className='stat-label'>
                                        Years Experience
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='story-image'>
                            <div className='image-placeholder'>
                                <span>Company Timeline</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className='values-section'>
                <div className='container'>
                    <h2 className='section-title'>Our Core Values</h2>
                    <div className='values-grid'>
                        <div className='value-card'>
                            <div className='value-icon'>🔧</div>
                            <h3>Innovation</h3>
                            <p>
                                We constantly push boundaries and embrace new
                                technologies to deliver innovative solutions
                                that drive business growth.
                            </p>
                        </div>
                        <div className='value-card'>
                            <div className='value-icon'>🤝</div>
                            <h3>Integrity</h3>
                            <p>
                                We conduct business with the highest ethical
                                standards, building trust through transparency
                                and honest communication.
                            </p>
                        </div>
                        <div className='value-card'>
                            <div className='value-icon'>⭐</div>
                            <h3>Excellence</h3>
                            <p>
                                We strive for perfection in everything we do,
                                delivering high-quality solutions that exceed
                                client expectations.
                            </p>
                        </div>
                        <div className='value-card'>
                            <div className='value-icon'>👥</div>
                            <h3>Collaboration</h3>
                            <p>
                                We believe in the power of teamwork and work
                                closely with our clients to achieve shared
                                success.
                            </p>
                        </div>
                        <div className='value-card'>
                            <div className='value-icon'>🌱</div>
                            <h3>Growth</h3>
                            <p>
                                We are committed to continuous learning and
                                improvement, both for ourselves and our clients.
                            </p>
                        </div>
                        <div className='value-card'>
                            <div className='value-icon'>🎯</div>
                            <h3>Customer Focus</h3>
                            <p>
                                Our clients' success is our success. We
                                prioritize their needs and work tirelessly to
                                deliver value.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className='team-section'>
                <div className='container'>
                    <h2 className='section-title'>Meet Our Team</h2>
                    <p className='team-intro'>
                        Our diverse team of experts brings together years of
                        experience, creativity, and passion for technology.
                    </p>

                    <div className='team-grid'>
                        <div className='team-member'>
                            <div className='member-photo'>
                                <span>👨‍💼</span>
                            </div>
                            <h3>John Smith</h3>
                            <p className='member-role'>CEO & Founder</p>
                            <p className='member-bio'>
                                Visionary leader with 15+ years in technology
                                and business strategy.
                            </p>
                        </div>
                        <div className='team-member'>
                            <div className='member-photo'>
                                <span>👩‍💻</span>
                            </div>
                            <h3>Sarah Johnson</h3>
                            <p className='member-role'>CTO</p>
                            <p className='member-bio'>
                                Technical expert specializing in scalable
                                architectures and innovation.
                            </p>
                        </div>
                        <div className='team-member'>
                            <div className='member-photo'>
                                <span>👨‍🎨</span>
                            </div>
                            <h3>Mike Chen</h3>
                            <p className='member-role'>Head of Design</p>
                            <p className='member-bio'>
                                Creative director passionate about user
                                experience and design excellence.
                            </p>
                        </div>
                        <div className='team-member'>
                            <div className='member-photo'>
                                <span>👩‍📊</span>
                            </div>
                            <h3>Emily Davis</h3>
                            <p className='member-role'>Head of Operations</p>
                            <p className='member-bio'>
                                Operations expert ensuring seamless project
                                delivery and client satisfaction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='about-cta'>
                <div className='container'>
                    <div className='cta-content'>
                        <h2>Ready to Work Together?</h2>
                        <p>
                            Let's discuss how we can help your business achieve
                            its goals with innovative technology solutions.
                        </p>
                        <div className='cta-buttons'>
                            <Link to='/contact' className='btn btn-primary'>
                                Get in Touch
                            </Link>
                            <Link to='/signup' className='btn btn-secondary'>
                                Start Your Journey
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default About;
