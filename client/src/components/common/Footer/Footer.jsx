//import modules
import { Link } from "react-router-dom";

//import styles
import "./Footer.css";

//export function
function Footer() {
    return (
        <>
            <div className='footer-align'>
                <div className='button-align'>
                    {/* Added Navigation links in Footer */}
                    <Link to='/contact'>Contact</Link>
                    <Link to='/about'>About</Link>
                </div>
            </div>
        </>
    );
}

export default Footer;
