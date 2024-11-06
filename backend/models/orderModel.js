import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {type: String, requried: true},
    items: { type: Array, required: true },
    deliveryFee: { type: Number, required: true },
    amount: { type: Number, required: true },
    address: {
        type: Object, 
        required: true,
        properties: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            addressLine: { type: String, required: true }, // Change this as needed
            state: { type: String, required: true }, // New field for state
            lga: { type: String, required: true }, // New field for LGA
        }
    },
    status: { type: String, required: true, default: 'Order Placed' },
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;

