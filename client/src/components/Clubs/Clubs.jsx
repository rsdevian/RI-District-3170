import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Clubs.css";

function Clubs() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
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
                        {/* <Link to='/clubs/community'> */}
                        <div className='mission-card'>
                            <h2>Community Based</h2>
                        </div>
                        {/* </Link> */}
                        {/* <Link to='/clubs/intitue'> */}
                        <div className='vision-card'>
                            <h2>Institute Based</h2>
                        </div>
                        {/* </Link> */}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Clubs;
