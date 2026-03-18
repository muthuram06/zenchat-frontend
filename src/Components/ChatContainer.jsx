import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { BiPowerOff } from 'react-icons/bi'
import { IoMdSend } from 'react-icons/io'
import api from '../Utils/api'


const ChatContainer = ({ currentChat, currentUser, setCurrentChat, socket, headers }) => {
    const [msg, setMsg] = useState('')
    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)

    const chatContainerRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }
    useEffect(() => {
        const fetchMessages = async () => {
            if (currentChat) {
                try {
                    const response = await api.post('/messages/inbox', {
                        from: currentUser._id,
                        to: currentChat._id
                    }, { headers })
                    setMessages(response.data)
                } catch (error) {
                    console.log(error.message)
                }
            }
        }
        fetchMessages()
    }, [currentChat])
    const handleCloseChat = () => {
        setCurrentChat(undefined)
    }
    const handleSendMsg = async (e) => {
        e.preventDefault()
        if (msg !== "") {
            try {
                let message = msg
                setMessages([...messages, { fromSelf: true, message: message }])
                setMsg("")
                if (currentChat) {
                    socket.current.emit("send-msg", {
                        "to": currentChat._id,
                        "message": message
                    })
                }

                await api.post('/messages', {
                    from: currentUser._id,
                    to: currentChat._id,
                    message: message
                }, { headers })
            } catch (error) {
                console.log(error.message)
            }
        }
    }
    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg })

            })
        }
    }, [socket])
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])
    return (
        <Container>
            <div className="chat-header">
                <div className="chatUser">
                    <img src={currentChat.AvatarImage} alt="" />
                    <h3>{currentChat.username}</h3>
                </div>
                <div className="logout">
                    <BiPowerOff onClick={handleCloseChat} />
                </div>
            </div>
            <div className="messages" ref={chatContainerRef}>
                <div className="chats">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                            <p>{message.message}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-sender">
                <form onSubmit={handleSendMsg}>
                    <input type='text' placeholder='Type to send message...' value={msg} onChange={(e) => setMsg(e.target.value)} />
                    <button type='submit'><IoMdSend /></button>
                </form>
            </div>
        </Container>
    )
}

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: 8% 88% 4% ;
    color: white;
    .chat-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #252547;
        padding: 1rem;
        .chatUser{
            display: flex;
        justify-content: left;
        align-items: center;
        gap: 1rem;
        background-color: #252547;
        img{
            width: 3rem;
            border:2.5px solid #30a206;
            border-radius: 50%;
        }
        }
    }
    .messages{
        height: 70vh;
        overflow-y: scroll;
        &::-webkit-scrollbar{
            width: 0.2rem;
            &-thumb{
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .chats{
        display: flex;
        gap: 10px;
        flex-direction: column;
        width: 100%;
        .message{
            display: flex;
            p{
                overflow-wrap: break-word;
                max-width: 40%;
                padding: 0.6rem 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
            }
        }
        .sended{
            justify-content: flex-end;
            p{
                background-color: purple;
            }
            }
        .recieved{
            justify-content: flex-start;
            p{
                background-color: #151551;
            }
        }
    }
    }
    .chat-sender{
        width: 100%;
        display: flex;
        align-items: center;
        height: 100%;
        form{
            display: flex;
            justify-content: space-between;
            width: 100%;
            background-color: #2e2e75;
            border-radius: 2rem;
            color: white;
            padding: 0.5rem;
            input{
                width: 90%;
                outline: none;
                border: none;
                background-color: inherit;
                color: white;
                font-size: 1rem;
            }
            button{
                cursor: pointer;
                color: white;
                border: none;
                outline: none;
                background-color: inherit;
                font-size: 1rem;
            }
        }
    }
`
export default ChatContainer