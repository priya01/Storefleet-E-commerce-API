import ErrorHandler from '../utils/errorHandler.js';
import sendToken from '../utils/sendToken.js';
import sendEmail, { getWelcomeEmailTemplate, getResetPasswordTemplate } from '../utils/email.js';
import crypto from 'crypto';
import {
  createNewUserRepo,
  findUserByEmailRepo,
  findUserByResetTokenRepo,
  updateUserRoleRepo,
} from '../repositories/user.repository.js';

// Register a User
export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await createNewUserRepo({
      name,
      email,
      password,
    });

    // Send Welcome Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Welcome to Storefleet',
        html: getWelcomeEmailTemplate(user.name),
      });
    } catch (error) {
      console.log("Welcome email could not be sent", error);
    }

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// Login User
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler('Please Enter Email & Password', 400));
    }

    const user = await findUserByEmailRepo(email, true);
    if (!user) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await findUserByEmailRepo(req.body.email);
    if (!user) {
      return next(new ErrorHandler('User not found with this email', 404));
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Using simple localhost URL since frontend isn't specified
    const resetPasswordUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/storefleet/user/password/reset/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Storefleet Password Recovery',
        html: getResetPasswordTemplate(resetPasswordUrl),
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await findUserByResetTokenRepo(resetPasswordToken);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token has expired or is invalid',
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler('Password does not match', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// Update User Role -- Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const newUserData = {
      role: req.body.role,
    };

    const user = await updateUserRoleRepo(req.params.id, newUserData.role);
    if (!user) {
      return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'User Role Updated Successfully',
    });
  } catch (error) {
    next(error);
  }
};
