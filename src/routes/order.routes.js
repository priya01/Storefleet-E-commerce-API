import express from 'express';
import { createNewOrder } from '../controllers/order.controller.js';
import { isAuthenticatedUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/new', isAuthenticatedUser, createNewOrder);

export default router;
