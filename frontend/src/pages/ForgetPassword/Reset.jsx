import { useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import "../../styles/Auth.css"

const Reset = () => {
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [resetMode, setResetMode] = useState(false)
    const location = useLocation()
    const email = location.state?.email || ""
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:5000/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Verification failed");

            toast.success(data.message || "OTP Verified!")
            setResetMode(true)
        } catch (err) {
            toast.error(err.message)
        }
    }

    const handleChange = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:5000/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Reset failed");

            toast.success(data.message || "Password reset successful!")
            navigate("/login")
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>{resetMode ? "Set New Password" : "Verify Reset OTP"}</h2>
                <p>{resetMode ? "Almost there! Choose a strong password." : `Enter the code sent to ${email}`}</p>
                
                {!resetMode ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>OTP Code</label>
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)} 
                                placeholder="000000" 
                                maxLength={6}
                                required 
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }}
                            />
                        </div>
                        <button type="submit" className="auth-btn">Verify OTP</button>
                    </form>
                ) : (
                    <form onSubmit={handleChange}>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>
                        <button type="submit" className="auth-btn">Update Password</button>
                    </form>
                )}
                
                <div className="auth-footer">
                    Wait, I remember it! <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    )
}

export default Reset