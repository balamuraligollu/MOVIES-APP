import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function UploadEdit() {
    const { id } = useParams(); // Get the ID from the route parameters
    const [contentName, setContentName] = useState('');
    const [file, setFile] = useState(null);
    const [existingImage, setExistingImage] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContentDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3057/admin/content/${id}`, {
                    headers: { Authorization: localStorage.getItem('token') },
                });
                const { contentName, image } = response.data;
                setContentName(contentName);
                setExistingImage(image);
            } catch (error) {
                console.error('Error fetching content details:', error);
                setError('Failed to load content details.');
            }
        };
        fetchContentDetails();
    }, [id]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contentName.trim()) {
            setError('Please provide a content name.');
            return;
        }
        const formData = new FormData();
        formData.append('contentName', contentName);
        if (file) {
            formData.append('image', file);
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized access. Please log in.');
            return;
        }
        try {
            const response = await axios.put(`http://localhost:3057/admin/content/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: token,
                },
            });
            setSuccessMessage(response.data.message);
            setError('');
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Unauthorized access. Please log in.');
            } else {
                setError('Update error. Please try again.');
            }
            console.error('Update error:', error);
        }
    };

    return (
        <div className="hero-bg min-h-screen flex flex-col items-center">
            <header className="w-full max-w-6xl mx-auto flex items-center justify-between p-4">
                <Link to="/">
                    <img src="/netflix-logo.png" alt="Netflix logo" className="w-52 cursor-pointer" />
                </Link>
            </header>
            <div className="flex-grow flex justify-center items-center mt-10 px-3">
                <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
                    <h1 className="text-center text-white text-2xl font-bold mb-4">Edit Content</h1>
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="contentName" className="text-sm font-medium text-gray-300 block">Content Name</label>
                            <input
                                type="text"
                                id="contentName"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                placeholder="Enter content name"
                                value={contentName}
                                onChange={(e) => setContentName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="file" className="text-sm font-medium text-gray-300 block">Upload New Image</label>
                            <input
                                type="file"
                                id="file"
                                accept="image/*"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                onChange={handleFileChange}
                            />
                            {existingImage && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-400">Current Image:</p>
                                    <img
                                        src={`http://localhost:3057${existingImage}`}
                                        alt="Existing content"
                                        className="w-full mt-2 max-h-48 object-cover rounded"
                                    />
                                </div>
                            )}
                        </div>
                        <button type="submit" className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Update Content
                        </button>
                    </form>
                </div>
            </div>
            <footer className="w-full py-4 bg-black/70 text-center text-gray-400">
                &copy; 2023 Your Website. All rights reserved.
            </footer>
        </div>
    );
}
