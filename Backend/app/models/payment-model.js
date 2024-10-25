import mongoose from "mongoose";
import { Schema, model } from "mongoose";


const paymentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Adjust this to match your User model's name
        required: true
    },
    
    transactionId: { type: String, required: true },  
    productName: { type: String, required: true },  
    amount: { type: Number, required: true },  
    paymentType: { type: String, required: true },  
    paymentStatus: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' }  
},{timestamps:true});

const Payment = model('Payment', paymentSchema);

export default Payment;
