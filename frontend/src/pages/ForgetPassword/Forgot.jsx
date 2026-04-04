import axios from "axios";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import "./Forgot.css"
const Forgot = ()=>{
    const navigate = useNavigate()
    const [email,setEmail] = useState("")
    const handleSend = async (e)=>{
        e.preventDefault()
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return alert("Please enter a valid email address!");
        }
        try{
            const response = await axios.post("http://localhost:5000/api/auth/forgot-password",{email})
            alert(response.data.message)
            navigate("/reset",{state : {email : email}})
        }catch(err){
            alert(err.response?.data?.message)
        }
    }
    return(
        <form onSubmit={handleSend}>
        <div className="formContainer">
            <input type="email" onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter email: " />
            <button type="submit">Send OTP</button>
        </div>
        </form>
    )
}
export default Forgot