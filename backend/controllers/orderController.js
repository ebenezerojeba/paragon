import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Paystack from "paystack";
import { v4 as uuidv4 } from 'uuid';

import Flutterwave from "flutterwave-node-v3";
import dotenv from 'dotenv'
import { orderConfirmation } from "../emails/orderConfirmation.js";
import { transporter } from "../emails/transporter.js";

dotenv.config()

// Placing orders using COD Method
// const placeOrder = async (req, res) => {
//   try {
//     const { userId, items, amount, address, deliveryFee } = req.body;

//     const orderData = {
//       userId,
//       items,
//       address: {
//         ...address,
//         state: address.state, // Include state
//         lga: address.lga,     // Include LGA
//       },
//       deliveryFee,
//       amount,
//       paymentMethod: "cod",
//       payment: false,
//       date: Date.now(),
//     };
//     const newOrder = new orderModel(orderData);

//     await newOrder.save();

//     await userModel.findByIdAndUpdate(userId, { cartData: {} });

//     res.json({ success: true, message: "Order Placed" });
//   } catch (error) {
//     console.log(error);
//     res.json({ succcess: false, message: error.message });
//   }
// };

const placeOrder = async (req, res) => {
  try {
    console.log('Starting placeOrder function');
    const { userId, items, amount, address, deliveryFee } = req.body;
    console.log('Order details:', { userId, items, amount, address, deliveryFee });

    // Fetch user details to get userEmail and userName
    console.log('Fetching user details');
    const user = await userModel.findById(userId);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userEmail = user.email;
    const userName = user.name;
    console.log('User details:', { userEmail, userName });

    const orderData = {
      userId,
      items,
      amount,
      deliveryFee,
      address: {
        ...address,
        state: address.state,
        lga: address.lga,
      },
      paymentMethod: "cod",
      payment: false,
      date: Date.now(),
    };
    
    console.log('Creating new order');
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    console.log('New order saved:', newOrder._id);

    console.log('Updating user cart');
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log('User cart updated');

    // Create email content
    console.log('Creating email content');
    const emailHtml = orderConfirmation(userName, newOrder._id, items, amount);

    const sendOrder = async () => {
      console.log('Sending confirmation email to user');
      try {
        const info = await transporter.sendMail({
          from: '"Paragon Hub" <no-reply@paragonhub.com>',
          to: userEmail,
          subject: 'Order Confirmation - Paragon Hub',
          html: emailHtml,
        });
        console.log('Confirmation email sent:', info.messageId);
      } catch (error) {
        console.error("Error sending confirmation email:", error);
        // Don't return here, continue with the function
      }
    };

    console.log('Calling sendOrder function');
    await sendOrder();

    const sendAdmin = async () => {
      console.log('Sending notification email to admin');
      try {
        const info = await transporter.sendMail({
          from: '"Paragon Hub" <no-reply@paragonhub.com>',
          to: 'ojebaebenezer@gmail.com',
          subject: `New Order Placed - Order ID: ${newOrder._id}`,
          html: `
            <h1>New Order Received</h1>
            <p>A new order has been placed with the following details:</p>
            <p><strong>Order ID:</strong> ${newOrder._id}</p>
            <p><strong>User:</strong> ${userName} (${userEmail})</p>
            <p><strong>Total Amount:</strong> ₦${amount}</p>
            <p><strong>Delivery Fee:</strong> ₦${deliveryFee}</p>
            <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
            <p><strong>Items:</strong></p>
            <ul>
              ${items.map(item => `<li>${item.name} - ${item.quantity} x ₦${item.price}</li>`).join('')}
            </ul>
          `,
        });
        console.log('Admin notification email sent:', info.messageId);
      } catch (error) {
        console.error("Error sending admin notification email:", error);
        // Don't return here, continue with the function
      }
    };

    console.log('Calling sendAdmin function');
    await sendAdmin();

    console.log('Order process completed successfully');
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error('Error in placeOrder function:', error);
    res.status(500).json({ success: false, message: error.message });
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
