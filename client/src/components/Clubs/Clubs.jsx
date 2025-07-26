import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Clubs.css";

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
                        Connecting communities through service, fellowship, and
                        positive change. Discover the Rotary clubs in District
                        3170 making a difference locally and globally.
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
