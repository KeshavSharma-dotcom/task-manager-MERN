const asyncWrapper = require("../middleware/asyncWrapper");
const taskService = require("../services/taskService");
const aiService = require("../services/aiService");

const showTasks = asyncWrapper(async (req, res) => {
    const allTasks = await taskService.getAllTasks(req.user.userId);
    res.status(200).json(allTasks);
});

const createTask = asyncWrapper(async (req, res) => {
    const task = await taskService.createTask(req.body, req.user.userId);
    res.status(201).json(task);
});

const getTaskById = asyncWrapper(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id, req.user.userId);
    res.status(200).json(task);
});

const updateTask = asyncWrapper(async (req, res) => {
    const updatedTask = await taskService.updateTask(req.params.id, req.user.userId, req.body);
    res.status(200).json(updatedTask);
});

const deleteTask = asyncWrapper(async (req, res) => {
    await taskService.deleteTask(req.params.id, req.user.userId);
    res.status(200).json({ message: "Task deleted" });
});

const breakdownTaskAi = asyncWrapper(async (req, res) => {
    const { taskName } = req.body;
    if (!taskName) {
        return res.status(400).json({ message: "Task name is required for AI breakdown" });
    }

    const subTasks = await aiService.breakdownTask(taskName);
    
    // Create all sub-tasks in the DB
    await taskService.createTasksBatch(subTasks, req.user.userId);
    
    res.status(201).json({ message: "AI Breakdown complete", subTasks });
});

const getAnalytics = asyncWrapper(async (req, res) => {
    const analyticsData = await taskService.getTaskAnalytics(req.user.userId);
    res.status(200).json(analyticsData);
});

module.exports = { showTasks, createTask, getTaskById, updateTask, deleteTask, breakdownTaskAi, getAnalytics };