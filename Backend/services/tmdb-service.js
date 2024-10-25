import axios from "axios";

export const fetchFromTMDB = async (url) => {
  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`, 
    },
  };
  const response = await axios.get(url, options);
  return response.data;
};