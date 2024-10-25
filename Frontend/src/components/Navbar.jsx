import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "../store/authUser";
import { useContentStore } from "../store/content";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const { setContentType } = useContentStore(); 

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            logout(navigate);
        }
    };

    return (
        <header className="max-w-6xl mx-auto flex flex-wrap items-center justify-between p-4 h-20">
            <div className="flex items-center gap-10 z-50">
                <Link to="/">
                    <img src="/netflix-logo.png" alt="Netflix logo" className="w-32 sm:w-40" />
                </Link>
                <div className="hidden sm:flex gap-2 items-center">
                    <Link to="/" className="hover:underline" onClick={() => setContentType("movies")}>
                        Movies
                    </Link>
                    <Link to="/" className="hover:underline" onClick={() => setContentType("tvshows")}>
                        TV Shows
                    </Link>
                    <Link to="/history" className="hover:underline">
                        Search History
                    </Link>
                </div>
            </div>
            <div>
            {(user && (user.role === 'admin')) && (
              <Link to="/upload">Upload</Link>
            )}
            </div>

            <div className="flex gap-2 items-center z-50">
                <Link to="/search" aria-label="Search">
                    <Search className="w-6 h-6 cursor-pointer" />
                </Link>
                
                {user && (
                    <img src={user.image} alt="Avatar" className="h-8 rounded cursor-pointer" />
                )}
                <LogOut className="w-6 h-6 cursor-pointer" onClick={handleLogout} aria-label="Logout" />
                <div className="sm:hidden">
                    <Menu className="w-6 h-6 cursor-pointer" onClick={toggleMobileMenu} aria-label="Menu" />
                </div>
            </div>
        

            {isMobileMenuOpen && (
                <div className="w-full sm:hidden mt-4 z-50 bg-black border rounded border-gray-800">
                    <Link to="/" className="block hover:underline p-2" onClick={() => {toggleMobileMenu(); setContentType("movies")}}>
                        Movies
                    </Link>
                    <Link to="/" className="block hover:underline p-2" onClick={() => {toggleMobileMenu(); setContentType("tvshows")}}>
                        TV Shows
                    </Link>
                    <Link to="/history" className="block hover:underline p-2" onClick={toggleMobileMenu}>
                        Search History
                    </Link>
                </div>
            )}
        </header>
    );
}
