import React from 'react';
import './Home.scss';
import { useEffect } from 'react';
import { axiosClient } from '../../../utils/axiosClient';
import Navbar from '../../navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getMyInfo } from '../../../redux/slices/appConfigSlice';




const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMyInfo());
    }, [])

    return (
        <>
            <Navbar />
            <div className="outlet">
                <Outlet />
            </div>

        </>
    )
}

export default Home;




 // useEffect(() => {
    //     fatchData();
    // }, [])

    // const fatchData = async () => {
    //     const response = await axiosClient('/post/all');
    //     console.log(`got the response`, response);
    // }
