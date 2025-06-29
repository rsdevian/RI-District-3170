//import modules
import { Link } from "react-router-dom";

//import styles
import "./Header.css";

//export function
function Header() {
    return (
        <>
            <div className='header-align'>
                <div className='button-align'>
                    {/*Added Navigation links in Header */}
                    <Link to='/'>Home</Link>
                    <Link to='/form'>Form</Link>
                    <Link to='/account'>Account</Link>
                </div>
            </div>
        </>
    );
}

//export the component
export default Header;
