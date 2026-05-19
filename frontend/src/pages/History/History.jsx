import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import "./History.css"
import "../Tasks/Tasks.css" // Reuse some task styles
import { motion } from "framer-motion"

const History = () => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch("http://localhost:5000/api/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to fetch tasks");
            // Only keep completed tasks for history
            setTasks(data.filter(t => t.isCompleted))
        } catch (err) {
            console.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTasks()
    }, [])

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token")
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Failed to delete");
            toast.success("Record cleared permanently")
            fetchTasks()
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleRestore = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({ isCompleted: false })
            });
            if (!response.ok) throw new Error("Failed to restore");
            toast.success("Task restored to active workspace")
            fetchTasks();
            window.dispatchEvent(new Event("refresh-stats")); // Update points/streak
        } catch (err) {
            toast.error(err.message);
        }
    }

    const filteredTasks = tasks.filter(t => 
        t.taskName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <h1 className="mainCont">Loading History...</h1>

    return (
        <div className="mainCont history-page">
            <div className="workspace-header">
                <div className="header-text">
                    <h1>Task History</h1>
                    <p>You've completed {tasks.length} tasks in total!</p>
                </div>
            </div>

            <div className="management-bar">
                <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search history..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <span className="history-tag">Archives</span>
                </div>
            </div>

            <div className="taskContainer">
                {filteredTasks.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-icon">📜</span>
                        <h2>No history found</h2>
                        <p>Complete some tasks to see them here!</p>
                    </div>
                ) : (
                    filteredTasks
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                    .map((t) => (
                        <motion.div 
                            layout
                            key={t._id} 
                            className="task-card history-card"
                        >
                            <div className="task-row">
                                <div className="task-main">
                                    <div className="history-check">✔</div>
                                    <div className="task-content">
                                        <h2 className="strikethrough">{t.taskName}</h2>
                                        <p className="task-date">
                                            Completed on {new Date(t.updatedAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <button className="restore-btn" onClick={() => handleRestore(t._id)}>Restore</button>
                                    <button className="delete-btn" onClick={() => handleDelete(t._id)}>Clear</button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}

export default History
