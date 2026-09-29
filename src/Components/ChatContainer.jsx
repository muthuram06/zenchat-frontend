import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  FiArrowLeft,
  FiMoreVertical,
  FiSend,
  FiSmile,
} from "react-icons/fi";
import api from "../Utils/api";

const ChatContainer = ({
  currentChat,
  currentUser,
  setCurrentChat,
  socket,
  headers,
}) => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;

      try {
        const response = await api.post(
          "/messages/inbox",
          {
            from: currentUser._id,
            to: currentChat._id,
          },
          { headers }
        );

        setMessages(response.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchMessages();
  }, [currentChat, currentUser, headers]);

  useEffect(() => {
    if (!socket.current) return;

    const receiveMessage = (message) => {
      setMessages((prev) => [
        ...prev,
        {
          fromSelf: false,
          message,
        },
      ]);
    };

    socket.current.on("msg-recieve", receiveMessage);

    return () => {
      socket.current?.off(
        "msg-recieve",
        receiveMessage
      );
    };
  }, [socket]);

  const handleCloseChat = () => {
    setCurrentChat(undefined);
  };

  const handleSendMsg = async (e) => {
    e.preventDefault();

    const message = msg.trim();

    if (!message) return;

    try {
      setMessages((prev) => [
        ...prev,
        {
          fromSelf: true,
          message,
        },
      ]);

      setMsg("");

      socket.current?.emit("send-msg", {
        to: currentChat._id,
        message,
      });

      await api.post(
        "/messages",
        {
          from: currentUser._id,
          to: currentChat._id,
          message,
        },
        { headers }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Container>
      <header className="chat-header">
        <div className="user-area">
          <button
            className="back-button"
            onClick={handleCloseChat}
          >
            <FiArrowLeft />
          </button>

          <div className="avatar">
            <img
              src={currentChat.AvatarImage}
              alt={currentChat.username}
            />
            <span />
          </div>

          <div>
            <h3>{currentChat.username}</h3>
            <p>
              <span />
              Online
            </p>
          </div>
        </div>

        <button className="more-button">
          <FiMoreVertical />
        </button>
      </header>

      <div className="chat-body" ref={chatContainerRef}>
        <div className="date-label">
          <span>MESSAGES</span>
        </div>

        <div className="chats">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-icon">👋</div>
              <h3>Start the conversation</h3>
              <p>
                Send a message to {currentChat.username}
                and start chatting.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.fromSelf
                    ? "sent"
                    : "received"
                }`}
              >
                <p>{message.message}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="composer-area">
        <form onSubmit={handleSendMsg}>
          <button
            type="button"
            className="icon-button"
            title="Emoji"
          >
            <FiSmile />
          </button>

          <input
            type="text"
            placeholder={`Message ${currentChat.username}...`}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />

          <button
            type="submit"
            className="send-button"
            disabled={!msg.trim()}
          >
            <FiSend />
          </button>
        </form>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 72px minmax(0, 1fr) 82px;
  color: white;
  background:
    radial-gradient(
      circle at 75% 15%,
      #29225b22,
      transparent 30%
    ),
    #0b0d17;
  overflow: hidden;

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 22px;
    border-bottom: 1px solid #ffffff0a;
    background: #10121ee8;
    backdrop-filter: blur(12px);
  }

  .user-area {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .back-button,
  .more-button {
    border: none;
    background: transparent;
    color: #777c92;
    cursor: pointer;
    display: grid;
    place-items: center;
    font-size: 19px;
  }

  .back-button {
    display: none;
  }

  .avatar {
    position: relative;

    img {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      object-fit: cover;
      background: #202337;
    }

    span {
      position: absolute;
      right: 0;
      bottom: 1px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #45d483;
      border: 2px solid #10121e;
    }
  }

  .user-area h3 {
    margin: 0 0 4px;
    font-size: 14px;
  }

  .user-area p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    color: #45d483;
    font-size: 10px;
  }

  .user-area p span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #45d483;
  }

  .chat-body {
    overflow-y: auto;
    padding: 28px 6%;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ffffff12;
      border-radius: 10px;
    }
  }

  .date-label {
    display: flex;
    justify-content: center;
    margin-bottom: 25px;

    span {
      padding: 6px 11px;
      border-radius: 20px;
      background: #ffffff06;
      color: #565b70;
      font-size: 9px;
      letter-spacing: 1.5px;
    }
  }

  .chats {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .message {
    display: flex;

    p {
      max-width: min(65%, 520px);
      margin: 0;
      padding: 12px 16px;
      line-height: 1.45;
      font-size: 13px;
      overflow-wrap: anywhere;
      border-radius: 17px;
    }
  }

  .sent {
    justify-content: flex-end;

    p {
      color: white;
      background: linear-gradient(
        135deg,
        #7664ff,
        #9850dc
      );
      border-bottom-right-radius: 5px;
      box-shadow: 0 8px 20px #6d5cff18;
    }
  }

  .received {
    justify-content: flex-start;

    p {
      color: #c7c9d5;
      background: #171a29;
      border: 1px solid #ffffff07;
      border-bottom-left-radius: 5px;
    }
  }

  .empty-chat {
    min-height: 280px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #70758b;
  }

  .empty-icon {
    width: 58px;
    height: 58px;
    display: grid;
    place-items: center;
    border-radius: 18px;
    background: #7564ff12;
    font-size: 25px;
    margin-bottom: 15px;
  }

  .empty-chat h3 {
    color: #c5c7d3;
    margin: 0 0 7px;
    font-size: 16px;
  }

  .empty-chat p {
    max-width: 260px;
    margin: 0;
    line-height: 1.5;
    font-size: 11px;
  }

  .composer-area {
    display: flex;
    align-items: center;
    padding: 13px 5%;
    border-top: 1px solid #ffffff0a;
    background: #0e101b;
  }

  form {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px;
    border-radius: 16px;
    background: #171a29;
    border: 1px solid #ffffff09;
  }

  input {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    background: transparent;
    color: white;
    font-size: 13px;
  }

  input::placeholder {
    color: #595e73;
  }

  .icon-button,
  .send-button {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }

  .icon-button {
    background: transparent;
    color: #686e84;
    font-size: 18px;
  }

  .send-button {
    color: white;
    background: linear-gradient(
      135deg,
      #7564ff,
      #a04fe0
    );
    font-size: 17px;
    transition: 0.2s;
  }

  .send-button:disabled {
    opacity: 0.35;
    cursor: default;
  }

  @media (max-width: 600px) {
    .back-button {
      display: grid;
    }

    .chat-header {
      padding: 0 15px;
    }

    .chat-body {
      padding: 20px 15px;
    }

    .composer-area {
      padding: 10px;
    }

    .message p {
      max-width: 80%;
    }
  }
`;

export default ChatContainer;