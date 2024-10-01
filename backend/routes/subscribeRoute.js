import express from "express"
import { subscribe } from "../controllers/subscribeController.js"

const subscribeRouter = express.Router()

subscribeRouter.post('/newsletter', subscribe)

export default subscribeRouter;