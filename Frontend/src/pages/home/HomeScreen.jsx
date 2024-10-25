import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Play, Info } from "lucide-react";
import Navbar from "../../components/Navbar";
import MovieSlider from "../../components/MovieSlider";
import useGetTrendingContent from "../../hooks/useGetTrendingContent";
import { MOVIE_CATEGORIES, ORIGINAL_IMG_BASE_URL, TV_CATEGORIES } from "../../../utils/constants";
import { useAuthStore } from "../../store/authUser";
import { useContentStore } from "../../store/content";

// Component for the Play button
const PlayButton = ({ trendingContent, userHasPaid }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const handlePlay = () => {
        const contentId = trendingContent.id || 'defaultContentId';
        if (userHasPaid) {
            navigate(`/watch/${contentId}`);
        } else {
            navigate(`/payment/${user._id}?productName=subscription&amount=1000&contentId=${contentId}`);
        }
    };

    return (
        <button
            onClick={handlePlay}
            className="flex items-center bg-white text-black font-bold py-2 px-6 rounded hover:bg-white/80 transition-all duration-300"
        >
            <Play className="w-5 h-5 inline-block mr-2" />
            Play
        </button>
    );
};

// HomeScreen component
export default function HomeScreen() {
    const navigate = useNavigate();
    const { trendingContent } = useGetTrendingContent();
    const { contentType } = useContentStore();
    const { user } = useAuthStore();
    const [hasPaid, setHasPaid] = useState(false);
    const [uploadedContent, setUploadedContent] = useState([]); // State for uploaded content
    const [loadingUploadedContent, setLoadingUploadedContent] = useState(false); // Loading state for uploaded content

    useEffect(() => {
        if (user) {
            const localPaymentStatus = localStorage.getItem(`paymentStatus_${user._id}`);
            setHasPaid(localPaymentStatus === 'success');
        }
    }, [user]);

    // Fetch uploaded content
    // Fetch uploaded content
useEffect(() => {
    const fetchUploadedContent = async () => {
        setLoadingUploadedContent(true);
        try {
            const response = await axios.get('http://localhost:3057/admin/content', { // Ensure the URL is correct
                headers: {
                    Authorization: localStorage.getItem('token'), // Add token for auth
                },
            });
    
            // Log the response to ensure it's a valid JSON array
            console.log("Uploaded Content Response:", response.data);
    
            if (Array.isArray(response.data)) {
                setUploadedContent(response.data); // Update state if response is an array
            } else {
                console.warn("Uploaded content is not an array", response.data);
                setUploadedContent([]); // Reset to empty array if response is not valid
            }
        } catch (error) {
            console.error("Error fetching uploaded content:", error);
            setUploadedContent([]); // Reset to an empty array on error
        } finally {
            setLoadingUploadedContent(false);
        }
    };

    fetchUploadedContent();
}, []);

    

    if (!trendingContent) {
        return (
            <div className="h-screen text-white relative">
                <Navbar />
                <div className="absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer">
                    <p>Loading trending content...</p>
                </div>
            </div>
        );
    }

    const title = trendingContent.title || trendingContent.name || 'Untitled';
    const releaseYear = trendingContent.release_date
        ? new Date(trendingContent.release_date).getFullYear()
        : trendingContent.first_air_date
            ? new Date(trendingContent.first_air_date).getFullYear()
            : 'N/A';
    const ageRating = trendingContent.adult ? '18+' : 'PG-13';
    const overview = trendingContent.overview.length > 200
        ? `${trendingContent.overview.slice(0, 200)}...`
        : trendingContent.overview;

    return (
        <>
            <div className="relative h-screen text-white">
                <Navbar />
                <img
                    src={`${ORIGINAL_IMG_BASE_URL}${trendingContent.backdrop_path}`}
                    alt="Hero img"
                    className="absolute top-0 left-0 w-full h-full object-cover -z-50"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black/50 -z-10">
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-32">
                        <div className="max-w-2xl">
                            <h1 className="mt-4 text-6xl font-extrabold">{title}</h1>
                            <p className="mt-2 text-lg">{releaseYear} | {ageRating}</p>
                            <p className="mt-4 text-lg">{overview}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-0 mt-0 px-8 bg-black md:px-16 lg:px-32">
                <PlayButton trendingContent={trendingContent} userHasPaid={hasPaid} />
                <Link
                    to={`/info/${trendingContent.id}`}
                    className="flex items-center bg-gray-500/70 text-white py-2 px-6 rounded hover:bg-gray-500 transition-all duration-300"
                >
                    <Info className="w-5 h-5 inline-block mr-2" />
                    More Info
                </Link>
            </div>

            {/* Uploaded Content Section */}
            <div className="flex flex-col gap-10 bg-black py-10">
                {contentType === "movies"
                    ? MOVIE_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)
                    : TV_CATEGORIES.map((category) => <MovieSlider key={category} category={category} />)}

                {/* Display uploaded content */}
                // Inside the HomeScreen component
            <div className="px-8 md:px-16 lg:px-32">
                 <h2 className="text-2xl font-bold text-white mb-4">Uploaded Content</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {loadingUploadedContent ? (
                 <p className="text-white">Loading uploaded content...</p>
                 ) : Array.isArray(uploadedContent) && uploadedContent.length > 0 ? (
                   uploadedContent.map((content) => (
                 <div key={content._id} className="bg-gray-800 p-4 rounded-lg">
                    <img src={`http://localhost:3057${content.image}`} alt={content.contentName} />
                    <h3 className="text-white font-bold">{content.contentName}</h3>
                    <div>
                        <div>
                            {(user && (user.role === 'admin')) && (
                             <Link to={`/upload/${content._id}`}>Edit</Link>
                          )}
                         </div>
                        </div>
                       </div>
                    ))
                    ) : (
                <p className="text-white">No uploaded content available</p>
                 )}
               </div>
              </div>


            </div>
        </>
    );
}
