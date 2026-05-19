require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});