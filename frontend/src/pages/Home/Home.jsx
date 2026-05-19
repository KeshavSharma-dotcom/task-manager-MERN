import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import "./Home.css";

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/tasks");
        }
    }, [navigate]);

    return (
        <div className="homeContainer">
            <motion.section 
                className="heroSection"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <span className="heroBadge">✨ AI-Powered Productivity</span>
                <h1 className="heroTitle">Organize your day, <br/> The smart way.</h1>
                <p className="heroSubtitle">
                    Experience a gamified task manager that uses AI to break down your massive projects <br/>
                    into actionable steps while rewarding your consistency with points and streaks.
                </p>
                <div className="heroActions">
                    <button className="getStartedBtn" onClick={() => navigate("/register")}>
                        Get Started for Free
                    </button>
                    <button className="cancel-btn" style={{padding: '16px 32px'}} onClick={() => navigate("/login")}>
                        Login to Account
                    </button>
                </div>
            </motion.section>

            <motion.section 
                className="featuresGrid"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
            >
                <div className="featureCard">
                    <span className="featureIcon">✨</span>
                    <h3>AI Breakdown</h3>
                    <p>Stop feeling overwhelmed. Our Gemini-powered AI breaks massive tasks into 5 actionable sub-tasks instantly.</p>
                </div>
                <div className="featureCard">
                    <span className="featureIcon">🔥</span>
                    <h3>Gamified Streaks</h3>
                    <p>Stay motivated with daily streaks, level up your productivity, and earn points for every task you complete.</p>
                </div>
                <div className="featureCard">
                    <span className="featureIcon">📊</span>
                    <h3>Smart Analytics</h3>
                    <p>Track your progress with beautiful, interactive charts that show your daily performance and completion rates.</p>
                </div>
            </motion.section>
        </div>
    );
}

export default Home;