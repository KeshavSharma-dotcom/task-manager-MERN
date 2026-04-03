import axios from "axios"
import {useState} from "react"
import {useNavigate} from "react-router-dom"
import "./Register.css"
const Register = () =>{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const naviagte = useNavigate()
    const formData = {
        name : name,
        email : email,
        password:password
    }
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/api/auth/register",formData)
            alert(response.data.message)
            naviagte("/verify", {state : {email : formData.email}})
        }catch(err){
            alert(err.response.data.message)
        }
    }
    return (

        <form onSubmit={handleSubmit}>
        <div className="formContainer">
        <label htmlFor="name" >Name</label>
        <input 
        name="name"
        type="text"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        placeholder="Name : "
        required
        />
        <label htmlFor="email" >Email</label>
        <input 
        name="email"
        type="email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        placeholder="Email : "
        required
        />
        <label htmlFor="password" >Password</label>
        <input 
        name="password"
        type="password"
        value={password}
        onChange={(e)=>setPass(e.target.value)}
        placeholder="Password : "
        required
        />
        <a href="/login">already have an account</a>
        <button type="submit">
            Submit
        </button>
        </div>
        </form>
    )
}

export default Register