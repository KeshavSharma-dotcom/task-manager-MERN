import axios from "axios"
import { useEffect, useState } from "react"
import "./Tasks.css"
import {motion, AnimatePresence} from "framer-motion"
const Tasks = ()=>{
    const [tasks, setTasks] = useState([])
    const [createMode, setCreateMode] = useState(false)
    const [loading, setLoading] = useState(true)
    const [newTask,setNewTask] = useState("")
    const fetchTasks = async ()=>{
        try{
            const token = localStorage.getItem("token")
            const response = await axios.get("http://localhost:5000/api/tasks",{
                headers : {Authorization : `Bearer ${token}`}
            })
            setTasks(response.data)
        }catch(err){
            console.error(err.response.data.message)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchTasks()
    },[])
    if(loading){
        return(
            <h1>
                Loading Tasks...
            </h1>
        )
    }
    const handleSave = async (e)=>{
        e.preventDefault();
        if(!newTask.trim()){
            setCreateMode(false)
            return tasks;
        }
        try{
            const token = localStorage.getItem("token")
            const response = await axios.post("http://localhost:5000/api/tasks",
                {taskName : newTask},{
                    headers : {Authorization : `Bearer ${token}`}
                }
            )
            console.log(response.data.message)
            fetchTasks()
        }catch(err){
            console.error(err.response?.data?.message)
        }
        setNewTask("")
        setCreateMode(false)
        
    }
    const handleDelete= async (id)=>{
    
        try{
            const token = localStorage.getItem("token")
            const response = await axios.delete(`http://localhost:5000/api/tasks/${id}`,
                 
                {headers : {Authorization : `Bearer ${token}`}})
            console.log(response.data.message)
            fetchTasks()
        }catch(err){
            console.error(err.response?.data?.message)
        }
    }
    return(
        <div className="mainCont">
            <div className="createMate">
                <button onClick={()=>setCreateMode(true)}>+ Create task</button>
            <AnimatePresence>
            {createMode && (
                <motion.div 
                className="createTask"
                initial={{y:-50,opacity:0}}
                animate={{y:0,opacity:1}}
                exit={{y:-50,opacity:0}}
                transition={{duration:0.4, ease:"easeOut"}}
                >
                    <input value={newTask} onChange={(e)=>{setNewTask(e.target.value)}} placeholder="Enter task..." />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={()=>{setNewTask(""); setCreateMode(false)}}>Cancel</button>
                </motion.div>
                )}
            </AnimatePresence>
            </div>
            
            <hr/>
            <div className="taskContainer">
            {tasks.length===0 ? (
                <h1>Peacefull life!</h1>
            ):(tasks.map((t)=>{
                return (<div key={t._id} className="task-card">
                    <p>Task</p>
                    <h2>{t.taskName}</h2>
                    <div className="taskFeature">
                        <button>Done</button>
                        <button onClick={()=>handleDelete(t._id)}>Delete</button>
                    </div>
                </div>)
            }))}
            </div>
        </div>
    )
}
export default Tasks