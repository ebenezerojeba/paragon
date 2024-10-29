import express from "express"
import { subscribe,getSubscribers, sendMail, deleteSubscriber, sendWelcome } from "../controllers/subscribeController.js"

const subscribeRouter = express.Router()
// POST route for subscribing
subscribeRouter.post('/newsletter', subscribe);

// GET route for fetching subscribers
subscribeRouter.get('/newsletter', getSubscribers);

// Sending emails 
subscribeRouter.post('/send-bulk', sendMail)
subscribeRouter.post('/send-welcome', sendWelcome)

// Unsubscribe
subscribeRouter.delete('/unsubscribe',deleteSubscriber)

export default subscribeRouter;