import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate()
    const handleLogout = ()=>{
        localStorage.removeItem('chat-app-user')
        navigate('/login')
    }
  return (
    <div>
        <h4 style={{color:'red',cursor:'pointer'}} onClick={handleLogout}>LogOut</h4>
    </div>
  )
}

export default Logout