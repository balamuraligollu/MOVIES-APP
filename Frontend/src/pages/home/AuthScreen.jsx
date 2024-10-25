import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate()

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Check if the email input is empty
        if (email.trim() === '') {
            alert('Please enter a valid email address.'); // You can replace this with a more user-friendly way to show an error
            return; // Prevent navigation if email is empty
        }
        // Navigate only if email is filled, properly format the URL
        navigate(`/signup?email=${encodeURIComponent(email)}`);
    };
    


    return (
        <div className="hero-bg relative">
            {/* Navigation Bar */}
            <header className="max-w-6xl mx-auto flex items-center justify-between p-4 pb-10">
                <img src="/netflix-logo.png" alt="Netflix logo" className="w-52 md:w-52" />

                <Link to="/login" className="text-white bg-red-600 py-1 px-4 rounded hover:bg-red-700">
                    Sign in
                </Link>
            </header>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center text-center py-20 text-white max-w-6xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-2">Unlimited movies, TV shows, and more</h1>
                <p className="text-lg mb-4">Watch anywhere. Cancel anytime.</p>
                <p className="mb-6">Ready to watch? Enter your email to create or restart your membership.</p>

                {/* Form Section */}
                <form className="w-full max-w-lg flex flex-col sm:flex-row items-center justify-center" onSubmit={handleFormSubmit}>
                    <input
                        type="email"
                        className="p-2 rounded flex-1 bg-black/80 border border-gray-700 text-white placeholder-gray-400"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="w-full sm:w-auto bg-red-600 text-white py-2 px-4 flex items-center justify-center rounded-md hover:bg-red-700 mt-4 sm:mt-0 sm:ml-4">
                        Get Started
                        <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                </form>
            </div>

            {/* Separator */}
            <div className="h-2 w-full bg-[#232323]" aria-hidden="true"></div>

            {/* 1st Section */}
            <div className="py-10 bg-black text-white">
                <div className="max-w-6xl mx-auto flex items-center justify-center flex-col md:flex-row px-4 md:px-2">
                    {/* Left Side */}
                    <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Enjoy on your TV</h2>
                        <p className="text-lg md:text-xl">
                            Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
                        </p>
                    </div>
                    {/* Right Side */}
                    <div className="flex-1 relative">
                        <img src="/tv.png" alt="TV" className="z-10 relative w-full" />
                        <video
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] z-0"
                            playsInline
                            autoPlay
                            muted
                            loop
                        >
                            <source src="/hero-vid.m4v" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-2 w-full bg-[#232323]" aria-hidden="true"></div>

            {/* 2nd Section */}
            <div className="py-10 bg-black text-white">
                <div className="max-w-6xl mx-auto flex items-center justify-center flex-col-reverse md:flex-row px-4 md:px-2">
                    {/* Left Side */}
                    <div className="flex-1 relative">
                        <img src="/stranger-things-lg.png" alt="Stranger Things" className="mt-4" />
                        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-black w-3/4 lg:w-1/2 border border-slate-500 rounded-md p-4">
                            <div className="flex items-center gap-4">
                                <img src="/stranger-things-sm.png" alt="Stranger Things Thumbnail" className="h-10" />
                                <div className="flex-1">
                                    <p className="text-lg font-bold">Stranger Things</p>
                                    <p className="text-sm text-blue-500">Downloading...</p>
                                </div>
                                <img src="/download-icon.gif" alt="Downloading Icon" className="h-12" />
                            </div>
                        </div>
                    </div>
                    {/* Right Side */}
                    <div className="flex-1 md:text-left text-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                            Download your shows to watch offline
                        </h2>
                        <p className="text-lg md:text-xl">
                            Save your favorites easily and always have something to watch.
                        </p>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-2 w-full bg-[#232323]" aria-hidden="true"></div>

            {/* 3rd Section */}
            <div className="py-10 bg-black text-white">
                <div className="max-w-6xl mx-auto flex items-center justify-center flex-col md:flex-row px-4 md:px-2">
                    {/* Left Side */}
                    <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Watch everywhere</h2>
                        <p className="text-lg md:text-xl">
                            Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
                        </p>
                    </div>
                    {/* Right Side */}
                    <div className="flex-1 relative overflow-hidden">
                        <img src="/device-pile.png" alt="Device image" className="z-10 relative w-full" />
                        <video
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] z-0 max-w-[63%]"
                            playsInline
                            autoPlay
                            muted
                            loop
                        >
                            <source src="/video-devices.m4v" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-2 w-full bg-[#232323]" aria-hidden="true"></div>

            {/* 4th Section */}
            <div className="py-10 bg-black text-white">
                <div className="max-w-6xl mx-auto flex items-center justify-center flex-col-reverse md:flex-row px-4 md:px-4">
                    {/* Left Side */}
                    <div className="flex-1 relative">
                        <img src="/kids.png" alt="Kids section" className="mt-4" />
                    </div>
                    <div className="flex-1 md:text-left text-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Create profiles for kids</h2>
                        <p className="text-lg md:text-xl">
                            Send kids on adventures with their favorite characters in a space made just for them — free with your membership.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
