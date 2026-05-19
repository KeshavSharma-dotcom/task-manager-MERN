const express = require("express")
const router = express.Router()

const {registerUser, verifyOtp, verifyUser, forgotPassword, newPassword, getCurrentUser} = require("../controllers/authController")
const authMiddleware = require("../middleware/authentication")

router.post("/register",registerUser)
router.post("/verify",verifyOtp)
router.post("/login",verifyUser)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",newPassword)
router.get("/me", authMiddleware, getCurrentUser)

module.exports = router