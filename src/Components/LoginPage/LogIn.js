import React, { useState } from 'react';
//import { GetUser } from '../../JS/GetUser';
import '../../CSS/loginsigup.css'; // Import your CSS file for styling
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Login = ({ apiURL }) => {
    const [useremail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrorMsg] = useState('');
    const navigate = useNavigate(); // Move useNavigate hook call outside of the conditional logic

    const URL = apiURL;

    async function GetUser(useremail, password) {
        let errorMsg;

        try {
            const response = await fetch(`${URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ useremail, password }),
            })

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    console.log(data.user);
                    sessionStorage.setItem('signedInUser', JSON.stringify(data.user));
                } else {
                    errorMsg = 'Invalid email or password';
                }
            } else {
                errorMsg = response.statusText;
            }
        } catch (error) {
            errorMsg = error;
        }

        return errorMsg;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginErrMsg = await GetUser(useremail, password); // Retrieve error message from GetLoginData
        setErrorMsg(loginErrMsg); // Set error message state

        if (!loginErrMsg) {
            navigate('/todopage');
        }
    };

    return (
        <>
            <Navbar />
            <div className="login-container mt-5">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="useremail">User email:</label>
                        <input type="text" id="useremail" className='form-control' value={useremail} onChange={(e) => setUserEmail(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" className='form-control' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <div className='mt-4 text-white fw-bold'>
                    Click <Link className="fw-bold" to="/signup">sign up</Link> if you don't have an account.
                </div>
                {errMsg && <div className='mt-4 text-danger fw-bold'>{errMsg}</div>}
            </div>
        </>
    );
}

export default Login;
