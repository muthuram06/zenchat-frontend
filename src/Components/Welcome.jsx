import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import welcome from '../assets/robot.gif'

const Welcome = ({currentUser}) => {
    const [currentUsername,setCurrentUsername] = useState(undefined)
    useEffect(()=>{
        if(currentUser){
            setCurrentUsername(currentUser.username)
        }
    },[currentUser])
  return (
    <Container>
        <img src={welcome} alt="" />
        <h1>Hello <span>{currentUsername}</span> !!!</h1>
        <h3>Please select a chat to start messaging ...</h3>
    </Container>
  )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    img{
        width: 50%;
    }
    h1{
        span{
            color: blue;
        }
    }
`
export default Welcome