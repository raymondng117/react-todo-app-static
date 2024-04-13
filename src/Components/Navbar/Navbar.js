import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUser } from 'react-icons/fa';
import '../../CSS/navbar.css'
import { useNavigate } from 'react-router-dom';
import { TiTick } from "react-icons/ti";


const Navbar = () => {
    const [signedInUser, setSignedInUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();


    function logOut() {
        sessionStorage.removeItem('signedInUser');
        setSignedInUser(null);
        navigate('/');
    }

    useEffect(() => {
        const savedUser = sessionStorage.getItem('signedInUser');
        if (savedUser) {
            const parsedSavedUser = savedUser ? JSON.parse(savedUser) : {};
            setSignedInUser(parsedSavedUser)
        }
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    return (
        <nav className="navbar">
            <Link to="/">
                <div className="d-flex nav-brand align-content-center justify-content-center">
                    <TiTick className="nav-logo" />
                    <div className="fw-bold fs-3 title">To-Do</div>
                </div>
            </Link>


            {/* Render based on signedInUser */}
            <div id="userNameIcon" className="fs-4" onClick={toggleDropdown}>
                <div className="userIconBox d-flex align-items-center">
                    {signedInUser && signedInUser.username}
                    {signedInUser && <FaUser className="ms-2 userIcon" />}
                </div>
                {showDropdown && signedInUser && (
                    <div className="dropdown">
                        <Link to="/settings" className="dropdown-option">Setting</Link>
                        <div className="dropdown-option" onClick={logOut}>Logout</div>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
