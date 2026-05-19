
import { useEffect, useState } from "react"
import "./Tasks.css"
import {motion, AnimatePresence} from "framer-motion"
import confetti from "canvas-confetti"
import toast from "react-hot-toast"
const Tasks = ()=>{
    const [tasks, setTasks] = useState([])
    const [createMode, setCreateMode] = useState(false)
    const [loading, setLoading] = useState(true)
    const [aiLoading, setAiLoading] = useState(false)
    const [newTask,setNewTask] = useState("")
    const [editMode,setEditMode] = useState(false)
    const [editId,setEditId] = useState("")
    const [updatedTask,setUpdatedTask] = useState("")
    const [searchTerm, setSearchTerm] = useState("")

    const fetchUserData = async () => {
        // Stats are now handled by NavBar
        window.dispatchEvent(new Event("refresh-stats"));
    }

    const fetchTasks = async ()=>{
        try{
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:5000/api/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch tasks");
            setTasks(data)
        }catch(err){
            console.error(err.message)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchTasks()
        fetchUserData()
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
            const response = await fetch("http://localhost:5000/api/tasks", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({taskName: newTask})
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to create task");
            toast.success("Task added successfully")
            fetchTasks()
        }catch(err){
            toast.error(err.message)
        }
        setNewTask("")
        setCreateMode(false)
    }

    const handleAIBreakdown = async (e) => {
        e.preventDefault();
        if(!newTask.trim()){
            return toast.error("Please enter a task to breakdown first!");
        }
        setAiLoading(true);
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:5000/api/tasks/ai-breakdown", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({taskName: newTask})
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "AI Breakdown failed");
            
            toast.success("AI magic applied! Task broken down.")
            fetchTasks()
            setNewTask("")
            setCreateMode(false)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setAiLoading(false);
        }
    }
    const handleDelete= async (id)=>{
        try{
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to delete task");
            toast.success("Task deleted")
            fetchTasks()
        }catch(err){
            toast.error(err.message)
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
            const response = await fetch(`http://localhost:5000/api/tasks/${editId}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({taskName: updatedTask})
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to update task");
            
            toast.success("Task updated")
            fetchTasks()
        }catch(err){
            toast.error(err.message)
        }
        setEditId("")
        setUpdatedTask("")
        setEditMode(false)
    }
    const handleDone = async (id, isCompleted) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ isCompleted: !isCompleted })
            });
            if (!response.ok) throw new Error("Failed to update status");
        if (!isCompleted) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4caf50', '#81c784', '#ffffff']
            });
        }
        fetchTasks();
        fetchUserData();
        toast.success(isCompleted ? "Task restored" : "Task completed! +10 pts")
        } catch (err) {
            toast.error(err.message);
        }
    };

    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.taskName.toLowerCase().includes(searchTerm.toLowerCase());
        // Only show active tasks in the main workspace
        return matchesSearch && !t.isCompleted;
    });

    const activeTasksCount = filteredTasks.length;

    return(
        <div className="mainCont">

            <div className="workspace-header">
                <div className="header-text">
                    <h1>My Workspace</h1>
                    <p>{activeTasksCount} active tasks for today</p>
                </div>
                <button className="primary-add-btn" onClick={()=>setCreateMode(true)}>+ New Task</button>
            </div>

            <div className="management-bar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    {/* Filters are simplified as completed tasks are in History */}
                    <span className="active-tag">Active Workspace</span>
                </div>
            </div>
            
            <AnimatePresence>
            {createMode && (
                <div className="modal-overlay">
                    <motion.div 
                    className="createTask"
                    initial={{scale: 0.9, opacity:0}}
                    animate={{scale: 1, opacity:1}}
                    exit={{scale: 0.9, opacity:0}}
                    >
                        <h2>Create New Task</h2>
                        <input value={newTask} onChange={(e)=>{setNewTask(e.target.value)}} placeholder="What needs to be done?" disabled={aiLoading} autoFocus />
                        <div className="modal-actions">
                            <button onClick={handleSave} disabled={aiLoading} className="save-btn">Save Task</button>
                            <button onClick={handleAIBreakdown} disabled={aiLoading} className="ai-btn">
                                {aiLoading ? "Generating magic..." : "✨ AI Breakdown"}
                            </button>
                            <button onClick={()=>{setNewTask(""); setCreateMode(false)}} disabled={aiLoading} className="cancel-btn">Cancel</button>
                        </div>
                    </motion.div>
                </div>
                )}
            </AnimatePresence>

            <div className="taskContainer">
            {filteredTasks.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">🏖️</span>
                    <h2>{searchTerm ? "No matches found" : "All caught up!"}</h2>
                    <p>{searchTerm ? "Try a different search term" : "Your workspace is clean. Take a break!"}</p>
                </div>
            ):(
                filteredTasks
                .sort((a,b)=>a.isCompleted - b.isCompleted)
                .map((t)=>{
                return (
                <motion.div 
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    key={t._id} 
                    className={`task-card ${t.isCompleted ? "completed-style" : ""}`}
                >
                    <AnimatePresence mode="wait">
                    {editMode && editId === t._id ? (
                        <motion.form 
                        key="edit"
                        onSubmit={handleUpdate}
                        initial={{opacity:0}}
                        animate={{opacity:1}}
                        exit={{opacity:0}}
                        className="edit-row"
                        >
                            <input value={updatedTask} onChange={(e)=>{setUpdatedTask(e.target.value)}} autoFocus/>
                            <div className="edit-actions">
                                <button type="submit" className="save-edit">Save</button>
                                <button onClick={()=>{setEditId("");setUpdatedTask("");setEditMode(false)}} className="cancel-edit">Cancel</button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.div 
                            key="view"
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            exit={{opacity:0}}
                            className="task-row"
                        >
                            <div className="task-main" onClick={() => handleDone(t._id, t.isCompleted)}>
                                <div className={`custom-checkbox ${t.isCompleted ? 'checked' : ''}`}>
                                    <span className="checkmark">✔</span>
                                </div>
                                <div className="task-content">
                                    <h2 className={t.isCompleted ? "strikethrough" : ""}>{t.taskName}</h2>
                                    <p className="task-date">
                                        {t.currentTime || t.createdAt ? (
                                            <>
                                                📅 {new Date(t.currentTime || t.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short'
                                                })} • {new Date(t.currentTime || t.createdAt).toLocaleTimeString([], { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit',
                                                    hour12: true 
                                                })}
                                            </>
                                        ) : "Pending..."}
                                    </p>
                                </div>
                            </div>
                            <div className="task-actions">
                                {!t.isCompleted && <button className="edit-btn" onClick={()=>startEdit(t._id,t.taskName)}>Edit</button>}
                                <button className="delete-btn" onClick={()=>{handleDelete(t._id)}}>Delete</button>
                            </div>
                        </motion.div>
                    )} 
                    </AnimatePresence>
                </motion.div>)
            }))}
            </div>
        </div>
    )
}
export default Tasks