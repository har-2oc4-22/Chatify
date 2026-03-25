import dotenv from "dotenv"
dotenv.config() // Must be FIRST so all env vars are available to all imports below

import express from "express"
import connectDb from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import mongoSanitize from "express-mongo-sanitize"
import rateLimit from "express-rate-limit"
import userRouter from "./routes/user.routes.js"
import messageRouter from "./routes/message.routes.js"
import { app, server } from "./socket/socket.js"

const port = process.env.PORT || 5000
await connectDb()

// Security: disable X-Powered-By header
app.disable('x-powered-by')

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
    max: 100,
    windowMs: 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later.'
})
app.use('/api', limiter)

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/message", messageRouter)

server.listen(port, () => {
    console.log(`✅ Server started on port ${port} in ${process.env.NODE_ENV || 'development'} mode`)
})