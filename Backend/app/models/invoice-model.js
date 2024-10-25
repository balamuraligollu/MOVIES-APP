import { Schema, model } from "mongoose";

const invoiceSchema = new Schema({
    movieName: { type: String, required: true },  // Name of the product
    amount: { type: Number, required: true },  // Total amount for the invoice
    image: { type: String }  // Optional image URL of the product
});

const Invoice = model('Invoice', invoiceSchema);

export default Invoice;
