import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useContentStore } from "../store/content";
import ReactPlayer from "react-player";
import { ORIGINAL_IMG_BASE_URL, SMALL_IMG_BASE_URL } from "../../utils/constants";

// Format release date
function formatReleaseDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function WatchPage() {
  const { id } = useParams();
  const [trailers, setTrailers] = useState([]);
  const [currentTrailerId, setCurrentTrailerId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({});
  const [similarContent, setSimilarContent] = useState([]);
  const { contentType } = useContentStore();
  const sliderRef = useRef(null);

  // Fetch trailers
  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(`/api/${contentType}/trailers/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setTrailers(res.data.trailers || []); // Default to empty array if undefined
      } catch (error) {
        handleFetchError(error, "trailers");
        setTrailers([]);
      }
    };
    getTrailers();
  }, [contentType, id]);

  // Fetch similar content
  // Fetch similar content
  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(`/api/${contentType}/similar/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        console.log('Similar content response:', res.data); // Debugging the API response
  
        // Ensure you are using the correct key to access the similar content
        const fetchedSimilarContent = res.data.similar.results || []; // Adjust this based on API response structure
        setSimilarContent(fetchedSimilarContent);
      } catch (error) {
        handleFetchError(error, "similar content");
        setSimilarContent([]);
      }
    };
    getSimilarContent();
  }, [contentType, id]);
  


  // Fetch content details
  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axios.get(`/api/${contentType}/details/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        setContent(res.data.details || {}); // Default to empty object if undefined
      } catch (error) {
        handleFetchError(error, "content details");
        setContent({});
      } finally {
        setLoading(false);
      }
    };
    getContentDetails();
  }, [contentType, id]);

  // Error handling function
  const handleFetchError = (error, type) => {
    if (error.response) {
      console.error(`Error fetching ${type}:`, error.response.data);
      if (error.response.status === 404) {
        console.log(`No ${type} found`);
      }
    } else {
      console.error(`Error fetching ${type}:`, error.message);
    }
  };

  // Handlers for next/previous buttons
  const handleNext = () => {
    if (currentTrailerId < trailers.length - 1) {
      setCurrentTrailerId(currentTrailerId + 1);
    }
  };

  const handlePrev = () => {
    if (currentTrailerId > 0) {
      setCurrentTrailerId(currentTrailerId - 1);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -sliderRef.current.offsetWidth, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="bg-black min-h-screen text-white">
        <div className="mx-auto container px-4 py-8 h-full">
          <Navbar />
          {trailers.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <button
                className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                  currentTrailerId === 0 ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={currentTrailerId === 0}
                onClick={handlePrev}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                  currentTrailerId === trailers.length - 1
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                disabled={currentTrailerId === trailers.length - 1}
                onClick={handleNext}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
          <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
            {trailers.length > 0 ? (
              <ReactPlayer
                controls={true}
                width={"100%"}
                height={"70vh"}
                className="mx-auto overflow-hidden rounded-lg"
                url={`https://www.youtube.com/watch?v=${trailers[currentTrailerId]?.key}`} // Optional chaining for safety
              />
            ) : (
              <h2 className="text-xl text-center mt-5">
                No trailers available for{" "}
                <span className="font-bold text-red-600">
                  {content?.title || content?.name}
                </span>
              </h2>
            )}
          </div>
          {/* movie details */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-20 max-w-6xl mx-auto">
            <div className="mb-4 md:mb-0">
              <h2 className="text-5xl font-bold text-balance">
                {content?.title || content?.name}
              </h2>
              <p className="mt-2 text-lg">
                {formatReleaseDate(content?.release_date || content?.first_air_date)}
                {" | "}
                {content?.adult ? (
                  <span className="text-red-600">18+</span>
                ) : (
                  <span className="text-green-600">PG-13</span>
                )}
              </p>
              <p className="mt-4 text-lg">{content?.overview}</p>
            </div>
            <img
              src={content.poster_path ? ORIGINAL_IMG_BASE_URL + content.poster_path : "fallback-image.jpg"}
              alt="Poster image"
              className="max-h-[600px] rounded-md"
            />
          </div>

          {/* Similar content */}
          <div className="mt-12 max-w-5xl mx-auto relative">
            <h3 className="text-3xl font-bold mb-4">Similar Movies/TV Shows</h3>
            <div className="flex overflow-x-scroll scrollbar-hide gap-4 pb-4" ref={sliderRef}>
            {similarContent && similarContent.length > 0 ? (
  similarContent.map((item) => (
    <Link key={item.id} to={`/watch/${item.id}`} className="w-52 min-w-[200px]">
      <img
        src={item.poster_path ? SMALL_IMG_BASE_URL + item.poster_path : "fallback-image.jpg"}
        alt={item.title || item.name}
        className="w-full h-auto rounded-md"
      />
      <h4 className="mt-2 text-lg font-semibold">
        {item.title || item.name}
      </h4>
    </Link>
  ))
) : (
  <p className="text-xl">No similar content found.</p>
)}

            </div>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2"
              onClick={scrollLeft}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2"
              onClick={scrollRight}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
