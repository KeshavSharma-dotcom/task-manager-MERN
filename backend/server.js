const express = require("express")
const taskRoutes = require("./routes/taskRoutes")
const authRoute = require("./routes/authRoutes")
const mongoose = require("mongoose")
const handleError = require("./middleware/errorHandler")
const notFound = require("./middleware/notFound")
const PORT = 5000

const app = express()
require("dotenv").config()
const cors = require("cors")
app.use(cors())
app.use(express.json())
mongoose.connect(process.env.MONGO_URL)
app.use((req,res,next)=>{
    const time = new Date().toLocaleDateString()
    const method = req.method
    const url = req.url
    console.log(`${time} ${method} is running on ${url}`)
    next()
})
app.use("/api/auth",authRoute)
app.use("/api/tasks",taskRoutes)
app.use(notFound)
app.use(handleError)
app.listen(PORT,()=>{
    console.log(`Server is running successfully on http://localhost:${PORT}`)
});