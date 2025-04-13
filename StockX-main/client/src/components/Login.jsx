import { useState } from "react";
import axios from "../../../server/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        uniqueCode: ""
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/auth/login`, formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("storeEmail", formData.email);
            toast.success("Login successful!");
            navigate("/");
        } catch (err) {
            console.error(err.response.data.errors || err.response.data.message);
            toast.error(err.response.data.message || "Login failed");
        }
    };

    return (
        <form className="w-full h-full p-2 mb-2" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-4 overflow-hidden">
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="text-white w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Unique Code</label>
                    <input
                        type="text"
                        name="uniqueCode"
                        placeholder="Unique Code"
                        className="text-white w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.uniqueCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="text-white w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {showPassword ? (
                            <EyeSlashIcon
                                className="absolute right-2 top-2.5 w-6 h-6 text-white cursor-pointer"
                                onClick={() => setShowPassword(false)}
                            />
                        ) : (
                            <EyeIcon
                                className="absolute right-2 top-2.5 w-6 h-6 text-white cursor-pointer"
                                onClick={() => setShowPassword(true)}
                            />
                        )}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-mlsa-sky-blue py-1 rounded-md font-bold uppercase text-black transition ease-in-out duration-100 hover:bg-[#1b5555] hover:text-white"
                >
                    Login
                </button>
            </div>
        </form>
    );
};

export default Login;