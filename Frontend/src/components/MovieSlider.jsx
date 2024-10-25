import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { SMALL_IMG_BASE_URL } from "../../utils/constants";
import { useContentStore } from "../store/content";

const MovieSlider = ({ category }) => {
    const { contentType } = useContentStore();
    const [content, setContent] = useState([]);
    const [showArrows, setShowArrows] = useState(false);

    const sliderRef = useRef(null);

    // Format the category name
    const formattedCategoryName = category.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
    const formattedContentType = contentType === "movies" ? "Movies" : "TV Shows";

    useEffect(() => {
        const getContent = async () => {
            try {
                const res = await axios.get(`/api/${contentType}/${category}`, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                
                setContent(res.data.category.results || []);
            } catch (error) {
                console.error("Error fetching content:", error);
            }
        };
        getContent();
    }, [contentType, category]);

    const scrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: 'smooth' });
        }
    };

    const scrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: 'smooth' });
        }
    };

    return (
        <div
            className="bg-black text-white relative px-5 md:px-20"
            onMouseEnter={() => setShowArrows(true)}
            onMouseLeave={() => setShowArrows(false)}
        >
            <h2 className="mb-4 text-2xl font-bold"> 
                {formattedCategoryName} - {formattedContentType}
            </h2>
            <div className="flex space-x-4 overflow-x-scroll scrollbar-hide" ref={sliderRef}>
                {Array.isArray(content) && content.length > 0 ? (
                    content.map((item) => {
                        const imageUrl = item.backdrop_path ? `${SMALL_IMG_BASE_URL}${item.backdrop_path}` : 'https://via.placeholder.com/250';
                        
                        return (
                            <Link to={`/watch/${item.id}`} className="min-w-[250px] relative group" key={item.id}>
                                <div className="rounded-lg overflow-hidden">
                                    <img 
                                        src={imageUrl} 
                                        alt={item.title || item.name || "Movie image"}
                                        className="transition-transform duration-300 ease-in-out group-hover:scale-125"
                                    />
                                </div>
                                <p className="mt-2 text-center">
                                    {item.title || item.name}
                                </p>
                            </Link>
                        );
                    })
                ) : (
                    <p>No content available</p>
                )}
            </div>
            {showArrows && content.length > 3 && ( // Show arrows only if there's enough content to scroll
                <>
                    <button 
                        onClick={scrollLeft}
                        className="absolute top-1/2 -translate-y-1/2 left-5 md:left-24 flex items-center justify-center 
                        rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
                    >
                        <ChevronLeft size={24}/>
                    </button>
                    <button 
                        onClick={scrollRight}
                        className="absolute top-1/2 -translate-y-1/2 right-5 md:right-24 flex items-center justify-center 
                        rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10"
                    >
                        <ChevronRight size={24}/>
                    </button>
                </>
            )}
        </div>
    );
};

export default MovieSlider;
