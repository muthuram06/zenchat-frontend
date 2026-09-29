import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  FiArrowLeft,
  FiMoreVertical,
  FiSend,
  FiSmile,
  FiCheck,
} from "react-icons/fi";
import api from "../Utils/api";

const EMOJIS = [
  "😀",
  "😂",
  "😍",
  "😊",
  "🔥",
  "❤️",
  "👍",
  "🎉",
  "😎",
  "🙌",
];

const ChatContainer = ({
  currentChat,
  currentUser,
  setCurrentChat,
  socket,
  headers,
}) => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  /*
  ============================================================
  AUTO SCROLL
  ============================================================
  */
  useEffect(() => {
    const container = chatContainerRef.current;

    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages]);

  /*
  ============================================================
  FETCH MESSAGES
  ============================================================
  */
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat || !currentUser || !headers) {
        return;
      }

      try {
        const response = await api.post(
          "/messages/inbox",
          {
            from: currentUser._id,
            to: currentChat._id,
          },
          {
            headers,
          }
        );

        setMessages(response.data || []);
      } catch (error) {
        console.error(
          "Failed to fetch messages:",
          error.message
        );
      }
    };

    fetchMessages();
  }, [currentChat, currentUser, headers]);

  /*
  ============================================================
  SOCKET MESSAGE RECEIVER
  ============================================================
  */
  useEffect(() => {
    if (!socket.current) {
      return;
    }

    const receiveMessage = (message) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          fromSelf: false,
          message,
        },
      ]);
    };

    socket.current.on(
      "msg-recieve",
      receiveMessage
    );

    return () => {
      socket.current?.off(
        "msg-recieve",
        receiveMessage
      );
    };
  }, [socket]);

  /*
  ============================================================
  CLOSE CHAT
  ============================================================
  */
  const handleCloseChat = () => {
    setShowEmojiPicker(false);
    setShowMenu(false);
    setCurrentChat(undefined);
  };

  /*
  ============================================================
  SEND MESSAGE
  ============================================================
  */
  const handleSendMsg = async (event) => {
    event.preventDefault();

    const message = msg.trim();

    if (!message || !currentChat || !currentUser) {
      return;
    }

    try {
      // Show message immediately
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          fromSelf: true,
          message,
        },
      ]);

      // Clear input
      setMsg("");

      // Close emoji picker
      setShowEmojiPicker(false);

      // Send through Socket.IO
      socket.current?.emit("send-msg", {
        to: currentChat._id,
        message,
      });

      // Save message to backend
      await api.post(
        "/messages",
        {
          from: currentUser._id,
          to: currentChat._id,
          message,
        },
        {
          headers,
        }
      );
    } catch (error) {
      console.error(
        "Failed to send message:",
        error.message
      );
    }
  };

  /*
  ============================================================
  ADD EMOJI
  ============================================================
  */
  const addEmoji = (emoji) => {
    setMsg((previousMessage) => {
      return previousMessage + emoji;
    });

    setShowEmojiPicker(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  /*
  ============================================================
  RETURN UI
  ============================================================
  */
  return (
    <Container>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="chat-header">
        <div className="user-area">
          {/* Mobile back button */}
          <button
            type="button"
            className="back-button"
            onClick={handleCloseChat}
            aria-label="Back"
          >
            <FiArrowLeft />
          </button>

          {/* User avatar */}
          <div className="avatar">
            {currentChat?.AvatarImage ? (
              <img
                src={currentChat.AvatarImage}
                alt={currentChat.username}
              />
            ) : (
              <span className="avatar-letter">
                {currentChat?.username
                  ?.charAt(0)
                  ?.toUpperCase()}
              </span>
            )}

            <span className="online-dot" />
          </div>

          {/* User details */}
          <div className="user-details">
            <h3>{currentChat?.username}</h3>

            <p>
              <span className="status-dot" />
              Active now
            </p>
          </div>
        </div>

        {/* Header menu */}
        <div className="header-actions">
          <button
            type="button"
            className="more-button"
            onClick={() =>
              setShowMenu((previous) => !previous)
            }
            aria-label="More options"
          >
            <FiMoreVertical />
          </button>

          {showMenu && (
            <div className="header-menu">
              <button
                type="button"
                onClick={handleCloseChat}
              >
                Close conversation
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =====================================================
          CHAT BODY
      ===================================================== */}

      <div
        className="chat-body"
        ref={chatContainerRef}
      >
        <div className="date-label">
          <span>CONVERSATION</span>
        </div>

        <div className="chats">
          {messages.length === 0 ? (
            /* EMPTY CHAT */
            <div className="empty-chat">
              <div className="empty-avatar">
                {currentChat?.AvatarImage ? (
                  <img
                    src={currentChat.AvatarImage}
                    alt={currentChat.username}
                  />
                ) : (
                  currentChat?.username
                    ?.charAt(0)
                    ?.toUpperCase()
                )}
              </div>

              <div className="empty-badge">
                👋
              </div>

              <h3>
                Say hello to {currentChat?.username}
              </h3>

              <p>
                Start a new conversation and send
                your first message.
              </p>
            </div>
          ) : (
            /* MESSAGES */
            messages.map((message, index) => (
              <div
                key={`${index}-${message.message}`}
                className={`message-row ${
                  message.fromSelf
                    ? "sent-row"
                    : "received-row"
                }`}
              >
                <div
                  className={`message ${
                    message.fromSelf
                      ? "sent"
                      : "received"
                  }`}
                >
                  <p>{message.message}</p>

                  {message.fromSelf && (
                    <span className="message-status">
                      <FiCheck />
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* =====================================================
          MESSAGE COMPOSER
      ===================================================== */}

      <div className="composer-area">
        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="emoji-picker">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => addEmoji(emoji)}
                aria-label={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSendMsg}>
          {/* Emoji button */}
          <button
            type="button"
            className={`icon-button ${
              showEmojiPicker ? "active" : ""
            }`}
            title="Emoji"
            aria-label="Emoji"
            onClick={() =>
              setShowEmojiPicker(
                (previous) => !previous
              )
            }
          >
            <FiSmile />
          </button>

          {/* Message input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={`Message ${
              currentChat?.username || ""
            }...`}
            value={msg}
            onChange={(event) =>
              setMsg(event.target.value)
            }
            onFocus={() => setShowMenu(false)}
            autoComplete="off"
            aria-label="Message"
          />

          {/* Send button */}
          <button
            type="submit"
            className="send-button"
            disabled={!msg.trim()}
            aria-label="Send message"
            title="Send message"
          >
            <FiSend />
          </button>
        </form>
      </div>
    </Container>
  );
};

/*
================================================================
STYLES
================================================================
*/

const Container = styled.div`
  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  display: grid;

  /*
    IMPORTANT:
    Header = 76px
    Chat body = remaining space
    Composer = fixed 82px
  */
  grid-template-rows:
    76px
    minmax(0, 1fr)
    82px;

  color: white;

  background:
    radial-gradient(
      circle at 80% 0%,
      rgba(117, 100, 255, 0.08),
      transparent 30%
    ),
    #0b0d17;

  overflow: hidden;

  position: relative;

  /*
  ==============================================================
  HEADER
  ==============================================================
  */

  .chat-header {
    min-width: 0;
    min-height: 0;

    position: relative;
    z-index: 10;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 24px;

    border-bottom:
      1px solid rgba(255, 255, 255, 0.06);

    background:
      rgba(14, 16, 27, 0.94);

    backdrop-filter: blur(18px);
  }

  .user-area {
    min-width: 0;

    display: flex;
    align-items: center;

    gap: 13px;
  }

  .back-button,
  .more-button {
    border: none;

    background: transparent;

    color: #858aa0;

    cursor: pointer;

    display: grid;
    place-items: center;

    transition: 0.2s ease;
  }

  .back-button:hover,
  .more-button:hover {
    color: #ffffff;
  }

  .back-button {
    display: none;

    width: 36px;
    height: 36px;

    font-size: 19px;
  }

  /*
  ==============================================================
  AVATAR
  ==============================================================
  */

  .avatar {
    width: 44px;
    height: 44px;

    position: relative;

    flex-shrink: 0;
  }

  .avatar img,
  .avatar-letter {
    width: 44px;
    height: 44px;

    border-radius: 50%;

    object-fit: cover;

    display: grid;
    place-items: center;

    background:
      linear-gradient(
        135deg,
        #7564ff,
        #a450e8
      );

    color: white;

    font-size: 15px;
    font-weight: 700;
  }

  .online-dot {
    position: absolute;

    right: -1px;
    bottom: 0;

    width: 11px;
    height: 11px;

    border-radius: 50%;

    background: #45d483;

    border:
      2px solid #10121e;

    box-shadow:
      0 0 0 3px
      rgba(69, 212, 131, 0.08);
  }

  .user-details {
    min-width: 0;
  }

  .user-details h3 {
    margin: 0 0 4px;

    color: #f5f5f8;

    font-size: 14px;
    font-weight: 600;

    white-space: nowrap;

    overflow: hidden;

    text-overflow: ellipsis;
  }

  .user-details p {
    margin: 0;

    display: flex;
    align-items: center;

    gap: 6px;

    color: #687087;

    font-size: 10px;
  }

  .status-dot {
    width: 6px;
    height: 6px;

    border-radius: 50%;

    background: #45d483;

    box-shadow:
      0 0 8px
      rgba(69, 212, 131, 0.7);
  }

  /*
  ==============================================================
  HEADER MENU
  ==============================================================
  */

  .header-actions {
    position: relative;

    flex-shrink: 0;
  }

  .more-button {
    width: 38px;
    height: 38px;

    border-radius: 11px;

    font-size: 19px;
  }

  .more-button:hover {
    background:
      rgba(255, 255, 255, 0.05);
  }

  .header-menu {
    position: absolute;

    right: 0;
    top: 45px;

    width: 170px;

    padding: 6px;

    border-radius: 12px;

    background: #171a29;

    border:
      1px solid rgba(255, 255, 255, 0.08);

    box-shadow:
      0 18px 40px
      rgba(0, 0, 0, 0.4);

    animation:
      menuIn 0.15s ease;
  }

  .header-menu button {
    width: 100%;

    border: none;

    border-radius: 8px;

    padding: 10px;

    text-align: left;

    color: #c7c9d5;

    background: transparent;

    cursor: pointer;

    font-size: 11px;
  }

  .header-menu button:hover {
    background:
      rgba(255, 255, 255, 0.05);

    color: white;
  }

  /*
  ==============================================================
  CHAT BODY
  ==============================================================
  */

  .chat-body {
    min-width: 0;
    min-height: 0;

    width: 100%;
    height: 100%;

    overflow-y: auto;
    overflow-x: hidden;

    padding:
      30px
      7%
      30px;

    scroll-behavior: smooth;

    background:
      radial-gradient(
        circle at 50% 100%,
        rgba(117, 100, 255, 0.035),
        transparent 35%
      );
  }

  .chat-body::-webkit-scrollbar {
    width: 5px;
  }

  .chat-body::-webkit-scrollbar-track {
    background: transparent;
  }

  .chat-body::-webkit-scrollbar-thumb {
    background:
      rgba(255, 255, 255, 0.09);

    border-radius: 20px;
  }

  .chat-body::-webkit-scrollbar-thumb:hover {
    background:
      rgba(255, 255, 255, 0.14);
  }

  /*
  ==============================================================
  CONVERSATION LABEL
  ==============================================================
  */

  .date-label {
    display: flex;

    justify-content: center;

    margin-bottom: 28px;
  }

  .date-label span {
    padding:
      6px
      12px;

    border-radius: 20px;

    background:
      rgba(255, 255, 255, 0.035);

    border:
      1px solid rgba(255, 255, 255, 0.04);

    color: #5f657a;

    font-size: 8px;
    font-weight: 600;

    letter-spacing: 1.5px;
  }

  /*
  ==============================================================
  MESSAGES
  ==============================================================

  IMPORTANT:
  Do NOT use min-height: 100% here.
  That was causing the message layout to stretch.
  */

  .chats {
    width: 100%;

    display: flex;

    flex-direction: column;

    gap: 10px;
  }

  .message-row {
    width: 100%;

    display: flex;
  }

  .sent-row {
    justify-content: flex-end;
  }

  .received-row {
    justify-content: flex-start;
  }

  .message {
    max-width:
      min(68%, 580px);

    display: flex;

    align-items: flex-end;

    gap: 6px;

    padding:
      11px
      13px;

    border-radius: 17px;

    animation:
      messageIn 0.18s ease;

    overflow-wrap: anywhere;
  }

  .message p {
    margin: 0;

    font-size: 13px;

    line-height: 1.5;

    overflow-wrap: anywhere;
  }

  /*
  SENT MESSAGE
  */

  .sent {
    color: white;

    background:
      linear-gradient(
        135deg,
        #7564ff,
        #9750dc
      );

    border-bottom-right-radius: 5px;

    box-shadow:
      0 8px 24px
      rgba(117, 100, 255, 0.15);
  }

  /*
  RECEIVED MESSAGE
  */

  .received {
    color: #d0d2dc;

    background: #171a29;

    border:
      1px solid
      rgba(255, 255, 255, 0.055);

    border-bottom-left-radius: 5px;
  }

  /*
  MESSAGE CHECK
  */

  .message-status {
    display: flex;

    align-items: center;

    flex-shrink: 0;

    margin-bottom: -1px;

    opacity: 0.65;

    font-size: 11px;
  }

  /*
  ==============================================================
  EMPTY CHAT
  ==============================================================
  */

  .empty-chat {
    min-height: 300px;

    width: 100%;

    display: flex;

    flex-direction: column;

    justify-content: center;

    align-items: center;

    text-align: center;

    color: #70758b;

    position: relative;

    padding: 40px 20px;
  }

  .empty-avatar {
    width: 72px;
    height: 72px;

    display: grid;

    place-items: center;

    margin-bottom: 17px;

    border-radius: 50%;

    background:
      linear-gradient(
        135deg,
        #7564ff,
        #a450e8
      );

    color: white;

    font-size: 25px;

    font-weight: 700;

    box-shadow:
      0 15px 50px
      rgba(117, 100, 255, 0.18);
  }

  .empty-avatar img {
    width: 100%;
    height: 100%;

    border-radius: 50%;

    object-fit: cover;
  }

  .empty-badge {
    position: absolute;

    top:
      calc(50% - 88px);

    margin-left: 55px;

    width: 28px;
    height: 28px;

    display: grid;

    place-items: center;

    border-radius: 50%;

    background: #171a29;

    border:
      1px solid
      rgba(255, 255, 255, 0.08);

    font-size: 13px;
  }

  .empty-chat h3 {
    margin: 0 0 7px;

    color: #d1d3dd;

    font-size: 16px;

    font-weight: 600;
  }

  .empty-chat p {
    max-width: 280px;

    margin: 0;

    color: #62687c;

    font-size: 11px;

    line-height: 1.6;
  }

  /*
  ==============================================================
  COMPOSER
  ==============================================================

  This section is intentionally fixed to the third grid row.
  It will NOT disappear when the chat body gets many messages.
  */

  .composer-area {
    width: 100%;

    min-width: 0;

    min-height: 82px;

    height: 82px;

    position: relative;

    z-index: 30;

    display: flex;

    align-items: center;

    flex-shrink: 0;

    padding:
      13px
      5%;

    border-top:
      1px solid
      rgba(255, 255, 255, 0.055);

    background:
      #0d0f19;
  }

  /*
  ==============================================================
  MESSAGE FORM
  ============================================================== */

  form {
    width: 100%;

    height: 54px;

    min-width: 0;

    display: flex;

    align-items: center;

    gap: 6px;

    padding:
      5px
      6px;

    border-radius: 17px;

    background: #171a29;

    border:
      1px solid
      rgba(255, 255, 255, 0.07);

    transition:
      border 0.2s ease,
      box-shadow 0.2s ease;
  }

  form:focus-within {
    border-color:
      rgba(117, 100, 255, 0.45);

    box-shadow:
      0 0 0 3px
      rgba(117, 100, 255, 0.06);
  }

  /*
  ==============================================================
  INPUT
  ============================================================== */

  input {
    flex: 1;

    min-width: 0;

    width: 100%;

    height: 100%;

    border: none;

    outline: none;

    background: transparent;

    color: white;

    font-size: 12px;
  }

  input::placeholder {
    color: #595f73;
  }

  /*
  ==============================================================
  BUTTONS
  ============================================================== */

  .icon-button,
  .send-button {
    width: 41px;
    height: 41px;

    flex-shrink: 0;

    display: grid;

    place-items: center;

    border: none;

    border-radius: 12px;

    cursor: pointer;

    transition: 0.2s ease;
  }

  /*
  EMOJI
  */

  .icon-button {
    background: transparent;

    color: #70768b;

    font-size: 18px;
  }

  .icon-button:hover,
  .icon-button.active {
    color: #9a8fff;

    background:
      rgba(117, 100, 255, 0.1);
  }

  /*
  SEND
  */

  .send-button {
    color: white;

    background:
      linear-gradient(
        135deg,
        #7564ff,
        #a04fe0
      );

    font-size: 16px;

    box-shadow:
      0 7px 18px
      rgba(117, 100, 255, 0.18);
  }

  .send-button:hover:not(:disabled) {
    transform: translateY(-1px);

    box-shadow:
      0 9px 22px
      rgba(117, 100, 255, 0.3);
  }

  .send-button:active:not(:disabled) {
    transform: scale(0.96);
  }

  .send-button:disabled {
    opacity: 0.3;

    cursor: default;

    box-shadow: none;
  }

  /*
  ==============================================================
  EMOJI PICKER
  ============================================================== */

  .emoji-picker {
    position: absolute;

    left: 5%;

    bottom: 76px;

    z-index: 100;

    display: flex;

    flex-wrap: wrap;

    gap: 5px;

    max-width: 330px;

    padding: 9px;

    border-radius: 14px;

    background: #171a29;

    border:
      1px solid
      rgba(255, 255, 255, 0.08);

    box-shadow:
      0 18px 45px
      rgba(0, 0, 0, 0.45);

    animation:
      menuIn 0.15s ease;
  }

  .emoji-picker button {
    width: 32px;
    height: 32px;

    display: grid;

    place-items: center;

    border: none;

    border-radius: 8px;

    background: transparent;

    font-size: 17px;

    cursor: pointer;

    transition: 0.15s;
  }

  .emoji-picker button:hover {
    background:
      rgba(255, 255, 255, 0.07);

    transform: scale(1.15);
  }

  /*
  ==============================================================
  ANIMATIONS
  ============================================================== */

  @keyframes messageIn {
    from {
      opacity: 0;

      transform:
        translateY(5px);
    }

    to {
      opacity: 1;

      transform:
        translateY(0);
    }
  }

  @keyframes menuIn {
    from {
      opacity: 0;

      transform:
        translateY(-5px);
    }

    to {
      opacity: 1;

      transform:
        translateY(0);
    }
  }

  /*
  ==============================================================
  TABLET
  ============================================================== */

  @media (max-width: 900px) {
    .chat-body {
      padding:
        25px
        5%
        30px;
    }

    .message {
      max-width: 75%;
    }

    .composer-area {
      padding:
        13px
        4%;
    }
  }

  /*
  ==============================================================
  MOBILE
  ============================================================== */

  @media (max-width: 600px) {
    /*
      Keep the composer visible on mobile.
    */

    .chat-header {
      height: 70px;

      padding:
        0
        14px;
    }

    .back-button {
      display: grid;
    }

    .avatar,
    .avatar img,
    .avatar-letter {
      width: 40px;
      height: 40px;
    }

    .chat-body {
      padding:
        20px
        13px
        20px;
    }

    .message {
      max-width: 82%;
    }

    .message p {
      font-size: 12px;
    }

    /*
      IMPORTANT:
      Composer remains a fixed grid row.
    */

    .composer-area {
      height: 82px;

      min-height: 82px;

      padding:
        9px;
    }

    form {
      height: 54px;
    }

    .emoji-picker {
      left: 9px;
      right: 9px;

      max-width: none;

      justify-content: center;

      bottom: 78px;
    }

    .header-menu {
      right: -3px;
    }
  }
`;

export default ChatContainer;