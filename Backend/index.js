import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url'; // ES module compatibility

import configureDB from "./config/db.js";
import { checkSchema } from "express-validator";
import userCltr from "./app/controllers/user-cltr.js";
import moviesCltr from "./app/controllers/movie-cltr.js";
import tvshowCltr from "./app/controllers/tvshow-cltr.js";
import searchCltr from "./app/controllers/search-cltr.js";
import paymentCltr from "./app/controllers/payment-cltr.js";
import adminCltr from "./app/controllers/admin-cltr.js";
import { userRegisterSchema, userLoginSchema } from "./app/validators/user-validator.js";
import authenticateUser from "./app/middlewares/authenticate.js";
import upload from './app/middlewares/upload.js'; // For file upload
import authorizeUser from "./app/middlewares/authorizeUser.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3057;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists


app.use(express.json());

// Enable CORS for the frontend
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database configuration
configureDB();

// User authentication routes
app.post("/api/usersMovies/register", checkSchema(userRegisterSchema), userCltr.register);
app.post('/api/usersMovies/login', checkSchema(userLoginSchema), userCltr.login);
app.get('/api/usersMovies/account', authenticateUser, userCltr.account);

// Movie-related routes
app.get('/api/movies/trending', authenticateUser, moviesCltr.getTrendingMovie);
app.get('/api/movies/trailers/:id', authenticateUser, moviesCltr.getMovieTrailers);
app.get('/api/movies/details/:id', authenticateUser, moviesCltr.getMovieDetails);
app.get('/api/movies/similar/:id', authenticateUser, moviesCltr.getSimilarMovies);
app.get('/api/movies/:category', authenticateUser, moviesCltr.getMoviesByCategory);

// TV show-related routes
app.get('/api/tvshows/trending', authenticateUser, tvshowCltr.getTrendingTvShow);
app.get('/api/tvshows/trailers/:id', authenticateUser, tvshowCltr.getTvShowTrailers);
app.get('/api/tvshows/details/:id', authenticateUser, tvshowCltr.getTvShowDetails);
app.get('/api/tvshows/similar/:id', authenticateUser, tvshowCltr.getSimilarTvShow);
app.get('/api/tvshows/:category', authenticateUser, tvshowCltr.getTvShowByCategory);

// Search-related routes
app.get('/api/search/person/:query', authenticateUser, searchCltr.searchPerson);
app.get('/api/search/movies/:query', authenticateUser, searchCltr.searchMovie);
app.get('/api/search/tvshows/:query', authenticateUser, searchCltr.searchTv);
app.get('/api/search/history', authenticateUser, searchCltr.getSearchHistory);
app.delete('/api/search/history/:id', authenticateUser, searchCltr.removeItemFromSearchHistory);

// Payment routes
app.post('/api/payments', paymentCltr.pay); 
app.put('/api/payment/edit/:id', paymentCltr.updatePaymentStatus);
app.get('/api/payment/status/:userId', paymentCltr.getPaymentStatus);

// Admin content upload (Only for authorized admin users)
app.post('/admin/content', authenticateUser, authorizeUser(['admin']), upload.single('image'), adminCltr.createAdminContent);
app.put('/admin/content/:id', authenticateUser, authorizeUser(['admin']), upload.single('image'), adminCltr.updateAdminContent);  
app.get('/admin/content', authenticateUser, adminCltr.getAllAdminContent);
app.get('/admin/content/:id', authenticateUser, adminCltr.getAdminContentById); 
app.delete('/admin/content/:id', authenticateUser, authorizeUser(['admin']), adminCltr.deleteAdminContent);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
