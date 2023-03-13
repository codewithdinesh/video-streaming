import React from 'react'
import Header from './Header'
import VideoContainer from './VideoContainer'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Video from './Video'
import Login from './account/Login'

const Home = () => {
    return (
        <div className="container mx-auto dark:text-white">
            {/*  bg-gray-700 text-white */}

            <BrowserRouter>

                <Header />
                <Routes>
                    <Route path='/' element={<VideoContainer />} />
                    <Route path='/video/:id' element={<Video />} />
                    <Route path='/login' element={<Login />} />

                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default Home