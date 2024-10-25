import { fetchFromTMDB } from "../../services/tmdb-service.js";
import User from "../models/user-model.js";
const searchCltr={}
const API_KEY = 'b931b95a04dd874864cbe57383d21a76';

searchCltr.searchPerson = async (req, res) => {
    const { query } = req.params;
    console.log('Search Query:', query);

    try {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `https://api.themoviedb.org/3/search/person?query=${encodedQuery}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`;
        console.log('API URL:', apiUrl);

        const response = await fetchFromTMDB(apiUrl);
        console.log('TMDB Response:', response);

        if (!response || !response.results || response.results.length === 0) {
            return res.status(404).json({ error: 'Person not found' });
        }

        if (!req.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {
                $push: {
                    searchHistory: {
                        id: response.results[0].id,
                        image: response.results[0].profile_path,
                        title: response.results[0].name,
                        searchType: 'person',
                        createdAt: new Date(),
                    },
                },
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ content: response.results });
    } catch (err) {
        console.error('Error in searchPerson:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

searchCltr.searchMovie = async (req, res) => {
    const { query } = req.params;
    console.log('Search Query:', query);

    try {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `https://api.themoviedb.org/3/search/movie?query=${encodedQuery}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`;
        console.log('API URL:', apiUrl);

        const response = await fetchFromTMDB(apiUrl);
        console.log('TMDB Response:', response);

        if (!response || !response.results || response.results.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.userId, {
            $push: {
                searchHistory: {
                    id: response.results[0].id,
                    image: response.results[0].poster_path,
                    title: response.results[0].title,
                    searchType: 'movie',
                    createdAt: new Date(),
                },
            },
        });

        res.status(200).json({ content: response.results });
    } catch (err) {
        console.error('Error in searchMovie:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

searchCltr.searchTv = async (req, res) => {
    const { query } = req.params;
    console.log('Search Query:', query);

    try {
        const encodedQuery = encodeURIComponent(query);
        const apiUrl = `https://api.themoviedb.org/3/search/tv?query=${encodedQuery}&include_adult=false&language=en-US&page=1&api_key=${API_KEY}`;
        console.log('API URL:', apiUrl);

        const response = await fetchFromTMDB(apiUrl);
        console.log('TMDB Response:', response);

        if (!response || !response.results || response.results.length === 0) {
            return res.status(404).json({ error: 'TV show not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(req.userId, {
            $push: {
                searchHistory: {
                    id: response.results[0].id,
                    image: response.results[0].poster_path,
                    title: response.results[0].name,
                    searchType: 'tv',
                    createdAt: new Date(),
                },
            },
        });

        res.status(200).json({ content: response.results });
    } catch (err) {
        console.error('Error in searchTv:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

searchCltr.getSearchHistory = async (req, res) => {
    try {
        const userId = req.userId;
        console.log('User ID from request:', userId); // Log the user ID

        if (!userId) {
            return res.status(400).json({ error: 'User ID is missing' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ history: user.searchHistory });
    } catch (err) {
        console.error('Error in getSearchHistory:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

searchCltr.removeItemFromSearchHistory = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const itemToRemove = user.searchHistory.find(item => item.id === Number(id));

        if (!itemToRemove) {
            return res.status(404).json({ error: 'Item not found in search history' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { searchHistory: { id: Number(id) } } },
            { new: true }
        );

        res.status(200).json({
            removedItem: itemToRemove,
            updatedSearchHistory: updatedUser.searchHistory
        });
    } catch (err) {
        console.error('Error in removeItemFromSearchHistory:', err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};


export default searchCltr;
