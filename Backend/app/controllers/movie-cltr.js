import { fetchFromTMDB } from "../../services/tmdb-service.js";

const moviesCltr = {};

moviesCltr.getTrendingMovie = async (req, res) => {
  try {
    const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US');
    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
    res.status(200).json({ content: randomMovie });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: 'something went wrong' });
  }
};

moviesCltr.getMovieTrailers = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
         res.status(200).json({ trailers: data.results });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'something went wrong' });
    }
};
moviesCltr.getMovieDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
        res.status(200).json({ details: data });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'something went wrong' });
    }
};

moviesCltr.getSimilarMovies = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
        res.status(200).json({ similar: data });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'something went wrong' });
    }
};
moviesCltr.getMoviesByCategory = async (req, res) => {
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
         res.status(200).json({ category: data });
    } catch (err) {
        console.error(err); 
        res.status(500).json({ error: 'something went wrong' });
    }
};


export default moviesCltr