import {useState} from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import "./Reset.css"
const Reset = ()=>{
    const [otp,setOtp] = useState("")
    const [password,setPassword] = useState("")
    const [resetMode,setResetMode] = useState(false)
    const location = useLocation()
    const email = location.state?.email || ""
    const navigate = useNavigate()
    
    
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const otpCorr = {
            email : email,
            otp : otp
        }

        try{
            const response = await axios.post("http://localhost:5000/api/auth/verify",otpCorr)
            alert(response.data.message)
            setResetMode(true)
        }catch(err){
            console.error(err.response?.data?.message)
        }
    }
    const handleChange = async (e) =>{
        e.preventDefault()
        const resetData = {
            email : email,
            password : password,
        }
        try{
            const response = await axios.post("http://localhost:5000/api/auth/reset-password",resetData)
            alert(response.data.message)
            setResetMode(false)
            navigate("/login")
        }catch(err){
            alert(err.response?.data?.message)
        }
    }
    return(
        <div>
            {!resetMode ? (
                <form onSubmit={handleSubmit}>
                <div className="formContainer">
                    <input type="number" value={otp} onChange={(e)=>{setOtp(e.target.value)}} placeholder="Enter 6 digit otp : "/>
                    <button type="submit">Verify OTP</button>
                </div>
                </form>
            ) : (
                <form onSubmit={handleChange}>
                <div className="formContainer">
                    <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder="Enter new passoword : "/>
                    <button type="submit">Update Password</button>
                </div>
                </form>
            )}
        </div>
    )
}
export default Reset