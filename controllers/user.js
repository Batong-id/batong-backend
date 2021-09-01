const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse")

exports.updateUser = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.pic = req.body.pic || user.pic;
        user.role = user.role;
        user.address = req.body.address || '';
        user.phoneNumber = req.body.phoneNumber || '';
        user.accountNumber = req.body.accountNumber || '';
        user.gender = req.body.gender || user.gender
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            username: updatedUser.username,
            email: updatedUser.email,
            pic: updatedUser.pic,
            role: updatedUser.role,
            address: updatedUser.address,
            phoneNumber: updatedUser.phoneNumber,
            accountNumber: updatedUser.accountNumber,
            gender: updatedUser.gender
        });

    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
}

exports.getUser = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            pic: user.pic,
            role: user.role,
            address: user.address,
            phoneNumber: user.phoneNumber,
            accountNumber: user.accountNumber,
            gender: user.gender
        });
    } else {
        res.status(404);
        throw new Error("User Not Found");
    }
}

