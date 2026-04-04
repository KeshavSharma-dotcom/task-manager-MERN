const mongoose = require("mongoose")

const TaskSchema = mongoose.Schema({
    taskName : {
        type: String,
        required : [true, "Please assign a task"],
        trim : true
    },
    isCompleted : {
        type : Boolean,
        default : false
    },
    currentTime : {
        type : Date,

    },
    deadLine : {
        type : Date,
        
    },
    createdBy :{
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : [true, "Please provide user"]
    }
},{timeStamps : true})
    
module.exports = mongoose.model("Tasks",TaskSchema)