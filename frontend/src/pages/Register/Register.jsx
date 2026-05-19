import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import "../../styles/Auth.css"

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address!");
        }

        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Registration failed");

            toast.success(data.message || "Registration successful! Please verify.")
            navigate("/verify", { state: { email } })
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Join 毎日-Tasks</h2>
                <p>Start organizing your day with AI</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" required />
                    </div>
                    <button type="submit" className="auth-btn">Create Free Account</button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    )
}

export default Register