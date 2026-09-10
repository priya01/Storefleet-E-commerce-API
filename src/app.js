import express from 'express';
import dotenv from 'dotenv';
import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';

// Route imports
// User, Product, Order routes will be imported here later
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();

const app = express();

app.use(express.json());

// Routes implementation
app.use('/api/storefleet/user', userRoutes);
app.use('/api/storefleet/product', productRoutes);
app.use('/api/storefleet/order', orderRoutes);

// Error handling middleware should be the last middleware
app.use(errorHandlerMiddleware);

export default app;
