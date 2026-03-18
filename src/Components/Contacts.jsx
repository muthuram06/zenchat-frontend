import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import logo from '../assets/logo.svg'
import Logout from './Logout'

const Contacts = ({contacts,currentUser,changeChat}) => {
    const [currentUsername,setCurrentUsername] = useState(undefined)
    const [currentUserImage,setCurrentUserImage] = useState(undefined)
    const [currentSelected,setCurrentSelected] = useState(undefined)
    useEffect(()=>{
        if(currentUser){
            setCurrentUsername(currentUser.username)
            setCurrentUserImage(currentUser.AvatarImage)
        }
    },[currentUser])
    const changeCurrentChat = (item,index)=>{
        setCurrentSelected(index)
        changeChat(item)
    }
  return (
    <Container>
        <div className="brand">
            <img src={logo} alt="" />
            <h3>ZenChat</h3>
        </div>
        <div className="contacts">
            {currentUsername && currentUserImage &&(
                contacts.map((item,index)=>(
                    <div key={index} className={`contact ${currentSelected===index?"selected":""}`} onClick={()=>changeCurrentChat(item,index)}>
                        <img src={item.AvatarImage} alt="" />
                        <h4>{item.username}</h4>
                    </div>
                ))
            ) }
        </div>
        <div className="user">
        {currentUser &&(
                    <div  className="userCard">
                        <img src={currentUserImage} alt="" />
                        <div>
                        <h2>{currentUsername}</h2>
                        <Logout />
                        </div>
                    </div>
            ) }
        </div>
    </Container>
  )
}
const Container = styled.div`
    overflow: hidden;
    height: 100%;
    padding-top: 20px;
    color: white;
    display: grid;
    grid-template-rows:10% 75% 15%;
    background-color: #17172c;
    .brand{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        img{
            width: 3rem;
        }
    }
    .contacts{
        padding-top:20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: scroll;
        gap: 1rem;
        &::-webkit-scrollbar{
            width: 0.2rem;
            &-thumb{
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact{
            width: 90%;
            padding: 0.4rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            background-color: #212143;
            img{
                margin-left: 2rem;
                width: 3rem;
            }
        }
        .selected{
            background-color: #3c3c71;
        }
    }
    .user{
        display: flex;
        justify-content: center;
        align-items: center;
        .userCard{
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            align-items: center;
            img{
                width: 4rem;
            }
        }
        
    }
`
export default Contacts