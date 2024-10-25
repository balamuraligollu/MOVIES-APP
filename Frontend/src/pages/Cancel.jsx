import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';

export default function Cancel() {
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const stripeId = localStorage.getItem('stripeId');
                if (stripeId) {
                    await axios.put(`/api/payment/edit/${stripeId}`, { paymentStatus: 'failed' });
                } else {
                    console.log('No Stripe ID found in local storage.');
                }
            } catch (err) {
                console.log('Error fetching payment details:', err);
            }
        })();
    }, []);

    const handleReturn = () => {
        navigate('/'); // Redirect to watchlist
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
            style={{ backgroundImage: `url('/avatar3.png')` }}
        >
            <header className="absolute top-0 left-0 p-4 bg-black w-full">
                <Link to={"/"}>
                    <img src="/netflix-logo.png" alt="Netflix" className="h-8" />
                </Link>
            </header>
            <main className="text-center error-page--content z-10">
                <h1 className="text-7xl font-semibold mb-4 text-black-500">Payment is Failed</h1>
                <p className="mb-6 text-xl"></p>
                <Link to={"/"} className="bg-white text-black py-2 px-4 rounded">
                    Netflix Home
                </Link>
            </main>
        </div>
    );
}
