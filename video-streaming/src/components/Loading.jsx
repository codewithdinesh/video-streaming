import React from 'react'

const Loading = () => {
    return (

        <div className='flex justify-center p-5 '>

            <div className="max-w-sm items-center ">
                <div className="p-6 rounded-lg shadow-lg bg-white w-full flex items-center">

                    <div className="flex justify-center items-center w-screen ">
                        <div
                            className="m-2 spinner-border animate-spin block w-16 h-12 border-4  rounded-full border-red-400"
                            role="status">
                            <span className="visually-hidden"></span>


                        </div>
                        <h1 className='text-red-500 animate-pulse font-semibold text-2xl'>
                            Loading...
                        </h1>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Loading