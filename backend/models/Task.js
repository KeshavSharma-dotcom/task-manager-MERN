const mongoose = require("mongoose")

const TaskSchema = mongoose.Schema({
    taskName : {
        type: String,
        required : true,
        trim : true
    },
    isCompleted : {
        type : Boolean,
        default : false
    },
    timeCreated : {
        type : Date,
        default : new Date().toLocaleDateString()
    }
})
    
module.exports = mongoose.model("Tasks",TaskSchema)