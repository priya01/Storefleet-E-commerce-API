import express from 'express';
import {
    signup,
    login,
    forgotPassword,
    resetPassword,
    updateUserRole,
} from '../controllers/user.controller.js';
import { isAuthenticatedUser, authByUserRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login); // Standard although not explicitly required, typically needed

router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

router.put(
    '/admin/update/:id',
    isAuthenticatedUser,
    authByUserRole('admin'),
    updateUserRole
);

export default router;
