const asyncWrapper = require("../middleware/asyncWrapper");
const authService = require("../services/authService");

const registerUser = asyncWrapper(async (req, res) => {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
});

const verifyOtp = asyncWrapper(async (req, res) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    res.status(201).json(result);
});

const verifyUser = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.verifyUser(email, password);
    res.status(200).json(result);
});

const forgotPassword = asyncWrapper(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json(result);
});

const newPassword = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.newPassword(email, password);
    res.status(201).json(result);
});

const getCurrentUser = asyncWrapper(async (req, res) => {
    const result = await authService.getCurrentUser(req.user.userId);
    res.status(200).json(result);
});

module.exports = { registerUser, verifyOtp, verifyUser, forgotPassword, newPassword, getCurrentUser };