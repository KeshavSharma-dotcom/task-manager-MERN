import {useNavigate,Link} from "react-router-dom"
import "./NavBar.css"
const NavBar = () =>{
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const handleLogout = ()=>{
        localStorage.removeItem("token")
        alert("Logged out successfully")
        navigate("/")
    }
    return (
            <nav className="Nvbr">
                <div className="navContainer">
                    <h1>毎日-Mai Nichi Tasks</h1>
                    {token ? (
                        <div className="navButtonContainer">
                            <button onClick={()=>{navigate("/tasks")}}>Tasks</button>
                            <button onClick={()=>handleLogout()}>Log out</button>
                        </div>
                    ) : (
                    <div className="navButtonContainer">
                        
                        <button className="navButtons" onClick={()=>{navigate("/login")}}>Login</button>
                        <button className="navButtons" onClick={()=>{navigate("register")}}>Register</button>       
                    </div>
                    )}
                    
                </div>
            </nav>
    )
}
export default NavBar