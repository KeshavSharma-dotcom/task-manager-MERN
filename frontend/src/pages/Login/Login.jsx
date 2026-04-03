import axios from "axios"
import { useState } from "react"
import { useLocation,useNavigate } from "react-router-dom"

const Login = ()=>{
    const naviagte = useNavigate()
    const [loginData, setLoginData] = useState({
        email: "",
        password : ""
    })
    const handleChange = (e)=>{
        setLoginData({...loginData, [e.target.name] : e.target.value})
    }
    const handleLogin = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/api/auth/login", loginData)
            const token = response.data.token
            localStorage.setItem("token",token)
            alert(response.data.message)
            naviagte("/tasks")
        }catch(err){
            alert(err.response.data.message || "Login failed")
        }
    }
    return(
        <form onSubmit={handleLogin}>
            <div className="formContainer">
                <label>Email</label>
                <input name="email" onChange={handleChange} value={loginData.email} placeholder="Email: "/>
                <label>Password</label>
                <input name="password" onChange={handleChange} value={loginData.password} placeholder="Password: "/>
                <a href="/register">Don't have an account!</a>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}
export default Login