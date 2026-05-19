import {Routes, Route} from "react-router-dom"
import Layout from "./pages/Layout/Layout"
import Home from "./pages/Home/Home"
import Register from "./pages/Register/Register"
import Verify from "./pages/Verify/Verify"
import Login from "./pages/Login/Login"
import Forgot from "./pages/ForgetPassword/Forgot"
import Reset from "./pages/ForgetPassword/Reset"
import Tasks from "./pages/Tasks/Tasks"
import Dashboard from "./pages/Dashboard/Dashboard"
import History from "./pages/History/History"

import { Toaster } from 'react-hot-toast'

const App = ()=>{
    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/" element={<Home/>} />
                    <Route path="/verify" element={<Verify/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/tasks" element={<Tasks/>}/>
                    <Route path="/forgot" element={<Forgot/>}/>
                    <Route path="/reset" element={<Reset/>}/>
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    <Route path="/history" element={<History/>}/>
                </Route>
            </Routes>
        </>
    )
}

export default App