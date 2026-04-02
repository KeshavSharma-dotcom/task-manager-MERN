import Register from "../Register/Register"
import { useNavigate } from "react-router-dom"
import "./Home.css"
const Home = () =>{
    const navigate = useNavigate()
    return(
        <div className="homeContainer">
            <div className="homeHeaders">
                <h1 className="coHead1">Organize your day</h1>
                <h1 className="coHead2">Define daily important tasks easily</h1>
                <button onClick={()=>navigate("/register")} style={{scale:"1.05"}} >
                    Register Now
                </button>
            </div>
            
        </div>
    )    
}
export default Home