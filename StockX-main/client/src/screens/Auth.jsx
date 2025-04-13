import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
    const [login, setLogin] = useState(true);

    return (
        <div className="w-full h-screen bg-mlsa-bg flex items-center justify-center flex-col gap-5">
            <div className="w-2/3 h-2/3 border-2 border-mlsa-sky-blue rounded-md relative overflow-hidden overflow-y-auto shadow-md drop-shadow-lg shadow-mlsa-sky-blue">
                <div className="w-full flex font-bold uppercase gap-2 p-2 pb-4 sticky top-0 bg-mlsa-bg">
                    <div
                        className={`w-1/2 rounded-tl-md flex items-center justify-center py-1 cursor-pointer ${!login
                                ? "bg-mlsa-sky-blue"
                                : "border-2 border-mlsa-sky-blue text-white hover:bg-gray-700"
                            }`}
                        onClick={() => setLogin(false)}
                    >
                        Signup
                    </div>
                    <div
                        className={`w-1/2 rounded-tr-md flex items-center justify-center py-1 cursor-pointer ${login
                                ? "bg-mlsa-sky-blue"
                                : "border-2 border-mlsa-sky-blue text-white hover:bg-gray-700"
                            }`}
                        onClick={() => setLogin(true)}
                    >
                        Login
                    </div>
                </div>
                {login ? <Login /> : <Signup setLogin={setLogin} />}
            </div>
            <ToastContainer />
        </div>
    );
};

export default Auth;