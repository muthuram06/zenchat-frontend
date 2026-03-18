import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {Link, useNavigate} from 'react-router-dom'
import Logo from '../assets/logo.svg'
import {ToastContainer,toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import api from '../Utils/api'
import Load from '../assets/loader.gif'

const Login = () => {
    useEffect(()=>{
        if(localStorage.getItem('chat-app-user')){
            navigate('/')
        }
    },[])
    const navigate = useNavigate()
    const [loader, setLoader] = useState(false)
    const [values,setValues] = useState({
        username:"",
        password:""
    })
    const toastOption = {
        position:'bottom-right',
        autoClose: 8000,
        pauseOnHover:true,
        draggable:true,
        theme:"dark"
    }
    const handleSubmit =async(e)=>{
        setLoader(true)
        e.preventDefault()
        if(handleValidation()){
            try {
                const {username,password} = values
                const userData = {username,password}
                const {data} = await api.post('/auth/login',userData)
                if(data.status === false){
                    setLoader(false)
                    toast.error(data.message,toastOption)
                }
                if(data.status === true){
                    setLoader(false)
                    localStorage.setItem('chat-app-user',JSON.stringify(data.user))
                    if(data.user.isAvatarImage){
                        navigate('/')
                    }
                    else{
                        navigate('/avatar')
                    }
                }
            } catch (error) {
                setLoader(false)
                console.log(error.message)
            }
            
        }
    }
    const handleValidation =()=>{
        const {username,password} = values
        if(username === ""){
            setLoader(false)
            toast.error("username is required",toastOption)
            return false
        }
        else if(password === ""){
            setLoader(false)
            toast.error("password is required",toastOption)
            return false
        }
        return true
    }
    const handleChange =(e)=>{
        setValues({...values, [e.target.name] : e.target.value})
    }
  return (
    <>{(loader)?(<FormContainer>
        <img src={Load} alt="" />
    </FormContainer>):(
        <FormContainer>
            <form onSubmit={e=>handleSubmit(e)}>
                <div className="brand">
                    <img src={Logo} alt="" />
                    <h1>ZenChat</h1>
                </div>
                <input type="text" placeholder='Username' name='username' onChange={e=>handleChange(e)} />
                <input type="password" placeholder='Password' name='password' onChange={e=>handleChange(e)} />
                <button type='submit'>Log In</button>
                <span>Don't have an account ? <Link to={'/register'}>Register</Link></span>
            </form>
        </FormContainer>)}
        <ToastContainer/>
    </>
  )
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #1b1b34;
    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #0e0e1a;
        padding: 3rem 3.5rem;
        color: white;
        gap: 1rem;
        border-radius: 2.5rem;
        input{
            color:white ;
            padding: 0.7rem;
            width: 100%;
            border-radius: 0.4rem;
            border: 0.1rem solid blue;
            font-size: 1rem;
            background-color: inherit;
            &:active{
                border: 0.1rem solid purple;
                background-color: inherit;
                color:white;
            }
        }
        button{
            margin-top: 1rem;
            padding: 0.7rem;
            width: 100%;
            border-radius: 0.4rem;
            background-color: #c367c3;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            transition: all 0.3s ease-in-out;
            cursor: pointer;
            &:hover{
                background-color: purple;
            }
        }
        span{
            a{
                color: blue;
                text-decoration: none;
            }
        }
    }
    .brand{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 1rem;
        align-items: center;
        img{
            height: 4rem;
            margin-right: 5px;
        }
    }
`
export default Login