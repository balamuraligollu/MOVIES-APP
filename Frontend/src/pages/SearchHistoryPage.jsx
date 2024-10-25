import axios from "axios";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { SMALL_IMG_BASE_URL } from "../../utils/constants";
import Navbar from "../components/Navbar";

// Corrected function name
function formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const month = monthNames[date.getUTCMonth()];
    const day = date.getDate();
    const year = date.getUTCFullYear();

    return `${month} ${day}, ${year}`;
}

export default function SearchHistoryPage() {
    const [searchHistory, setSearchHistory] = useState([]);

    useEffect(() => {
        const getSearchHistory = async () => {
            try {
                const res = await axios.get('/api/search/history', {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setSearchHistory(res.data.history); // Change this to 'history'
            } catch (error) {
                console.log(error.message);
                setSearchHistory([]);
            }
        };
        getSearchHistory();
    }, []);

    const handleDelete = async (entry)=>{
        try{
            await axios.delete(`/api/search/history/${entry.id}`,{
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            })
            setSearchHistory(searchHistory.filter((item)=> item.id !== entry.id))
        }catch(error){
            toast.error("Failed to delete search item")
        }

    }

    // Corrected to use searchHistory.length
    if (searchHistory?.length === 0) {
        return (
            <div className="bg-black min-h-screen text-white">
                <Navbar />
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Search History</h1>
                    <div className="flex justify-center items-center h-96">
                        <p className="text-xl">No search history found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Search History</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchHistory?.map((entry) => (
                        <div key={entry.id} className="bg-gray-800 p-4 rounded flex items-start">
                            <img 
                                src={SMALL_IMG_BASE_URL + entry.image} 
                                alt="History image"
                                className="size-16 rounded-full object-cover mr-4"
                            />
                            <div className="flex flex-col">
                                <span className="text-white text-lg">{entry.title}</span>
                                <span className="text-gray-400 text-sm">{formatDate(entry.createdAt)}</span>
                            </div>
                            <span className={`py-1 px-3 min-w-20 text-center rounded-full text-sm ml-auto 
                                ${entry.searchType === "movie" 
                                    ? "bg-red-600" 
                                    : entry.searchType === "tv" 
                                    ? "bg-blue-600" 
                                    : "bg-green-600"}`}>
                                {entry.searchType[0].toUpperCase()+ entry.searchType.slice(1)}
                            </span>
                            <Trash
                            className="size-S ml-4 cursor-pointer hover:filled-red-600 hover:text-red-600"
                            onClick={()=>{
                                handleDelete(entry)
                            }}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
