import { useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function Success() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const stripeId = localStorage.getItem('stripeId');
                console.log('Retrieved stripeId from localStorage:', stripeId); // Debugging log

                if (stripeId) {
                    await axios.put(`/api/payment/edit/${stripeId}`, { paymentStatus: 'success' });
                    // Store the payment status in localStorage after a successful update
                    const userId = localStorage.getItem('userId'); // Assume you save the userId in localStorage
                    if (userId) {
                        localStorage.setItem(`paymentStatus_${userId}`, 'success'); // Store the payment status
                    }
                } else {
                    console.log('No Stripe ID found in local storage.');
                }
            } catch (err) {
                console.log('Error fetching payment details:', err);
            }
        })();
    }, []);

    const handleNavigateHome = () => {
        const contentId = localStorage.getItem('contentId'); // Assume you save contentId when initiating payment
        navigate(`/watch/${contentId}`); // Redirect to watch page with content ID
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
            style={{ backgroundImage: `url('/404.png')` }}
        >
            <header className="absolute top-0 left-0 p-4 bg-black w-full">
                <Link to={"/"}>
                    <img src="/netflix-logo.png" alt="Netflix" className="h-8" />
                </Link>
            </header>
            <main className="text-center error-page--content z-10">
                <h1 className="text-7xl font-semibold mb-4 text-black-500">Payment is successful</h1>
                <p className="mb-6 text-xl"></p>
                <button 
                    onClick={handleNavigateHome}
                    className="bg-white text-black py-2 px-4 rounded"
                >
                    Go to Watch
                </button>
            </main>
        </div>
    );
}
