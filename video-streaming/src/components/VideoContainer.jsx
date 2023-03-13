import React, { useEffect, useState } from 'react'
import VideoComponent from './VideoComponent'

const VideoContainer = () => {

    const [videos, setVideos] = useState([]);

    useEffect(() => {

        fetchVideos();
    }, [])


    const arr = [1, 2, 4, 5, 6, 7, 8, 9]

    const fetchVideos = async () => {


        const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL + "videos";
        // console.log(BASE_URL)
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "y-stream"
        }

        let response = await fetch("http://localhost:5001/videos", {
            method: "GET",
            headers: headersList
        });

        let data = await response.json();
        setVideos(data);

        // console.log(data);

    }

    return (
        <div className='p-2 flex flex-wrap items-center w-full'>
            {
                videos.map(e => {
                    return <VideoComponent key={e._id} video={e} />
                })
            }

        </div>
    )
}

export default VideoContainer