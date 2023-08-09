import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.scss'
import { axiosClient } from '../../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '../../../utils/localStorageManager';
const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axiosClient.post('auth/login', {
                email,
                password
            });
            // console.log(result);
            setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
            navigate('/')
        } catch (error) {
            console.log(error)
            // return Promise.reject(error)

        }
    }


    return (
        <div className="Login" >
            <div className="login-box">
                <h2 className="heading">Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" >Email</label>
                    <input type="email" className='email' id='email' onChange={(e) => setEmail(e.target.value)} />


                    <label htmlFor="password">Password</label>
                    <input type="password" className='password' id='password' onChange={(p) => setPassword(p.target.value)} />


                    <input type="submit" className='submit' />
                </form>
                <p className='subHeading'>Do not have an account? <Link to='/signup' className='link'>Sing Up</Link></p>
            </div>
        </div>
    )
}

export default Login;