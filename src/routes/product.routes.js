import express from 'express';
import {
    getAllProducts,
    deleteReview,
} from '../controllers/product.controller.js';
import { isAuthenticatedUser } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getAllProducts);

router.delete('/review', isAuthenticatedUser, deleteReview);

export default router;
