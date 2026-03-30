const express = require("express")
const router = express.Router()

const {registerUser, verifyOtp, verifyUser} = require("../controllers/authController")

router.post("/register",registerUser)
router.post("/verify",verifyOtp)
router.post("/login",verifyUser)

module.exports = router