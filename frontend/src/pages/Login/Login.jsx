import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import "../../styles/Auth.css"

const Login = () => {
    const navigate = useNavigate()
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("token", data.token)
            toast.success(data.message || "Logged in successfully!")
            navigate("/tasks")
            window.location.reload(); // To refresh NavBar stats
        } catch (err) {
            toast.error(err.message || "Login failed")
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p>Login to manage your daily tasks</p>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input name="email" type="email" onChange={handleChange} value={loginData.email} placeholder="name@company.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" onChange={handleChange} value={loginData.password} placeholder="••••••••" required />
                    </div>
                    <Link to="/forgot" className="forgot-link">Forgot password?</Link>
                    <button type="submit" className="auth-btn">Login to Account</button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Create one for free</Link>
                </div>
            </div>
        </div>
    )
}

export default Login