const User = require("../models/User")
const asyncWrapper = require("../middleware/asyncWrapper")
const bcrypt = require("bcryptjs")

const registerUser = asyncWrapper(async (req,res)=>{
    const {name, email , password} = req.body
    if(!email || !password){
        return res.status(400).json({message : "Email and Password cannot be empty!"})
    }

    const findEmail = User.exists(email)
    if(findEmail){
        return res.status(400).json({message : "Email already registered"})
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const user = User.create({
        name : name,
        email : email,
        password : password,
        otp : otp
    })

    res.status(201).json({message : `OPT sent to ${email}`, otp : otp})
})

const verifyOtp = asyncWrapper (async (req, res) =>{
    const {email, otp} = req.body
    if(!email || !otp){
        return res.status(400).json({message : "Please enter email and otp"})
    }

    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message : "User not found"})
    }
    if(user.otp !== otp){
        return res.status(400).json({message : "Invalid OTP"})
    }
    user.isVerified = true
    user.otp = undefined
    await user.save()
    res.status(201).json({message: "Email verified successfully, now you can login"})
})

const verifyUser = asyncWrapper(async (req,res) =>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({message:"Email and Password are required"})
    }
    const user = User.findOne({email})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    if(!user.isVerified){
        return res.status(403).json({message:"User is not verified , please sign up first."})
    }

    const passcodeCheck = bcrypt.compare(user.password, password)
    if(!passcodeCheck){
        return res.status(401).json({message:"Password not match"})
    }
    res.status(200).json({message:"Login successfull"})
})
module.exports = {registerUser, verifyOtp, verifyUser}