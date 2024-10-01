import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Paystack from "paystack";
import { v4 as uuidv4 } from 'uuid';

import Flutterwave from "flutterwave-node-v3";
import { configDotenv } from "dotenv";
configDotenv()

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address, deliveryFee } = req.body;

    const orderData = {
      userId,
      items,
      address: {
        ...address,
        state: address.state, // Include state
        lga: address.lga,     // Include LGA
      },
      deliveryFee,
      amount,
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);

    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ succcess: false, message: error.message });
  }
};

// Initialize payment gateways

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);

const placeOrderPaystack = async (req, res) => {
  try {
    // Destructure and validate request body
    const { userId, items, amount, address, deliveryFee } = req.body;

    // Validate required fields (implement validation as needed)

    // Generate a unique reference
    const reference = uuidv4();

    const orderData = {
      userId,
      items,
      address: {
        ...address,
        state: address.state,
        lga: address.lga,
      },
      amount,
      deliveryFee,
      paymentMethod: "Online",
      payment: false,
      date: Date.now(),
      reference, // Store reference in the order for later verification
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const callback_url = `${process.env.FRONTEND_URL}/verify?orderId=${newOrder._id}&reference=${reference}`;

    // Initialize Paystack transaction
    const paystackTransaction = await paystack.transaction.initialize({
      amount: Math.round(amount * 100), // Ensure amount is an integer
      email: address.email,
      reference,
      callback_url,
    });

    res.json({
      success: true,
      authorization_url: paystackTransaction.data.authorization_url,
      reference, // Optionally send reference to the client
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Failed to place order. Please try again." });
  }
};

const verifyPaystack = async (req, res) => {
  const {orderId, reference } = req.query; // Get the reference from the query string

  try {
    const paystackResponse = await paystack.transaction.verify(reference);

    if (paystackResponse.data.status === "success") {
      // Update the order payment status to true
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      const order = await orderModel.findById(orderId);
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} }); // Clear user's cart
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Payment verification error. Please try again." });
  }
};


const flutterwave = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY,
  process.env.FLUTTERWAVE_SECRET_KEY
);
// 
// const placeOrderPaystack = async (req, res) => {
  // try {
    // const { userId, items, amount, address, deliveryFee } = req.body;
    // const { origin } = req.headers;
// 
    // const orderData = {
      // userId,
      // items,
      // address: {
        // ...address,
        // state: address.state, // Include state
        // lga: address.lga,     // Include LGA
      // },
      // amount,
      // deliveryFee,
      // paymentMethod: "Online",
      // payment: false,
      // date: Date.now(),
    // };
// 
    // const newOrder = new orderModel(orderData);
    // await newOrder.save();
// 
    // const paystackTransaction = await paystack.transaction.initialize({
      // amount: amount * 100, // Paystack expects amount in kobo
      // email: address.email,
      // reference: newOrder._id.toString(),
      // callback_url: `${origin}/verify?orderId=${newOrder._id}`,
    // });
// 
    // res.json({
      // success: true,
      // order: paystackTransaction.data.authorization_url,
    // });
  // } catch (error) {
    // console.error("Error placing order:", error);
    // res.status(500).json({ success: false, message: "Failed to place order. Please try again." });
  // }
// };
// 
// const verifyPaystack = async (req, res) => {
  // const { reference } = req.query; // Get the reference from the query string
// 
  // try {
    // const paystackResponse = await paystack.transaction.verify(reference);
// 
    // if (paystackResponse.data.status === "success") {
      // Update the order payment status to true
      // await orderModel.findByIdAndUpdate(reference, { payment: true });
      // const order = await orderModel.findById(reference);
      // await userModel.findByIdAndUpdate(order.userId, { cartData: {} }); // Clear user's cart
      // res.json({ success: true, message: "Payment verified successfully" });
    // } else {
      // await orderModel.findByIdAndDelete(reference);
      // res.status(400).json({ success: false, message: "Payment verification failed" });
    // }
  // } catch (error) {
    // console.error("Error verifying payment:", error);
    // res.status(500).json({ success: false, message: "Payment verification error. Please try again." });
  // }
// };


// Placing orders using Flutterwave
const placeOrderFlutterwave = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Flutterwave",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const flutterwavePayload = {
      tx_ref: newOrder._id.toString(),
      amount: amount,
      currency: "NGN",
      redirect_url: `${origin}/verify?orderId=${newOrder._id}`,
      customer: {
        email: address.email,
        phonenumber: address.phone,
        name: `${address.firstName} ${address.lastName}`,
      },
      customizations: {
        title: "Your E-commerce Store",
        logo: "https://your-logo-url.com",
      },
    };

    const flutterwaveResponse = await flutterwave.Charge.card(
      flutterwavePayload
    );
    res.json({ success: true, payment_link: flutterwaveResponse.data.link });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Flutterwave payment
const verifyFlutterwave = async (req, res) => {
  const { transaction_id, tx_ref } = req.query;

  try {
    const flutterwaveResponse = await flutterwave.Transaction.verify({
      id: transaction_id,
    });

    if (flutterwaveResponse.data.status === "successful") {
      await orderModel.findByIdAndUpdate(tx_ref, { payment: true });
      const order = await orderModel.findById(tx_ref);
      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      await orderModel.findByIdAndDelete(tx_ref);
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ succcess: false, message: error.message });
  }
};
// User Order Data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ succcess: false, message: error.message });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ succcess: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderPaystack,
  placeOrderFlutterwave,
  allOrders,
  userOrders,
  updateStatus,
  verifyPaystack,
  verifyFlutterwave,
};
