const express = require("express")
const router = express.Router()
const {showTasks, createTask, getTaskById, updateTask, deleteTask} = require("../controllers/taskController")

router.route("/")
    .get(showTasks)
    .post(createTask)

router.route("/:id")
    .get(getTaskById)
    .patch(updateTask)
    .delete(deleteTask)

module.exports = router