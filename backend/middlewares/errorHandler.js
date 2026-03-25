/**
 * Global Error Handler Middleware
 * Must be registered LAST in Express middleware chain (after all routes).
 * Handles all errors passed via next(error).
 */
const errorHandler = (err, req, res, next) => {
    // Log the error server-side for debugging
    console.error(`[Error] ${req.method} ${req.originalUrl} →`, err.message)

    // Determine status code: use error's statusCode if set, otherwise 500
    const statusCode = err.statusCode || err.status || 500

    // Handle specific known error types
    let message = err.message || "Internal Server Error"

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map(e => e.message)
        return res.status(400).json({ message: messages.join(", ") })
    }

    // Mongoose Duplicate Key Error (e.g. unique field violation)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field"
        return res.status(400).json({ message: `${field} already exists` })
    }

    // JWT Errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token. Please log in again." })
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Session expired. Please log in again." })
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` })
    }

    return res.status(statusCode).json({ message })
}

export default errorHandler
