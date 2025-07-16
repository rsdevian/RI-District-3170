import { Link } from "react-router-dom";
import "./Footer.css";
import Facebook from "/assets/svgs/facebook.svg";
import Instagram from "/assets/svgs/instagram.svg";
import X from "/assets/svgs/x.svg";

function Footer() {
    return (
        <footer className='footer-align'>
            <div className='footer-bottom'>
                <p>&copy; 2025 YourApp. All rights reserved.</p>
                <div className='footer-bottom-links'>
                    <div className='social-links'>
                        <a
                            href='https://www.facebook.com'
                            target='_blank'
                            className='social-link'
                        >
                            <img src={Facebook} className='svg' />
                        </a>
                        <a
                            href='https://www.x.com'
                            target='_blank'
                            className='social-link'
                        >
                            <img src={X} className='svg' />
                        </a>
                        <a
                            href='https://www.instagram.com/rotaractdistrict3170'
                            target='_blank'
                            className='social-link'
                        >
                            <img src={Instagram} className='svg' />
                        </a>
                    </div>
                    <div className='privacy-links'>
                        <Link to='#' className='footer-bottom-link'>
                            Privacy Policy
                        </Link>
                        <Link to='#' className='footer-bottom-link'>
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
