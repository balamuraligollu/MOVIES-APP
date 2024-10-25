import { fetchFromTMDB } from "../../services/tmdb-service.js";
const tvshowCltr = {}

tvshowCltr.getTrendingTvShow = async (req, res) => {
    try {
      const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/tv/day?language=en-US');
      const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
      res.status(200).json({ content: randomMovie });
    } catch (err) {
      console.error(err); 
      res.status(500).json({ error: 'something went wrong' });
    }
  };
  
  tvshowCltr.getTvShowTrailers = async (req, res) => {
      const { id } = req.params;
      try {
          const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
           res.status(200).json({ trailers: data.results });
      } catch (err) {
          console.error(err); 
          res.status(500).json({ error: 'something went wrong' });
      }
  };
  tvshowCltr.getTvShowDetails = async (req, res) => {
      const { id } = req.params;
      try {
          const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
          res.status(200).json({ details: data });
      } catch (err) {
          console.error(err); 
          res.status(500).json({ error: 'something went wrong' });
      }
  };
  
  tvshowCltr.getSimilarTvShow = async (req, res) => {
      const { id } = req.params;
      try {
          const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
          res.status(200).json({ similar: data });
      } catch (err) {
          console.error(err); 
          res.status(500).json({ error: 'something went wrong' });
      }
  };
  tvshowCltr.getTvShowByCategory = async (req, res) => {
      const { category } = req.params;
      try {
          const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
           res.status(200).json({ category: data });
      } catch (err) {
          console.error(err); 
          res.status(500).json({ error: 'something went wrong' });
      }
  };

export default tvshowCltr