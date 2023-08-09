import React, { useRef, useState } from 'react'
import './Navbar.scss'
import Avatar from '../avatar/Avatar'
import { useNavigate } from 'react-router-dom'
import { AiOutlineLogout } from 'react-icons/ai'
import LoadingBar from 'react-top-loading-bar';
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/slices/appConfigSlice'
import { axiosClient } from '../../utils/axiosClient'
import { KEY_ACCESS_TOKEN, removItem } from '../../utils/localStorageManager'


function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfile = useSelector(state => state.appConfigReducer.myProfile)
    // const toggleLoadingBar = () => {
    //     dispatch(setLoading(true))
    // }
    const logout = async () => {

        try {
            // dispatch(setLoading(true));
            await axiosClient.post('/auth/logout');
            removItem(KEY_ACCESS_TOKEN);
            navigate('/login')
            // dispatch(setLoading(false))

        } catch (e) {
            return Promise.reject(e)

        }
    }

    return (
        <div className='Navbar'>
            {/* <LoadingBar height={6} color='#5f9fff' ref={loadingRef} /> */}
            <div className="container">
                <h2 className="banner hover-link" onClick={() => navigate('/')}>Social Media</h2>
                <div className="right-side">
                    <div className="profile hover-link" onClick={() => navigate(`/profile/${myProfile?._id}`)}>
                        <Avatar src={myProfile?.avatar?.url} />
                    </div>

                    <div className="logout hover-link" onClick={logout}>
                        <AiOutlineLogout />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Navbar