import express from 'express'
import authUser from '../middleware/auth.js'

import adminAuth from '../middleware/adminAuth.js'
import { placeOrder,allOrders,userOrders,updateStatus, placeOrderPaystack, placeOrderFlutterwave, verifyPaystack, verifyFlutterwave,  } from "../controllers/orderController.js";

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Paymetn Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/paystack',authUser,placeOrderPaystack)
orderRouter.post('/flutterwave',authUser,placeOrderFlutterwave)

// User Feature
orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyPaystack', authUser,verifyPaystack)
orderRouter.post('/verifyFlutterwave', authUser,verifyFlutterwave )


export default orderRouter


