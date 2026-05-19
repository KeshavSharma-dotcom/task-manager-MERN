const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const CustomError = require("../utils/CustomError");

const getAllTasks = async (userId) => {
    return await Task.find({ createdBy: userId });
};

const createTask = async (taskData, userId) => {
    taskData.createdBy = userId;
    return await Task.create(taskData);
};

const createTasksBatch = async (taskNames, userId) => {
    const tasksData = taskNames.map(name => ({
        taskName: name,
        createdBy: userId
    }));
    return await Task.insertMany(tasksData);
};

const getTaskById = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, createdBy: userId });
    if (!task) {
        throw new CustomError("Task not found", 404);
    }
    return task;
};

const updateTask = async (taskId, userId, updateData) => {
    const taskBeforeUpdate = await Task.findOne({ _id: taskId, createdBy: userId });
    if (!taskBeforeUpdate) {
        throw new CustomError("Task not found", 404);
    }
    
    const wasCompleted = taskBeforeUpdate.isCompleted;

    const updatedTask = await Task.findOneAndUpdate(
        { _id: taskId, createdBy: userId },
        updateData,
        { new: true, runValidators: true }
    );
    
    if (!wasCompleted && updatedTask.isCompleted) {
        const user = await User.findById(userId);
        if (user) {
            user.points = (user.points || 0) + 10;
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            if (user.lastActiveDate) {
                const lastActive = new Date(user.lastActiveDate);
                const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
                const diffTime = today - lastActiveDay;
                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
                
                if (diffDays === 1) {
                    user.currentStreak = (user.currentStreak || 0) + 1;
                } else if (diffDays > 1) {
                    user.currentStreak = 1;
                }
            } else {
                user.currentStreak = 1;
            }
            
            user.lastActiveDate = now;
            await user.save();
        }
    } else if (wasCompleted && !updatedTask.isCompleted) {
        const user = await User.findById(userId);
        if (user) {
            user.points = Math.max(0, (user.points || 0) - 10);
            await user.save();
        }
    }

    return updatedTask;
};

const deleteTask = async (taskId, userId) => {
    const deletedTask = await Task.findOneAndDelete({
        _id: taskId,
        createdBy: userId
    });
    if (!deletedTask) {
        throw new CustomError("Task not found", 404);
    }
    return deletedTask;
};

const getTaskAnalytics = async (userId) => {
    const totalTasks = await Task.countDocuments({ createdBy: userId });
    const completedTasks = await Task.countDocuments({ createdBy: userId, isCompleted: true });
    const pendingTasks = totalTasks - completedTasks;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0,0,0,0);

    const completionByDay = await Task.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(userId),
                isCompleted: true,
                updatedAt: { $gte: sevenDaysAgo }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const found = completionByDay.find(item => item._id === dateStr);
        weeklyData.push({
            name: dayName,
            completed: found ? found.count : 0
        });
    }

    return {
        overview: [
            { name: "Completed", value: completedTasks },
            { name: "Pending", value: pendingTasks }
        ],
        weeklyData
    };
};

module.exports = {
    getAllTasks,
    createTask,
    createTasksBatch,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskAnalytics
};
