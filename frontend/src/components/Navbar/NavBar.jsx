import { useNavigate, NavLink, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"
import "./NavBar.css"
const NavBar = () =>{
    const navigate = useNavigate()
    const [userData, setUserData] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [hoveredStat, setHoveredStat] = useState(null) // 'level', 'points', 'streak'
    const token = localStorage.getItem("token")

    useEffect(() => {
        if (token) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch("http://localhost:5000/api/auth/me", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUserData(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch user data", err);
                }
            }
            fetchUserData();
        }
    }, [token]);

    useEffect(() => {
        const handleRefresh = () => {
            if (token) {
                fetch("http://localhost:5000/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(res => res.json())
                .then(data => setUserData(data));
            }
        };
        window.addEventListener("refresh-stats", handleRefresh);
        return () => window.removeEventListener("refresh-stats", handleRefresh);
    }, [token]);
    const handleLogout = ()=>{
        localStorage.removeItem("token")
        toast.success("Logged out successfully")
        navigate("/")
    }
    return (
            <nav className="Nvbr">
                <div className="navContainer">
                    <div className="navBrand" onClick={() => navigate("/tasks")}>
                        <span className="brandIcon">毎日</span>
                        <h1>Tasks</h1>
                    </div>

                    {token && userData && (
                        <div className="navStats">
                            <motion.div 
                                className="statItem" 
                                onMouseEnter={() => setHoveredStat('level')}
                                onMouseLeave={() => setHoveredStat(null)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.span 
                                    className="statIcon"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                >
                                    ⭐
                                </motion.span>
                                <span className="statValue">Lvl {Math.floor((userData.points || 0) / 50) + 1}</span>
                                <AnimatePresence>
                                    {hoveredStat === 'level' && (
                                        <motion.div className="statTooltip" initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} exit={{opacity:0}}>
                                            <p>Next Level in <b>{50 - (userData.points % 50)}</b> pts</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            <motion.div 
                                className="statItem" 
                                onMouseEnter={() => setHoveredStat('points')}
                                onMouseLeave={() => setHoveredStat(null)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.span 
                                    className="statIcon"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                >
                                    🪙
                                </motion.span>
                                <span className="statValue">{userData.points || 0}</span>
                                <AnimatePresence>
                                    {hoveredStat === 'points' && (
                                        <motion.div className="statTooltip" initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} exit={{opacity:0}}>
                                            <p>Earned <b>+10 pts</b> per task</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            <motion.div 
                                className="statItem" 
                                onMouseEnter={() => setHoveredStat('streak')}
                                onMouseLeave={() => setHoveredStat(null)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <motion.span 
                                    className="statIcon"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                                >
                                    🔥
                                </motion.span>
                                <span className="statValue">{userData.currentStreak || 0}</span>
                                <AnimatePresence>
                                    {hoveredStat === 'streak' && (
                                        <motion.div className="statTooltip" initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} exit={{opacity:0}}>
                                            <p>Complete tasks daily to grow!</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    )}
                    {token ? (
                        <div className="navLinks">
                            <NavLink to="/tasks" className={({isActive}) => isActive ? "navItem active" : "navItem"}>
                                Tasks
                                <motion.div className="activeLine" layoutId="activeLine" />
                            </NavLink>
                            <NavLink to="/history" className={({isActive}) => isActive ? "navItem active" : "navItem"}>
                                History
                                <motion.div className="activeLine" layoutId="activeLine" />
                            </NavLink>
                            <NavLink to="/dashboard" className={({isActive}) => isActive ? "navItem active" : "navItem"}>
                                Dashboard
                                <motion.div className="activeLine" layoutId="activeLine" />
                            </NavLink>
                            
                            <div className="userProfile">
                                <button className="profileBtn" onClick={() => setShowDropdown(!showDropdown)}>
                                    <span className="userIcon">👤</span>
                                    {userData?.name?.split(' ')[0]}
                                </button>
                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div 
                                            className="profileDropdown"
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        >
                                            <div className="dropdownInfo">
                                                <p className="dName">{userData?.name}</p>
                                                <p className="dEmail">{userData?.email}</p>
                                            </div>
                                            <hr />
                                            <button className="dropdownItem logoutBtn" onClick={handleLogout}>
                                                Log out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div className="navLinks">
                            <Link to="/login" className="navItem">Login</Link>
                            <Link to="/register" className="navItem registerBtn">Register</Link>
                        </div>
                    )}
                    
                </div>
            </nav>
    )
}
export default NavBar