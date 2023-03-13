import React from 'react'
import { Link } from 'react-router-dom'

const VideoComponent = ({ video }) => {


    return (
        <div className="w-4/4 sm:w-2/4 md:w-1/4 lg:w-1/5">
            <div className="shadow-card flex flex-col rounded-lg bg-white bg-clip-border m-1">

                <div className='m-1 '>

                    <div className=' max-h-64 xs:h-40 sm:h-32 md:h-32  lg:h-44 rounded-lg overflow-hidden  '>

                        <Link to={"/video/" + video?._id} blur-shadow-image="true">
                            <img
                                className=" w-full h-full object-cover"
                                src={process.env.REACT_APP_AWS_URL + video?.videoCover}
                                alt="Thumbnail"
                            />
                        </Link>
                    </div>

                    <div className="text-secondary text-black  ">
                        <a href="/#">
                            <h4 className="font-medium">{video?.videoTitle}</h4>
                        </a>
                    </div>
                </div>

            </div>
        </div>


    )
}

export default VideoComponent