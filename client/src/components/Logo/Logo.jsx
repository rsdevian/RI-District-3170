import React from "react";
import { Link } from "react-router-dom";

function Logo() {
    return (
        <div className='header-align'>
            <div className='header-container'>
                <div className='logo'>
                    <Link to='/' className='logo-link'>
                        <span className='logo-text'>
                            ROTARY INTERNATIONAL DISTRICT 3170
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Logo;    
