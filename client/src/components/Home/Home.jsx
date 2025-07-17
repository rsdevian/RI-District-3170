import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    return (
        <div className='home-container'>
            {/* Hero Section */}
            <section className='hero-section'>
                <div className='hero-content'>
                    {/* <h1 className='hero-title'>Welcome to Our Platform</h1>
                    <p className='hero-subtitle'>
                        Discover amazing features and connect with our community
                    </p>
                    <div className='hero-buttons'>
                        <Link to='/signup' className='btn btn-primary'>
                            Get Started
                        </Link>
                        <Link to='/about' className='btn btn-secondary'>
                            Learn More
                        </Link>
                    </div> */}
                </div>
                {/* <div className='hero-image'>
                    <div className='hero-placeholder'>
                        <span>Hero Image</span>
                    </div>
                </div> */}
            </section>

            {/* Features Section */}
            <section className='features-section'>
                <div className='container'>
                    <h2 className='section-title'>Why Choose Us</h2>
                    <div className='features-grid'>
                        <div className='feature-card'>
                            <div className='feature-icon'>🚀</div>
                            <h3>Fast & Reliable</h3>
                            <p>
                                Experience lightning-fast performance with our
                                optimized platform.
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>🔒</div>
                            <h3>Secure</h3>
                            <p>
                                Your data is protected with enterprise-grade
                                security measures.
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>📱</div>
                            <h3>Mobile Ready</h3>
                            <p>
                                Access your account anywhere with our responsive
                                design.
                            </p>
                        </div>
                        <div className='feature-card'>
                            <div className='feature-icon'>💡</div>
                            <h3>Innovative</h3>
                            <p>
                                Stay ahead with cutting-edge features and
                                regular updates.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='cta-section'>
                <div className='container'>
                    <div className='cta-content'>
                        <h2>Ready to Get Started?</h2>
                        <p>Join thousands of users who trust our platform</p>
                        <Link to='/signup' className='btn btn-cta'>
                            Sign Up Now
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
