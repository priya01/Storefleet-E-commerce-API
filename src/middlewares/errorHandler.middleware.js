import ErrorHandler from '../utils/errorHandler.js';

const errorHandlerMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Mongoose duplicate key error (Target specific for 'Handle Duplicate Key Error in MongoDB' req)
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            error: 'email already registered',
        });
    }

    res.status(err.statusCode).json({
        success: false,
        error: err.message,
    });
};

export default errorHandlerMiddleware;
