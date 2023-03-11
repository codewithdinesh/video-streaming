import React from 'react'

const VideoComponent = () => {


    return (

        <div class="w-4/4 sm:w-2/4 md:w-1/4 lg:w-1/5">
            <div class="shadow-card flex flex-col rounded-lg bg-white bg-clip-border m-1">

                <div className='m-1 '>

                    <div className=' max-h-64 xs:h-40 sm:h-32 md:h-32  lg:h-44 rounded-lg overflow-hidden  '>

                        <a href="/#" blur-shadow-image="true">
                            <img
                                class=" w-full h-full object-cover"
                                src="/thumbnail.png"
                                alt="Thumbnail"
                            />
                        </a>
                    </div>

                    <div class="text-secondary  ">
                        <a href="/#">
                            <h4 class="font-medium">Video Title</h4>
                        </a>
                    </div>
                </div>

            </div>
        </div>


    )
}

export default VideoComponent