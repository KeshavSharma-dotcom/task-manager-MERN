import axios from "axios"
import { useEffect, useState } from "react"
import "./Tasks.css"
import {motion, AnimatePresence} from "framer-motion"
import confetti from "canvas-confetti"
const Tasks = ()=>{
    const [tasks, setTasks] = useState([])
    const [createMode, setCreateMode] = useState(false)
    const [loading, setLoading] = useState(true)
    const [newTask,setNewTask] = useState("")
    const [editMode,setEditMode] = useState(false)
    const [editId,setEditId] = useState("")
    const [updatedTask,setUpdatedTask] = useState("")

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
            return;
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
    const startEdit = (id,task) =>{
        setEditMode(true)
        setEditId(id)
        setUpdatedTask(task)
    }
    const handleUpdate = async (e)=>{
        e.preventDefault()
        try{
            const token = localStorage.getItem("token")
            const response = await axios.patch(`http://localhost:5000/api/tasks/${editId}`,
                {taskName : updatedTask},
                {headers : {Authorization : `Bearer ${token}`}})
            
            fetchTasks()
        }catch(err){
            alert(err.response?.data?.message)
        }
        setEditId("")
        setUpdatedTask("")
        setEditMode(false)
    }
    const handleDone = async (id, isCompleted) => {
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:5000/api/tasks/${id}`, 
                { isCompleted: !isCompleted },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        if (!isCompleted) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4caf50', '#81c784', '#ffffff']
            });
        }
        fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };
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
            ):(tasks
                .sort((a,b)=>a.isCompleted - b.isCompleted)
                .map((t)=>{
                return (
                <div key={t._id} className={`task-card ${t.isCompleted ? "completed-style" : ""}`}>
                    <AnimatePresence>
                    {editMode && editId === t._id ? (
                        
                        <motion.form 
                        onSubmit={handleUpdate}
                        initial={{height:0,opacity:0,overflow:"hidden"}}
                        animate={{height:"auto",opacity:1}}
                        exit={{height:0,opacity:0}}
                        transition={{duration:0.3, ease:"easeInOut"}}
                        >
                        <div className="edit-scroll-content taskContainer">
                            <p className="label">Updating task...</p>
                            <input value={updatedTask} onChange={(e)=>{setUpdatedTask(e.target.value)}} autoFocus/>
                            <div className="edit-actions taskFeature">
                                <button type="submit">Update</button>
                                <button onClick={()=>{setEditId("");setUpdatedTask("");setEditMode(false)}}>Cancel</button>
                            </div>
                        </div>
                        </motion.form>
                        
                    ) : (
                        <div>
                            <div className="checkbox-container" onClick={() => handleDone(t._id, t.isCompleted)}>
                                <div className={`custom-checkbox ${t.isCompleted ? 'checked' : ''}`}>
                                    <span className="checkmark">✔</span>
                                </div>
                                <h2 className={t.isCompleted ? "strikethrough" : ""}>
                                    {t.taskName}
                                </h2>
                                <p>
                                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "No Date"} - 
                                    {t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                </p>
                            </div>
                            {t.isCompleted === true ? (
                                <div className="taskFeature">
                                    <button onClick={()=>{handleDelete(t._id)}} >Delete</button>
                                </div>
                            ) : 
                            (
                                <div className="taskFeature">
                                    <button onClick={()=>handleDelete(t._id)}>Delete</button>
                                    <button onClick={()=>startEdit(t._id,t.taskName)}>Edit</button>
                                </div>) 
                            }
                        </div>
                    )} 
                    </AnimatePresence>
                </div>)
            }))}
            </div>
        </div>
    )
}
export default Tasks