import { Link } from "react-router-dom";
import "./Clubs.css";

function Clubs() {
    return (
        <div className='about-container'>
            {/* Hero Section */}
            <section className='about-hero'>
                <div className='container'>
                    <h1>Clubs</h1>
                    <p>
                        Empowering businesses with innovative solutions and
                        exceptional service since 2020
                    </p>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className='mission-vision'>
                <div className='ab-container'>
                    <div className='mission-vision-grid-cl'>
                        <Link to='/login'>
                            <div className='mission-card'>
                                <div className='card-icon'>🎯</div>
                                <h2>Community Based</h2>
                                <p>
                                    To deliver cutting-edge technology solutions
                                    that help businesses grow, innovate, and
                                    succeed in the digital age. We strive to
                                    make technology accessible, reliable, and
                                    transformative for our clients.
                                </p>
                            </div>
                        </Link>
                        <Link to='/login'>
                            <div className='vision-card'>
                                <div className='card-icon'>🚀</div>
                                <h2>Institute Based</h2>
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
        </div>
    );
}

export default Clubs;
