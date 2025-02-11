 import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Paystack from "paystack";
import { v4 as uuidv4 } from "uuid";

import Flutterwave from "flutterwave-node-v3";
import dotenv from "dotenv";
import { orderConfirmation } from "../emails/orderConfirmation.js";
import { transporter } from "../emails/transporter.js";

dotenv.config();

// Placing order from frontend
const placeOrder = async (req, res) => {
  try {
    console.log("Starting placeOrder function");
    const { userId, items, amount, address, deliveryFee } = req.body;
    console.log("Order details:", { items, amount, address, deliveryFee });

    // Fetch user details to get userEmail and userName
    console.log("Fetching user details");
    const user = await userModel.findById(userId);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userEmail = address.email;
    const userName = address.firstName + " " + address.lastName;
    const userAddress =
      address.address + " " + address.lga + " " + address.state;
      const userPhone = address.phone;
    const paymentMethod = "Cash On Delivery"


    console.log("User details:", { userEmail, userName, userAddress, userPhone });

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

    console.log("Creating new order");
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    console.log("New order saved:", newOrder._id);

    console.log("Updating user cart");
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log("User cart updated");

    // Create email content
    console.log("Creating email content");
    const emailHtml = orderConfirmation({
      userName,
      orderId: newOrder._id,
      items,
      amount,
      deliveryFee, 
      userAddress,
      userPhone,
      paymentMethod

    });

    // Send Email to user
    const sendOrder = async () => {
      console.log("Sending confirmation email to user");
      try {
        const info = await transporter.sendMail({
          from: '"Paragon Hub" <no-reply@paragonhub.com>',
          to: userEmail,
          subject: "Order Confirmation - Paragon Hub",
          html: emailHtml,
        });
        console.log("Confirmation email sent:", info.messageId);
      } catch (error) {
        console.error("Error sending confirmation email:", error);
        // Don't return here, continue with the function
      }
    };

    console.log("Calling sendOrder function");
    await sendOrder();

    // Send Email to Admin
    const sendAdmin = async () => {
      console.log("Sending notification email to admin");
      try {
        const info = await transporter.sendMail({
          from: '"Paragon Hub" <no-reply@paragonhub.com>',
          to: "ojebaebenezer@gmail.com",
          subject: `New Order Placed - Order ID: ${newOrder._id}`,
          html: `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 8px; max-width: 600px; margin: auto;">
    <h1 style="color: #4CAF50; font-size: 24px;">New Order Received</h1>
    <p style="font-size: 16px;">A new order has been placed with the following details:</p>
    
    <p><strong>Order ID:</strong> <span style="color: #333;">${
      newOrder._id
    }</span></p>
    <p><strong>Name:</strong> <span style="color: #555;">${userName}</span></p>
    <p><strong>Email:</strong> <span style="color: #555;">${userEmail}</span></p>
    <p><strong>Address:</strong> <span style="color: #555;">${userAddress}</span></p>
    
    <p><strong>Total Amount:</strong> <span style="color: #4CAF50;">₦${amount.toLocaleString()}</span></p>
    <p><strong>Delivery Fee:</strong> <span style="color: #FF5722;">₦${deliveryFee.toLocaleString()}</span></p>
    <p><strong>Payment Method:</strong> <span style="color: #555;">${
      orderData.paymentMethod
    }</span></p>
    
    <p style="margin-top: 20px; font-size: 16px;"><strong>Items:</strong></p>
    <ul style="list-style-type: none; padding: 0; margin: 0;">
      ${items
        .map(
          (item) => `
            <li style="border-bottom: 1px solid #eee; padding: 8px 0;">
              <strong>${item.size}</strong> — ${item.name} 
              (x${
                item.quantity
              }) — <span style="color: #4CAF50;">₦${item.price.toLocaleString()}</span>
            </li>`
        )
        .join("")}
    </ul>
    
    <p style="margin-top: 20px; font-size: 16px; color: #555;">Thank you for your attention to this order.</p>
  </div>
`,
        });
        console.log("Admin notification email sent:", info.messageId);
      } catch (error) {
        console.error("Error sending admin notification email:", error);
        // Don't return here, continue with the function
      }
    };

    console.log("Calling sendAdmin function");
    await sendAdmin();

    console.log("Order process completed successfully");
    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.error("Error in placeOrder function:", error);
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

    const callback_url = `http:localhost:5173/verify?orderId=${newOrder._id}&reference=${reference}`;

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
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to place order. Please try again.",
      });
  }
};

const verifyPaystack = async (req, res) => {
  const { orderId, reference } = req.query; // Get the reference from the query string

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
      res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Payment verification error. Please try again.",
      });
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
