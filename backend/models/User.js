const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const User = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
    },
    password:{
        type : String,
        required : true
    },
    isVerified :{
        typr: Boolean,
        default : false
    },
    otp : String
})

User.pre('save',async function(){
    const salt = await bcrypt.getSalt(process.env.SALT_ROUNDS)
    this.password = await bcrypt.hash(this.password , salt)
})

module.exports = mongoose.model('Users', User)