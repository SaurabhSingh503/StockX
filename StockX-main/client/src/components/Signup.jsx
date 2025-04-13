import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

const Signup = ({ setLogin }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        address: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validatePassword = (password) => {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!validatePassword(formData.password)) {
            toast.error(
                "Password must be at least 6 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character."
            );
            return;
        }

        try {
            await axios.post(
                `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/api/auth/signup`,
                formData
            );
            toast.success("Signup successful! Check your email for your unique code.");
            setLogin(true); // Switch to Login tab
        } catch (err) {
            console.error(err.response.data.errors || err.response.data.message);
            toast.error(err.response.data.message || "Signup failed");
        }
    };

    return (
        <form className="w-full h-full p-2 mb-2" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-4 overflow-hidden">
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Store Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Store Name"
                        className="text-white w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                    <label className="text-white font-bold">Contact Number</label>
                    <input
                        type="text"
                        name="contactNumber"
                        placeholder="Contact Number"
                        className="text-white w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Address</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="text-white w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.address}
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
                            className="w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
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
                <div className="flex flex-col gap-1">
                    <label className="text-white font-bold">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        className="text-white w-full p-2 border-2 border-mlsa-sky-blue bg-transparent rounded-md"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-mlsa-sky-blue py-1 rounded-md font-bold uppercase text-black transition ease-in-out duration-100 hover:bg-[#1b5555] hover:text-white"
                >
                    Signup
                </button>
            </div>
        </form>
    );
};

// Define required props
Signup.propTypes = {
    setLogin: PropTypes.func.isRequired,
};

export default Signup;