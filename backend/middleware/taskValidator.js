let tasks = []

const validateAdd = (req,res,next) =>{
    const NameToAdd = req.body.taskName
    if(!NameToAdd){
        return res.status(400).send("task data can't be empty")
    }
    next()
}

const validateId = (req,res,next) =>{
    const Id = req.params.id
    if(!tasks.some(t=>t.taskId === Id)){
        return res.status(404).send(`ID : ${Id} not found`)
    }
    next();
}

module.exports = {validateAdd, validateId}
