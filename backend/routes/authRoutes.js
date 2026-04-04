const express = require("express")
const router = express.Router()

const {registerUser, verifyOtp, verifyUser, forgotPassword, newPassword} = require("../controllers/authController")

router.post("/register",registerUser)
router.post("/verify",verifyOtp)
router.post("/login",verifyUser)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",newPassword)

module.exports = router