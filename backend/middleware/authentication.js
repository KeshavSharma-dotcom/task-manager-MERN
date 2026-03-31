const jsonwebtoken = require("jsonwebtoken")
const asyncWrapper = require("./asyncWrapper")
const authMiddleware =asyncWrapper( async (req,res,next) => {
    const header = req.headers.authorization

    if(!header || !header.startsWith('Bearer ')){
        res.status(401).json({message : "No token provided ,Login please!"})
    }

    const token = header.split(' ')[1]
    try{
        const payload = jsonwebtoken.verify(token, process.env.JSON_SECRETKEY)
        req.user = {userId : payload.userId, name : payload.name}
        next()
    }catch(err){
        res.status(401).json({message : "Unauthorized to access"})
    }
})

module.exports = authMiddleware