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
        type: Boolean,
        default : false
    },
    otp : String
})

User.pre('save',async function(){
    if(!this.isModified('password')){return} 

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS || 10))
    this.password = await bcrypt.hash(this.password , salt)
})

module.exports = mongoose.model('Users', User)