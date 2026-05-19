import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/api/tasks/analytics", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error("Failed to fetch analytics");
                const data = await response.json();
                setAnalytics(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return <h1 className="dash-loading">Loading Analytics...</h1>;
    }

    const COLORS = ['#4ade80', '#fbbf24'];

    return (
        <div className="dashboard-container">
            <div className="dash-header">
                <h1>Productivity Dashboard 📊</h1>
                <button onClick={() => navigate("/tasks")} className="back-btn">← Back to Tasks</button>
            </div>

            <div className="charts-grid">
                <div className="chart-card">
                    <h2>Completed vs Pending</h2>
                    <div className="pie-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics?.overview}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics?.overview.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card">
                    <h2>Tasks Completed (Last 7 Days)</h2>
                    <div className="bar-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics?.weeklyData}>
                                <XAxis dataKey="name" stroke="#fff" />
                                <YAxis allowDecimals={false} stroke="#fff" />
                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px'}} />
                                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
