import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast"
import "../../styles/Auth.css"

const Forgot = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")

    const handleSend = async (e) => {
        e.preventDefault()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email address!");
        }
        try {
            const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to send OTP");

            toast.success(data.message || "OTP sent to your email")
            navigate("/reset", { state: { email: email } })
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Forgot Password?</h2>
                <p>Enter your email and we'll send you an OTP to reset your password.</p>
                <form onSubmit={handleSend}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required />
                    </div>
                    <button type="submit" className="auth-btn">Send Reset OTP</button>
                </form>
                <div className="auth-footer">
                    Remembered your password? <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Forgot