/**
 * Global Error Handling Middleware
 * Centralizes all error responses with consistent formatting.
 * Compatible with Express 5.
 */
const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(`[Error] ${err.message}`)

    let statusCode = err.statusCode || 500
    let message = err.message || "Internal Server Error"

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = Object.values(err.errors).map(val => val.message).join(', ')
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        statusCode = 400
        message = 'That value is already taken'
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        message = 'Invalid token. Please log in again.'
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401
        message = 'Token expired. Please log in again.'
    }

    return res.status(statusCode).json({
        success: false,
        message,
    })
}

export default errorHandler
