import React from 'react'
import VideoComponent from './VideoComponent'

const VideoContainer = () => {

    const arr = [1, 2, 4, 5, 6, 7, 8, 9]
    return (
        <div className='p-2 flex flex-wrap items-center w-full'>

            {
                arr.map(e => {
                    return <VideoComponent key={e} />
                })
            }

        </div>
    )
}

export default VideoContainer