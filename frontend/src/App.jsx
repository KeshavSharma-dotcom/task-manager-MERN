import {Routes, Route} from "react-router-dom"
import Layout from "./pages/Layout/Layout"
import Home from "./pages/Home/Home"
import Register from "./pages/Register/Register"
import Verify from "./pages/Verify/Verify"
import Login from "./pages/Login/Login"
import Tasks from "./pages/Tasks/Tasks"
const App = ()=>{
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route path="/register" element={<Register/>}/>
                <Route path="/" element={<Home/>} />
                <Route path="/verify" element={<Verify/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/tasks" element={<Tasks/>}/>
            </Route>
        </Routes>
    )
}

export default App