const express = require("express")
const router = express.Router()
const {showTasks, createTask, getTaskById, updateTask, deleteTask, breakdownTaskAi, getAnalytics} = require("../controllers/taskController")
const authMiddleware = require("../middleware/authentication")
router.route("/")
    .get(authMiddleware,showTasks)
    .post(authMiddleware,createTask)

router.get("/analytics", authMiddleware, getAnalytics)
router.post("/ai-breakdown", authMiddleware, breakdownTaskAi)

router.route("/:id")
    .get(authMiddleware,getTaskById)
    .patch(authMiddleware,updateTask)
    .delete(authMiddleware,deleteTask)

module.exports = router