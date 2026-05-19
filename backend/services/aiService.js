const { GoogleGenerativeAI } = require("@google/generative-ai");

const breakdownTask = async (taskName) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing. Please add it to your .env file.");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Use gemini-1.5-flash as it is the standard fast model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Take the following task and break it down into 3 to 5 simple, actionable sub-tasks.
Task: "${taskName}"

IMPORTANT: Return ONLY a valid JSON array of strings. Do NOT wrap it in markdown blockquotes like \`\`\`json. Just the raw array. Example: ["Subtask 1", "Subtask 2"]`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Clean up potentially markdown-wrapped json
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const subTasks = JSON.parse(cleanText);
        
        if (!Array.isArray(subTasks)) {
            throw new Error("AI did not return an array");
        }
        
        return subTasks;
    } catch (error) {
        console.error("AI Breakdown Error:", error);
        throw new Error("Failed to generate task breakdown from AI. Ensure your API key is valid.");
    }
};

module.exports = { breakdownTask };
