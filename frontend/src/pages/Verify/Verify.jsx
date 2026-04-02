import axios from "axios"
import {useState} from "react"
import {useLocation,useNavigate} from "react-router-dom"
import "./Verify.css"
const Verify = () =>{
    const location = useLocation()
    const emailRegistered = location.state?.email || ""
    const [verifyData, setVerifyData] = useState({
        email : emailRegistered,
        otp : ""
    })

    const navigate = useNavigate()
    const handleVerify = async (e)=>{
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:5000/api/auth/verify",verifyData)
            alert(response.data.message)
            navigate('/login')
        }catch(err){
            alert(err.response.data.message)
        }
    }
    return (

        <form onSubmit={handleVerify}>
        <div className="formContainer">
        <label htmlFor="otp" >Enter OTP</label>
        <input 
        type="number"
        value={verifyData.otp}
        onChange={(e)=>setVerifyData({...verifyData,otp : e.target.value})}
        placeholder="Enter 6 digit passcode : "
        required
        />
        <button type="submit">
            Verify
        </button>
        </div>
        </form>
    )
}

export default Verify