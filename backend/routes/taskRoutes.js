const express = require("express")
const router = express.Router()
const {showTasks, createTask, getTaskById, updateTask, deleteTask} = require("../controllers/taskController")
const authMiddleware = require("../middleware/authentication")
router.route("/")
    .get(authMiddleware,showTasks)
    .post(authMiddleware,createTask)

router.route("/:id")
    .get(authMiddleware,getTaskById)
    .patch(authMiddleware,updateTask)
    .delete(authMiddleware,deleteTask)

module.exports = router