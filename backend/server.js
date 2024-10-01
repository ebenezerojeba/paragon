import express from 'express'
import cors from 'cors'
import dotenv from "dotenv"
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import subscribeRouter from './routes/subscribeRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
dotenv.config()
connectDB()
connectCloudinary()

// Middleware
app.use(express.json())
app.use(cors())

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/subscribe', subscribeRouter)




app.get('/',(req,res)=> {
    res.send("Api Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))