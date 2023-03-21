import React from 'react'
import Header from './Header'
import VideoContainer from './VideoContainer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Video from './Video'
import Login from './account/Login'
import Signup from './account/Signup'

const Home = () => {

    return (
        <div className="mx-auto dark:text-white">
            {/*  bg-gray-700 text-white */}

            <BrowserRouter>

                <Header />
                <Routes>
                    <Route path='/' element={<VideoContainer />} />
                    <Route path='/video/:id' element={<Video />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />

                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Home