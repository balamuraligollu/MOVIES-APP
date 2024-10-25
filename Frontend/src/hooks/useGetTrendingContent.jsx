import axios from "axios";
import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";

const useGetTrendingContent = () => {
    const [trendingContent, setTrendingContent] = useState(null);
    const { contentType } = useContentStore();

    useEffect(() => {
        const getTrendingContent = async () => {
            const endpoint = `/api/${contentType}/trending`;
            console.log(`Fetching trending content from: ${endpoint}`);
            try {
                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });
                setTrendingContent(response.data.content);
            } catch (error) {
                console.error("Error fetching trending content:", error);
            }
        };
        
        getTrendingContent();
    }, [contentType]);

    return { trendingContent };
};

export default useGetTrendingContent;
