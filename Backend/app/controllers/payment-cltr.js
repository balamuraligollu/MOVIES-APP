import Stripe from "stripe";
import dotenv from "dotenv";
import Payment from "../models/payment-model.js"; // Adjust the import path as necessary

dotenv.config();

const stripe = new Stripe(process.env.SECRET_KEY);
const paymentCltr = {};

paymentCltr.pay = async (req, res) => {
    const { userId, amount, productName, contentId } = req.body;

    if (!productName) {
        return res.status(400).json({ error: 'Product name is required' });
    }

    try {
        const customer = await stripe.customers.create({
            name: 'Testing', // Static for now, you can use user info later
            address: {
                line1: "India",
                postal_code: '517501',
                city: "Tirupati",
                state: 'AP',
                country: "US"
            }
        });

        // Ensure this is awaited before using the session variable
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'inr',
                    product_data: { name: productName },
                    unit_amount: amount * 100, // Stripe expects the amount in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:5173/success`,
            cancel_url: `http://localhost:5173/cancel`,
            customer: customer.id,
        });

        // Ensure payment is only saved after session is successfully created
        const payment = new Payment({
            user: userId,
            transactionId: session.id,  // session.id is used here after creation
            productName,
            amount: Number(amount),
            contentId,
            paymentType: "card",
            // Initially set status to pending
        });

        await payment.save();

        // Respond with the session ID and session URL for redirection
        res.json({ id: session.id, url: session.url });
    } catch (err) {
        console.error("Error processing payment:", err);
        res.status(500).json({ error: err.message });
    }
};


paymentCltr.updatePaymentStatus = async (req, res) => {
    const { id } = req.params;  // id is expected to be the transactionId
  
    try {
      // Find payment by the transaction ID
      const payment = await Payment.findOne({ transactionId: id });
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found or you're not authorized to edit" });
      }
  
      const body = req.body;
      
      // Update the payment status
      payment.paymentStatus = body.paymentStatus; // Ensure the key matches
  
      await payment.save();
      
      return res.status(200)
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };

  
// Function to get payment status by user ID
paymentCltr.getPaymentStatus = async (req, res) => {
    const  userId  = req.userId; // Get userId from request parameters

    try {
        // Find payment for the user by userId
        const payment = await Payment.findOne({ user: userId });

        if (!payment) {
            return res.status(404).json({ error: "Payment not found" }); // If no payment found, return 404
        }

        // Check if payment status is successful
        if (payment.status === 'success') {
            return res.status(200).json({ status: 'success' }); // Return success status
        } else {
            return res.status(200).json({ status: 'fail' }); // Return fail status if not successful
        }
    } catch (error) {
        console.error("Error retrieving payment status:", error);
        return res.status(500).json({ error: 'Server error' }); // Return server error
    }
};

// Define your route



export default paymentCltr;
