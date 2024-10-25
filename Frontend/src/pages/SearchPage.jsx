import axios from "axios";
import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants";
import Navbar from "../components/Navbar";
import { useContentStore } from "../store/content";

// Search Page component
export default function SearchPage() {
    const [activeTab, setActiveTab] = useState("movies");
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const { setContentType } = useContentStore(); 

    const handleTabClick = (tab) => {
        setActiveTab(tab); // Update active tab
        setContentType(tab === "movies" ? "movies" : tab === "tvshows" ? "tvshows" : "person"); // Update content type in store
        setResults([]); // Clear results on tab change
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`/api/search/${activeTab}/${searchTerm}`, {
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });
            setResults(res.data.content); // Store the results
        } catch (error) {
            toast.error("Failed to fetch search results");
        }
        setSearchTerm(""); // Clear search term after search
    };

    return (
        <div className="bg-black min-h-screen text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center gap-3 mb-4">
                    {/* Movies Tab */}
                    <button
                        onClick={() => handleTabClick("movies")}
                        className={`py-2 px-4 rounded ${activeTab === "movies" ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
                    >
                        Movies
                    </button>
                    {/* TV Shows Tab */}
                    <button
                        onClick={() => handleTabClick("tvshows")}
                        className={`py-2 px-4 rounded ${activeTab === "tvshows" ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
                    >
                        TV Shows
                    </button>
                    {/* Person Tab */}
                    <button
                        onClick={() => handleTabClick("person")}
                        className={`py-2 px-4 rounded ${activeTab === "person" ? "bg-red-600" : "bg-gray-800"} hover:bg-red-700`}
                    >
                        Person
                    </button>
                </div>
                <form className="flex gap-2 items-stretch mb-8 max-w-2xl mx-auto" onSubmit={handleSearch}>
                    <input
                        type="text"
                        className="w-full p-2 rounded bg-gray-800 text-white"
                        placeholder={`Search for ${activeTab}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded">
                        <Search className="size-6" />
                    </button>
                </form>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.map((result) => {
                        // Check if neither path is available
                        if (!result.poster_path && !result.profile_path) return null;

                        return (
                            <div key={result.id} className="p-4 bg-gray-700 rounded">
                                {activeTab === "person" ? (
                                    <Link to={`${result.name}`} className="flex flex-col items-center">
                                        <img 
                                            src={ORIGINAL_IMG_BASE_URL + result.profile_path}
                                            alt={result.name}
                                            className="max-h-96 rounded mx-auto" // Corrected class name
                                        />
                                        <h2 className="mt-2 text-xl font-bold">{result.name}</h2>
                                    </Link>
                                ) : (
                                    <Link to={`/watch/${result.id}`} onClick={()=>{
                                        setContentType(activeTab)

                                    }} className="flex flex-col items-center">
                                        <img 
                                            src={ORIGINAL_IMG_BASE_URL + (result.poster_path || result.profile_path)} // Use poster_path for movies and shows
                                            alt={result.title || result.name}
                                            className="max-h-96 rounded mx-auto" // Corrected class name
                                        />
                                        <h2 className="mt-2 text-xl font-bold">{result.title || result.name}</h2>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
