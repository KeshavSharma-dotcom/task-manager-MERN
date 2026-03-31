const User = require("../models/User")
const asyncWrapper = require("../middleware/asyncWrapper")
const bcrypt = require("bcryptjs")
const sendEmail = require("../utils/sendEmail")
const jsonwebtoken = require("jsonwebtoken")
const registerUser = asyncWrapper(async (req,res)=>{
    const {name, email , password} = req.body
    if(!email || !password){
        return res.status(400).json({message : "Email and Password cannot be empty!"})
    }
    const findEmail = await User.exists({email})
    if(findEmail){
        return res.status(400).json({message : "Email already registered"})
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const user = await User.create({
        name : name,
        email : email,
        password : password,
        otp : otp
    })
    try{
        await sendEmail({
            to : user.email,
            subject : `Verify your account`,
            html : `<h1>Welcome</h1>
                   <p>Your code : <b>${otp}</b> </p>`
        })
        res.status(201).json({message:`OTP sent to ${user.email}`})
    }catch(err){
        res.status(500).json({message:"failed to send email, try different email."})
    }

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
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    if(!user.isVerified){
        return res.status(403).json({message:"User is not verified , please sign up first."})
    }

    const passcodeCheck = await bcrypt.compare(password, user.password)
    if(!passcodeCheck){
        return res.status(401).json({message:"Password not match"})
    }

    const token = jsonwebtoken.sign({userId : user._id}, process.env.JSON_SECRETKEY, {expiresIn : process.env.TOKEN_DURATION});

    res.status(200).json({message:"Login successfull", token : token})
})
module.exports = {registerUser, verifyOtp, verifyUser}