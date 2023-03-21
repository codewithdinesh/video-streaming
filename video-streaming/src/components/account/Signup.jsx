import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCookies } from 'react-cookie';



const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("")
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");

    const [cookies, setCookie] = useCookies(['login_token']);

    const [isLoading, setLoading] = useState(false);

    const [inputType, SetInputType] = useState("password");

    const onSignup = async () => {
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "y-stream",
            "Content-Type": "application/x-www-form-urlencoded"
        }

        let bodyContent = `email=${email}&pass=${password}&retype_pass=${re_password}&username=${username}&name=${name}`;

        fetch("http://localhost:5001/register", {
            method: "POST",
            body: bodyContent,
            headers: headersList
        })
            .then((response) => {

                return response.json();

            })
            .then(data => {
                toast(data.message);
                console.log(data);
                localStorage.setItem('login_token', data?.login_token)
                if (data?.login_token) {
                    setCookie('login_token', data?.login_token, { path: '/', httpOnly: true, sameSite: true, secure: true, expires: new Date() });
                    document.cookie = `login_token=${data.login_token}`;
                    refreshPage();
                }
            })
            .catch((err) => {
                // console.log(err);
                console.log("server is down")
                toast("server is down, please try again later..");
            });



    }
    function refreshPage() {
        window.location.reload(false);
    }

    return (
        <div className=' w-full h-full'>

            <div className="flex justify-center p-2">
                <ToastContainer />

                {

                    <div className="rounded-lg shadow-lg bg-white w-80  p-4">

                        <img
                            src="/src/login_back.svg"
                            width={0}
                            height={0}
                            alt=''
                            className='w-full '
                        />


                        {/* form */}
                        <form>

                            {/* Email Field */}
                            <label htmlFor="input-group-1" className="block text-sm font-medium text-gray-900 ">Email</label>
                            <div className="relative mb-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true"
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                                </div>
                                <input
                                    type="email"
                                    onChange={e => {
                                        e.preventDefault();
                                        setEmail(e.target.value);
                                    }}
                                    id="input-group-1"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter your email"></input>
                            </div>



                            {/* Password field */}
                            <label htmlFor="website-admin" className="block  text-sm font-medium text-gray-900 ">Password:</label>
                            <div className="relative mb-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">

                                    <svg
                                        fill="currentColor"
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 203.096 203.096" >
                                        <g>
                                            <path d="M153.976,73.236h-3.308V49.115C150.669,22.033,128.634,0,101.549,0C74.465,0,52.43,22.033,52.43,49.115v24.121H49.12
		c-9.649,0-17.5,7.851-17.5,17.5v94.859c0,9.649,7.851,17.5,17.5,17.5h104.856c9.649,0,17.5-7.851,17.5-17.5V90.736
		C171.476,81.087,163.626,73.236,153.976,73.236z M67.43,49.115C67.43,30.304,82.736,15,101.549,15
		c18.813,0,34.119,15.304,34.119,34.115v24.121H67.43V49.115z M156.476,185.596c0,1.355-1.145,2.5-2.5,2.5H49.12
		c-1.355,0-2.5-1.145-2.5-2.5V90.736c0-1.355,1.145-2.5,2.5-2.5H59.93h83.238h10.808c1.355,0,2.5,1.145,2.5,2.5V185.596z"/>
                                            <path d="M101.547,116.309c-4.142,0-7.5,3.357-7.5,7.5v28.715c0,4.143,3.358,7.5,7.5,7.5c4.142,0,7.5-3.357,7.5-7.5v-28.715
		C109.047,119.666,105.689,116.309,101.547,116.309z"/>
                                        </g>
                                    </svg>

                                </div>
                                <input
                                    type={inputType}
                                    onChange={e => {
                                        e.preventDefault();
                                        setPassword(e.target.value);
                                    }}

                                    id="input-group-1"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter password"
                                    onDoubleClick={() => {
                                        if (inputType == "password") {
                                            SetInputType("text");

                                        } else {
                                            SetInputType("password")
                                        }
                                    }}
                                ></input>

                            </div>


                            {/* retype Password field */}
                            <label htmlFor="website-admin" className="block  text-sm font-medium text-gray-900 ">Retype Password:</label>
                            <div className="relative mb-1">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">

                                    <svg
                                        fill="currentColor"
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 203.096 203.096" >
                                        <g>
                                            <path d="M153.976,73.236h-3.308V49.115C150.669,22.033,128.634,0,101.549,0C74.465,0,52.43,22.033,52.43,49.115v24.121H49.12
		c-9.649,0-17.5,7.851-17.5,17.5v94.859c0,9.649,7.851,17.5,17.5,17.5h104.856c9.649,0,17.5-7.851,17.5-17.5V90.736
		C171.476,81.087,163.626,73.236,153.976,73.236z M67.43,49.115C67.43,30.304,82.736,15,101.549,15
		c18.813,0,34.119,15.304,34.119,34.115v24.121H67.43V49.115z M156.476,185.596c0,1.355-1.145,2.5-2.5,2.5H49.12
		c-1.355,0-2.5-1.145-2.5-2.5V90.736c0-1.355,1.145-2.5,2.5-2.5H59.93h83.238h10.808c1.355,0,2.5,1.145,2.5,2.5V185.596z"/>
                                            <path d="M101.547,116.309c-4.142,0-7.5,3.357-7.5,7.5v28.715c0,4.143,3.358,7.5,7.5,7.5c4.142,0,7.5-3.357,7.5-7.5v-28.715
		C109.047,119.666,105.689,116.309,101.547,116.309z"/>
                                        </g>
                                    </svg>

                                </div>
                                <input
                                    type={inputType}
                                    onChange={e => {
                                        e.preventDefault();
                                        setRePassword(e.target.value);
                                    }}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="retype password"
                                    onDoubleClick={() => {
                                        if (inputType == "password") {
                                            SetInputType("text");

                                        } else {
                                            SetInputType("password")
                                        }
                                    }}
                                ></input>

                            </div>


                            {/* Name */}
                            <div className='mb-1'>
                                <label htmlFor="input-group-1" className="block text-sm font-medium text-gray-900 ">Name: </label>
                                <input
                                    type="text"
                                    onChange={e => {
                                        e.preventDefault();
                                        setName(e.target.value);
                                    }}

                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter your Name"></input>
                            </div>

                            {/* username */}
                            <label htmlFor="input-group-1" className="block text-sm font-medium text-gray-900 ">Username :</label>

                            <div className='mb-1'>
                                <input
                                    type="text"
                                    onChange={e => {
                                        e.preventDefault();
                                        setUsername(e.target.value);
                                    }}

                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter your username"></input>
                            </div>


                            {/* signup */}

                            <div className="flex space-x-2 justify-center m-1">
                                <button
                                    type="submit"
                                    onClick={e => {
                                        e.preventDefault();

                                        onSignup();
                                    }}
                                    className="justify-center text-gray-900 bg-gradient-to-r content-center from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 outline-none   font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    Signup
                                </button>
                            </div>
                        </form>

                    </div>
                }

            </div>

        </div>
    )
}

export default Signup