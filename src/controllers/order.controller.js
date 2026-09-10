import ErrorHandler from '../utils/errorHandler.js';
import { createNewOrderRepo } from '../repositories/order.repository.js';

// Create new Order
export const createNewOrder = async (req, res, next) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body;

        const order = await createNewOrderRepo({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
};
