import ErrorHandler from '../utils/errorHandler.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const isAuthenticatedUser = async (req, res, next) => {
    try {
        const { token } = req.cookies || {};
        
        // Sometimes the token is in the authorization header
        const authHeaderToken = req.headers.authorization?.split(' ')[1];
        const finalToken = token || authHeaderToken;

        if (!finalToken) {
            return next(new ErrorHandler('Please Login to access this resource', 401));
        }

        const decodedData = jwt.verify(finalToken, process.env.JWT_SECRET);

        req.user = await User.findById(decodedData.id);

        next();
    } catch (error) {
        next(new ErrorHandler('Invalid or Expired Token. Please login again.', 401));
    }
};

export const authByUserRole = (...roles) => {
    return (req, res, next) => {
        // Fix Bug in Securing Admin Routes
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource`,
                    403
                )
            );
        }

        next();
    };
};
