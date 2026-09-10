import Order from '../models/order.model.js';

export const createNewOrderRepo = async (orderData) => {
    return await Order.create(orderData);
};
