import React from 'react'

const VideoComponent = () => {


    return (

        <div class="w-4/4 h-1/6 sm:w-2/4 md:w-1/4 lg:w-1/5">
            <div class="shadow-card flex flex-col rounded-lg bg-white bg-clip-border m-1">

                <div className='m-1  rounded-lg overflow-hidden '>

                    <div className=' max-h-80 '>

                        <a href="/#" blur-shadow-image="true">
                            <img
                                class=" w-full object-center h-full"

                                src="https://images.unsplash.com/photo-1678327461067-ee8fe27163c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=600&q=60"
                                alt="Thumbnail"
                            />
                        </a>
                    </div>

                    <div class="text-secondary  ">
                        <a href="/#">
                            <h4 class="font-medium">Material Tailwind</h4>
                        </a>
                    </div>
                </div>

            </div>
        </div>


    )
}

export default VideoComponent