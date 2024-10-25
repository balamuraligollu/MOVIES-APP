import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function UploadContentPage() {
    const [contentName, setContentName] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!contentName.trim() || !file) {
            setError('Please provide content name and select an image.');
            return;
        }
    
        const formData = new FormData();
        formData.append('contentName', contentName);
        formData.append('image', file);
    
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Unauthorized access. Please log in.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3057/admin/content', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization:localStorage.getItem('token')  // Ensure this is set correctly
                },
            });
    
            setSuccessMessage(response.data.message);
            setContentName('');
            setFile(null);
            setError('');
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setError('Unauthorized access. Please log in.');
            } else {
                setError('Upload error. Please try again.');
            }
            console.error('Upload error:', error);
        }
    };
    
    
    return (
        <div className="h-screen w-full hero-bg">
            <header className="max-w-6xl mx-auto flex items-center justify-between p-4">
                {/* Make the logo a link to the home page */}
                <Link to="/">
                    <img src="/netflix-logo.png" alt="Netflix logo" className="w-52 cursor-pointer" />
                </Link>
            </header>
            <div className="flex justify-center items-center mt-20 mx-3">
                <div className="w-full max-w-md p-8 space-y-6 bg-black/60 rounded-lg shadow-md">
                    <h1 className="text-center text-white text-2xl font-bold mb-4">Upload Content</h1>
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
                            <label htmlFor="file" className="text-sm font-medium text-gray-300 block">Upload Image</label>
                            <input
                                type="file"
                                id="file"
                                accept="image/*"
                                className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button type="submit" className="w-full py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700">
                            Upload
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}