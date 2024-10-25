import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from "../store/authUser";

export default function PaymentPage() {
    const { user } = useAuthStore();
    const [searchParams] = useSearchParams();
    const productName = searchParams.get('productName');  
    const amount = searchParams.get('amount');
    const contentId = searchParams.get('contentId'); // Get contentId from URL params
    const [loading, setLoading] = useState(false);
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Check if user is available, if not, navigate to login page
    useEffect(() => {
        if (!user) {
            navigate('/login');  // Redirect to login if user is not authenticated
        }
    }, [user, navigate]);

    const handlePayment = async () => {
        if (!user) return;  // Additional safeguard to ensure user is defined

        setLoading(true);
        setPaymentInitiated(true);
        setError('');
    
        console.log('Payment data:', {
            userId: user._id,
            contentId,
            amount,
            productName,
        });
    
        try {
            const response = await axios.post('/api/payments', {
                userId: user._id,
                contentId,
                amount,
                productName,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            console.log('Payment response:', response.data);  // Log for debugging
            localStorage.setItem('stripeId', response.data.id);  // Store stripeId
            localStorage.setItem('contentId', contentId); // Save contentId for later use
            window.location.href = response.data.url;  // Redirect to Stripe checkout
        } catch (err) {
            console.error('Error processing payment:', err);
            setError('Failed to process payment. Please try again.');
            setPaymentInitiated(false);
        }
    } 
    
    const confirmPayment = () => {
        if (user) {
            localStorage.setItem(`paymentStatus_${user._id}`, 'success');
            const contentId = searchParams.get('contentId'); // Get contentId from URL params
            navigate(`/watch/${contentId}`); // Redirect to watch page after payment
        }
    };

    if (!user) {
        return <p>Loading...</p>;  // Show loading while user data is being fetched
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-4">Payment for {productName}</h1>
            <p className="text-lg mb-4">Amount: ₹{amount}</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {paymentInitiated ? (
                <button
                    onClick={confirmPayment}
                    className="mt-4 bg-blue-500 text-black py-2 px-4 rounded font-bold hover:bg-blue-400 transition-all duration-300"
                >
                    Simulate Payment Success
                </button>
            ) : (
                <button 
                    onClick={handlePayment} 
                    className="bg-green-500 text-black py-2 px-4 rounded font-bold hover:bg-green-400 transition-all duration-300"
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Proceed to Pay'}
                </button>
            )}
        </div>
    );
}
