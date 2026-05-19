const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/taskRoutes");
const authRoute = require("./routes/authRoutes");
const handleError = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Custom Request Logger
app.use((req, res, next) => {
    const time = new Date().toLocaleDateString();
    const method = req.method;
    const url = req.url;
    console.log(`${time} ${method} is running on ${url}`);
    next();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(handleError);

module.exports = app;
