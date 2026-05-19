const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const jsonwebtoken = require("jsonwebtoken");

const registerUser = async (userData) => {
    const { name, email, password } = userData;

    if (!email || !password) {
        throw new CustomError("Email and Password cannot be empty!", 400);
    }

    const findEmail = await User.exists({ email });
    if (findEmail) {
        throw new CustomError("Email already registered", 400);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    const user = await User.create({
        name,
        email,
        password,
        otp
    });

    try {
        await sendEmail({
            to: email,
            subject: `Verify your account`,
            html: `<h1>Welcome</h1>
                   <p>Your code : <b>${otp}</b> </p>`
        });
        return { message: `OTP sent to ${user.email}` };
    } catch (err) {
        console.log("Nodemailer error : ", err);
        throw new CustomError("failed to send email, try different email.", 500);
    }
};

const verifyOtp = async (email, otp) => {
    if (!email || !otp) {
        throw new CustomError("Please enter email and otp", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("User not found", 404);
    }
    
    if (String(user.otp) !== String(otp)) {
        throw new CustomError("Invalid OTP", 400);
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    
    return { message: "Email verified successfully, now you can login" };
};

const verifyUser = async (email, password) => {
    if (!email || !password) {
        throw new CustomError("Email and Password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("User not found", 404);
    }
    
    if (!user.isVerified) {
        throw new CustomError("User is not verified , please sign up first.", 403);
    }

    const passcodeCheck = await bcrypt.compare(password, user.password);
    if (!passcodeCheck) {
        throw new CustomError("Password not match", 401);
    }

    const token = jsonwebtoken.sign(
        { userId: user._id }, 
        process.env.JSON_SECRETKEY, 
        { expiresIn: process.env.TOKEN_DURATION }
    );

    return { message: "Login successfull", token };
};

const forgotPassword = async (email) => {
    if (!email) {
        throw new CustomError("Email are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("User not found", 404);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    
    try {
        await sendEmail({
            to: email,
            subject: `Change user password`,
            html: `<h1>Change your password</h1>
            <h2>Here is your otp for changing password : </h2>
            <p><b>${otp}</b></p>`
        });
    } catch (err) {
        throw new CustomError("Failed to send otp", 403);
    }
    
    await user.save();
    return { message: `OTP sent to ${email}` };
};

const newPassword = async (email, password) => {
    if (!email || !password) {
        throw new CustomError("Password is required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("User not found, Register first!", 404);
    }
    
    user.password = password;
    await user.save();
    
    return { message: "Password changed successfully" };
};

const getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select('-password -otp');
    if (!user) {
        throw new CustomError("User not found", 404);
    }
    return user;
};

module.exports = { registerUser, verifyOtp, verifyUser, forgotPassword, newPassword, getCurrentUser };
