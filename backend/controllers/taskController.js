const Task = require("../models/Task");
const asyncWrapper = require("../middleware/asyncWrapper"); // Removed { } if you used module.exports = asyncWrapper

const showTasks = asyncWrapper(async (req, res) => {
    const allTasks = await Task.find({});
    res.status(200).json(allTasks);
});

const createTask = asyncWrapper(async (req, res) => {
    const task = await Task.create(req.body);
    res.status(201).json(task);
});

const getTaskById = asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
        return res.status(404).json({ message: "Id not found" });
    }
    res.status(200).json(task);
});

const updateTask = asyncWrapper(async (req, res) => {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedTask) {
        return res.status(404).json({ message: "Id not found" });
    }
    res.status(200).json(updatedTask);
});

const deleteTask = asyncWrapper(async (req, res) => {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) {
        return res.status(404).json({ message: "Id not found" });
    }
    res.status(200).json({ message: "Task deleted" });
});

module.exports = { showTasks, createTask, getTaskById, updateTask, deleteTask };