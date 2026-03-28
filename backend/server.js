const express = require("express")
const taskRoutes = require("./routes/taskRoutes")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
const PORT = 5000
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
app.use((req,res,next)=>{
    const time = new Date().toLocaleDateString()
    const method = req.method
    const url = req.url
    console.log(`${time} ${method} is running on ${url}`)
    next()
})

app.use("/api/tasks",taskRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running successfully on http://localhost:${PORT}`)
});