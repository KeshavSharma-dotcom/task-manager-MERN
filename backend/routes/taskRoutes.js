const express = require("express")
const router = express.Router()
const Task = require("../models/Task")
router.get('/',async (req,res)=>{
    try{
        const allTasks = await Task.find({})
        res.status(200).json(allTasks)
    }catch(err){
        res.status(404).json({err:err.message})
    }
})

router.post('/AddTask', async (req,res)=>{
    try{
        const newTask = await Task.create(req.body)
        res.status(201).json(newTask)
    }catch(err){
        res.status(400).json({err : err.message})
    }
})
router.get('/task/:id', async (req,res)=>{
    const tId = await Task.findById(req.params.id)
    if(tId === null){
        return res.status(404).json({err:err.message})
    }
    res.status(200).json(tId)
})

router.put('/UpdateTask/:id',async (req,res)=>{
    try{
        const updated = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true})
        res.status(201).json(updated)
    }catch(err){
        res.status(400).json({err:err.message})
    }
}) 

router.delete('/deleteTask/:id',async (req,res)=>{
    try{
        const temp = await Task.findByIdAndDelete(req.params.id)
        if(temp === null){
            return res.status(404).json({error:error.message})
        }
        res.status(200).json(Task.find({}))
    }catch(err){

    }
    
})

module.exports = router