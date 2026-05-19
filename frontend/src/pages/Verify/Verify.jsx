import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import "../../styles/Auth.css"

const Verify = () => {
    const location = useLocation()
    const emailRegistered = location.state?.email || ""
    const [otp, setOtp] = useState("")
    const navigate = useNavigate()

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailRegistered, otp })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Verification failed");

            toast.success(data.message || "Account verified!")
            navigate('/login')
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2>Verify Email</h2>
                <p>We've sent a 6-digit code to <b>{emailRegistered}</b></p>
                <form onSubmit={handleVerify}>
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
                    <button type="submit" className="auth-btn">Verify Account</button>
                </form>
                <div className="auth-footer">
                    Didn't receive the code? <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}>Resend</button>
                </div>
            </div>
        </div>
    )
}

export default Verify