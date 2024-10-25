import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authUser";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!username.trim() || !password.trim()) {
            setError("Please fill in both fields.");
            return; 
        }

        const credentials = { username, password };

        try {
            // Attempt to log in using the credentials
            await login(credentials, navigate); 
            setUsername("");
            setPassword("");
            setError(""); // Clear error on successful login
        } catch (error) {
            console.error("Login error:", error);
            // Display server-side error message
            if (error.response && error.response.data) {
                const { errors } = error.response.data; // Assuming your server sends errors as an array
                if (Array.isArray(errors)) {
                    setError(errors.map(err => err.msg).join(' ')); // Join multiple error messages
                } else {
                    setError(error.response.data.message || "username/password is wrong."); // Fallback for single message
                }
            } else {
                setError("Network error: Please try again later."); // Network error handling
            }
        }
    };

    return (
        <div className="h-screen w-full hero-bg">
            <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
                <Link to="/">
                    <img src="/netflix-logo.png" alt="Netflix logo" className="w-52" />
                </Link>
            </header>
            <div className="flex justify-center items-center mt-20 mx-3">
                <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
                    <h1 className="text-center text-white text-2xl font-bold mb-4">Login</h1>
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-gray-300 block">Username</label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-300 block">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Login
                        </button>
                    </form>
                    <div className="text-center text-gray-400 mt-4">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-red-500 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
