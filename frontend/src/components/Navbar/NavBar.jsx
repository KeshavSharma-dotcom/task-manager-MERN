import {useNavigate} from "react-router-dom"
import "./NavBar.css"
const NavBar = () =>{
    const navigate = useNavigate()
    return (
            <nav className="Nvbr">
                <div className="navContainer">
                    <h1>毎日-Mai Nichi Tasks</h1>
                    <div className="navButtonContainer">
                        <button className="navButtons" onClick={()=>{navigate("/")}}>Home</button>
                        <button className="navButtons" onClick={()=>{navigate("/login")}}>Login</button>
                        <button className="navButtons" onClick={()=>{navigate("register")}}>Register</button>
                        {/* <button onClick={navigate("/contact")}>Contact</button> */}
                    </div>
                </div>
            </nav>
    )
}
export default NavBar