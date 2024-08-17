import React, { useState } from 'react';
//import { GetUser } from '../../JS/GetUser';
import '../../CSS/loginsigup.css'; // Import your CSS file for styling
import Navbar from '../Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Login = ({ apiURL }) => {

    sessionStorage.removeItem('signedInUser');

    const [useremail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrorMsg] = useState('');
    const navigate = useNavigate(); 

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

    const handleChangeEmail = (e) => {
        setUserEmail(e.target.value);
        if (errMsg) {
            setErrorMsg('');
        }
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        if (errMsg) {
            setErrorMsg('');
        }
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        const loginErrMsg = await GetUser(useremail, password); 
        setErrorMsg(loginErrMsg); 

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
                        <input type="text" id="useremail" className='form-control' value={useremail} onChange={(e) => handleChangeEmail(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" className='form-control' value={password} onChange={(e) => handleChangePassword(e)} />
                    </div>
                    <button type="submit" id='loginBtn'>Login</button>
                </form>
                <div className='mt-4 text-white fw-bold'>
                    Click <Link className="fw-bold" to="/signup" id="signUpLink">sign up</Link> if you don't have an account.
                </div>
                {errMsg && <div className='mt-4 text-danger fw-bold'>{errMsg}</div>}
            </div>
        </>
    );
}

export default Login;
