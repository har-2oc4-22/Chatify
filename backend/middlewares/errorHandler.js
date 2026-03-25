/**
 * Global Error Handling Middleware
 * Centralizes all error responses and formats them consistently.
 * 
 * @param {Error} err - The error object.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
const errorHandler = (err, req, res, next) => {
    // Log error to console for debugging (can be replaced with tools like Winston)
    console.error(`[Error] ${err.message}`, err.stack);

    // Default status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle specific MongoDB/Mongoose errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    if (err.code === 11000) { // Duplicate key error
        statusCode = 400;
        message = 'Duplicate field value entered';
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired. Please log in again.';
    }

    return res.status(statusCode).json({
        success: false,
        message,
        // Only send stack trace if not in production
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;
