import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/authUser";

export default function SignUpPage() {
    const [searchParams] = useSearchParams();
    const emailValue = searchParams.get('email');

    const navigate = useNavigate();
    const { signup } = useAuthStore();

    const [email, setEmail] = useState(emailValue || "");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        // Client-side validation
        if (!email.trim() || !username.trim() || !password.trim()) {
            setError("Please fill in all fields.");
            return;
        }
    const credentials = { email, username, password };
        try {
            await signup(credentials);
            setEmail("");
            setUsername("");
            setPassword("");
            navigate("/login");
        } catch (error) {
            console.error("Signup error:", error);
            if (error.response && error.response.data) {
                const { errors } = error.response.data;
                if (Array.isArray(errors)) {
                    setError(errors.map(err => err.msg).join(' '));
                } else {
                    setError(error.response.data.message || "An error occurred during signup.");
                }
            } else {
                setError("Network error: Please try again later.");
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
                    <h1 className="text-center text-white text-2xl font-bold mb-4">Sign Up</h1>
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-300 block">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder="you@gmail.com"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="text-sm font-medium text-gray-300 block">Username</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder="Username"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-300 block">Password</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder="Password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Sign Up
                        </button>
                    </form>
                    <div className="text-center text-gray-400 mt-4">
                        Already a member?{" "}
                        <Link to="/login" className="text-red-500 hover:underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
