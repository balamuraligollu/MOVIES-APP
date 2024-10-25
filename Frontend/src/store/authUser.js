import axios from 'axios';
import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

    signup: async (credentials) => {
        set({ isSigningUp: true });
        try {
            const response = await axios.post("/api/usersMovies/register", credentials);
            set({ isSigningUp: false });
            toast.success('Account created successfully');
        } catch (error) {
            set({ isSigningUp: false });
            throw error; // Ensure this throws to be caught in the SignupPage
        }
    },
    
    // authUser.js
login: async (credentials, navigate) => {
    set({ isLoggingIn: true });
    try {
        const response = await axios.post("/api/usersMovies/login", credentials);
        const token = response.data.token; // Adjust according to your API response structure
        localStorage.setItem('token', token); // Save the token to localStorage

        // Fetch user details after logging in
        const userResponse = await axios.get("/api/usersMovies/account", {
            headers: {
                Authorization: localStorage.getItem('token') // Use the token to fetch user details
            },
        });
        
        set({ user: userResponse.data, isLoggingIn: false,userHasPayed:false }); // Store user data
        toast.success('Logged in successfully');
        
        // Navigate to the home page
        navigate('/');
    } catch (error) {
        set({ isLoggingIn: false });
        toast.error(error.response?.data?.message || 'Login failed'); // Show error message
        throw error; 
    }
},

    

logout: (navigate) => {
    set((state) => {
        localStorage.removeItem('token'); // Remove the token from localStorage
        localStorage.removeItem(`paymentStatus_${state.user?._id}`); // Access user._id safely
        return { user: null }; // Clear user data
    });
    
    toast.success('Logged out successfully');
    navigate('/');
},


    authCheck: async () => {
        set({ isCheckingAuth: true });
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
    
        if (!token) {
            set({ user: null, isCheckingAuth: false });
            return; // Exit if no token
        }
    
        try {
            const response = await axios.get("/api/usersMovies/account", {
                headers: {
                    Authorization: token, // Use the token from localStorage
                },
            });
    
            set({ user: response.data, isCheckingAuth: false }); // Set user data
        } catch (error) {
            console.error('Error during auth check:', error);
            set({ user: null, isCheckingAuth: false }); // Reset user state
            if (error.response && error.response.status === 401) {
                toast.error('Unauthorized access, please log in again.'); // Show error for unauthorized access
            }
        }
    }
    
}));
