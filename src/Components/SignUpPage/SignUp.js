import React, { useEffect, useState } from 'react';
//import { GetUser } from '../../JS/GetUser';
import '../../CSS/loginsigup.css'; // Import your CSS file for styling
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const SignUp = ({ apiURL }) => {
    const [username, setUserName] = useState('');
    const [useremail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signUperrMsg, setSignUperrMsg] = useState('');
    const [signedUp, setSignedUp] = useState(false);
    const navigate = useNavigate();

    const URL = apiURL;

    async function SignUp(username, useremail, password) {
        let errMsg;
        await fetch(`${URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({username, useremail, password }),
        })
        .then(res => {
            if (res.ok) {
                return res.json(); 
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(data => {
            if (data.signedup) {
                setSignedUp(true);
            } else {
                throw new Error('Invalid response from server');
            }
        })
        .catch(error => {
            console.error('Error during signup:', error);
            errMsg ='Error during signup. Please try again later.';
        });

        return errMsg;
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const errMsg = await SignUp(username, useremail, password); 

        setSignUperrMsg(errMsg);
    };

    useEffect(() => {
        if (signedUp) {
            const timer = setTimeout(() => {
                navigate('/');
            }, 2000);
    
            return () => clearTimeout(timer);
        }
    }, [signedUp]); 

    return (
        <>
            <Navbar />
            <div className="login-container mt-5">
                <h2>Sign Up</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">User name:</label>
                        <input type="text" id="username" className='form-control' value={username} onChange={(e) => setUserName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="useremail">User email:</label>
                        <input type="text" id="useremail" className='form-control' value={useremail} onChange={(e) => setUserEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" onClick={ handleSignUp}>Sign Up</button>
                </form>
                
                {signedUp ? <div className='mt-2 text-info fw-bold'>Sign up successfully! Wait to be directed in secs.</div> : <div className='mt-4 text-white fw-bold'>
                    Click <Link className="fw-bold" to="/">log in</Link> if you have an account.
                </div>}
                {signUperrMsg && <div className='mt-2 text-danger fw-bold'>{signUperrMsg}</div>}
            </div>
        </>
    );
}

export default SignUp;
