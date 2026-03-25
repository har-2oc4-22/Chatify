import mongoose from "mongoose";

const connectDb = async () => {
    // Support both common env var naming conventions
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL

    if (!mongoUri) {
        console.error("❌ MongoDB URI not found. Set MONGO_URI in environment variables.")
        process.exit(1)
    }

    try {
        await mongoose.connect(mongoUri)
        console.log("✅ MongoDB connected")
    } catch (error) {
        console.error("❌ MongoDB connection error:", error.message)
        process.exit(1) // Exit so Render restarts and logs are visible
    }
}

export default connectDb