import User from '../models/user.model.js';

export const createNewUserRepo = async (userData) => {
    return await User.create(userData);
};

export const findUserByEmailRepo = async (email, selectPassword = false) => {
    let query = User.findOne({ email });
    if (selectPassword) {
        query = query.select('+password');
    }
    return await query;
};

export const findUserByResetTokenRepo = async (resetPasswordToken) => {
    return await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
};

export const findUserByIdRepo = async (id) => {
    return await User.findById(id);
};

export const updateUserRoleRepo = async (id, role) => {
    return await User.findByIdAndUpdate(id, { role }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
};
