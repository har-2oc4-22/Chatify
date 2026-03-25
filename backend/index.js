import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
import rateLimit from "express-rate-limit"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket/socket.js"
import errorHandler from "./middlewares/errorHandler.js"

dotenv.config()

const port=process.env.PORT || 5000
await connectDb()

// 1. Security HTTP headers
app.use(helmet())

// 2. Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// 3. Rate limiting (limit repeated requests to public APIs and/or endpoints)
const limiter = rateLimit({
    max: 100, // limit each IP to 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again in 15 minutes!'
})
app.use('/api', limiter)

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json({ limit: '10kb' })) // Limit body payload
app.use(cookieParser())

app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/message",messageRouter)

// Global Error Handling Middleware should be the last middleware
app.use(errorHandler)

server.listen(port,()=>{
    console.log(`Server started on port ${port} in ${process.env.NODE_ENV || 'development'} mode`)
})