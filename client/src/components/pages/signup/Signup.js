import React, { useState } from 'react'
import './Signup.scss'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../../utils/axiosClient'
import { KEY_ACCESS_TOKEN, setItem } from '../../../utils/localStorageManager'


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await axiosClient.post('auth/signup', {
                name,
                email,
                password
            });


        } catch (error) {
            console.log(error)

        }
    }


    return (
        <div className="signup" >
            <div className="signup-box">
                <h2 className="heading">Signup</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name" >Name</label>
                    <input type="text" className='name' id='name' onChange={(n) => setName(n.target.value)} />

                    <label htmlFor="email" >Email</label>
                    <input type="email" className='email' id='email' onChange={(e) => setEmail(e.target.value)} />


                    <label htmlFor="password">Password</label>
                    <input type="password" className='password' id='password' onChange={(p) => setPassword(p.target.value)} />


                    <input type="submit" className='submit' />
                </form>
                <p className='subHeading'>Allready have an account? <Link to='/login' className='link'>Login</Link></p>
            </div>
        </div>
    )
}

export default Signup;