import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    return (
        <footer className='footer-align'>
            <div className='footer-content'>
                <div className='footer-section'>
                    <h3 className='footer-title'>YourApp</h3>
                    <p className='footer-description'>
                        Empowering businesses with innovative solutions and exceptional service.
                    </p>
                </div>
                
                <div className='footer-section'>
                    <h4 className='footer-heading'>Quick Links</h4>
                    <div className='button-align'>
                        <Link to='/' className='footer-link'>Home</Link>
                        <Link to='/about' className='footer-link'>About</Link>
                        <Link to='/contact' className='footer-link'>Contact</Link>
                        <Link to='/signup' className='footer-link'>Sign Up</Link>
                    </div>
                </div>
                
                <div className='footer-section'>
                    <h4 className='footer-heading'>Contact Info</h4>
                    <div className='contact-info'>
                        <p>📍 Pune, Maharashtra, India</p>
                        <p>📞 +91 98765 43210</p>
                        <p>✉️ info@yourapp.com</p>
                    </div>
                </div>
                
                <div className='footer-section'>
                    <h4 className='footer-heading'>Follow Us</h4>
                    <div className='social-links'>
                        <a href='#' className='social-link'>Facebook</a>
                        <a href='#' className='social-link'>Twitter</a>
                        <a href='#' className='social-link'>LinkedIn</a>
                        <a href='#' className='social-link'>Instagram</a>
                    </div>
                </div>
            </div>
            
            <div className='footer-bottom'>
                <p>&copy; 2025 YourApp. All rights reserved.</p>
                <div className='footer-bottom-links'>
                    <Link to='#' className='footer-bottom-link'>Privacy Policy</Link>
                    <Link to='#' className='footer-bottom-link'>Terms of Service</Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;