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
            to : email,
            subject : `Verify your account`,
            html : `<h1>Welcome</h1>
                   <p>Your code : <b>${otp}</b> </p>`
        })
        res.status(201).json({message:`OTP sent to ${user.email}`})
    }catch(err){
        console.log("Nodemailer error : ",err)
        res.status(500).json({message:"failed to send email, try different email." ,err: err.message})
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

const forgotPassword = asyncWrapper( async (req, res)=>{
    const {email} = req.body
    if(!email){
        return res.status(400).json({message:"Email are required"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"User not found"})
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp 
    try{
        await sendEmail({
            to : email,
            subject : `Change user password`,
            html : `<h1>Change your password</h1>
            <h2>Here is your otp for changing password : </h2>
            <p><b>${otp}</b></p>`
        })
    }catch(err){
        res.status(403).json({message:"Failed to send otp"})
    }
    await user.save()
    res.status(200).json({message:`OTP sent to ${email}`})
})

const newPassword =asyncWrapper( async (req,res)=>{
    const {email, password} = req.body 
    if(!email || !password){
        return res.status(400).json({message:"Password is required"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(404).json({message:"User not found, Register first!"})
    }
    
    user.password = password
    await user.save()
    res.status(201).json({message:"Password changed successfully"})
})
module.exports = {registerUser, verifyOtp, verifyUser , forgotPassword, newPassword}