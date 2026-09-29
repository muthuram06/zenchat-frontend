import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import Contacts from "../Components/Contacts";
import ChatPage from "../Components/ChatPage";
import { useNavigate } from "react-router-dom";
import api from "../Utils/api";
import { ToastContainer, toast } from "react-toastify";

const Chat = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(undefined);
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [headers, setHeaders] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const socket = useRef(null);

  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  /* =========================================================
     AUTHENTICATION
  ========================================================= */

  useEffect(() => {
    const storedUser = localStorage.getItem("chat-app-user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (!user) {
        navigate("/login");
        return;
      }

      setCurrentUser(user);

      setHeaders({
        Authorization: `Bearer ${user.token}`,
      });

      if (!user.isAvatarImage) {
        navigate("/avatar");
        return;
      }

      setLoading(false);
    } catch (error) {
      console.error("Invalid stored user:", error);

      localStorage.removeItem("chat-app-user");
      navigate("/login");
    }
  }, [navigate]);

  /* =========================================================
     SOCKET.IO CONNECTION
  ========================================================= */

  useEffect(() => {
  if (currentUser) {
    socket.current = io("https://zenchat-backend-pk3m.onrender.com");
    socket.current.emit("add-user", currentUser._id);
  }

  return () => {
    if (socket.current) {
      socket.current.disconnect();
    }
  };
}, [currentUser]);

  /* =========================================================
     FETCH CONTACTS
  ========================================================= */

  useEffect(() => {
    if (!currentUser || !headers) return;

    const fetchContacts = async () => {
      try {
        const { data } = await api.get(
          `/users/${currentUser._id}`,
          {
            headers,
          }
        );

        if (data.status === false) {
          toast.error(data.message, toastOption);

          localStorage.removeItem("chat-app-user");

          navigate("/login");

          return;
        }

        setContacts(data.data || []);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);

        toast.error(
          error.response?.data?.message ||
            "Unable to load your conversations.",
          toastOption
        );
      }
    };

    fetchContacts();
  }, [currentUser, headers, navigate]);

  /* =========================================================
     CHANGE CURRENT CHAT
  ========================================================= */

  const changeChat = (chat) => {
    setCurrentChat(chat);
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }

    localStorage.removeItem("chat-app-user");

    navigate("/login");
  };

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <>
        <LoadingScreen>
          <div className="loader-card">
            <div className="logo">
              Z
            </div>

            <div className="spinner" />

            <h2>Loading ZenChat</h2>

            <p>
              Preparing your conversations...
            </p>
          </div>
        </LoadingScreen>

        <ToastContainer />
      </>
    );
  }

  /* =========================================================
     MAIN CHAT UI
  ========================================================= */

  return (
    <>
      <Container>
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />

        <div className="app-shell">

          {/* =================================================
              LEFT SIDEBAR
          ================================================= */}

          <aside
            className={`sidebar ${
              currentChat ? "sidebar-hidden-mobile" : ""
            }`}
          >
            <Contacts
              contacts={contacts}
              currentUser={currentUser}
              changeChat={changeChat}
              headers={headers}
            />
          </aside>

          {/* =================================================
              CHAT AREA
          ================================================= */}

          <main
            className={`chat-area ${
              currentChat ? "chat-active-mobile" : ""
            }`}
          >
            {currentChat ? (
              <ChatPage
                currentUser={currentUser}
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                socket={socket}
                headers={headers}
              />
            ) : (
              <EmptyState>
                <div className="glow" />

                <div className="empty-content">

                  <div className="logo-icon">
                    <span>✦</span>
                  </div>

                  <span className="eyebrow">
                    WELCOME TO ZENCHAT
                  </span>

                  <h1>
                    Your conversations,
                    <br />
                    <span>all in one place.</span>
                  </h1>

                  <p>
                    Select a conversation from the
                    sidebar to start messaging.
                  </p>

                  <div className="tip">
                    <span className="tip-icon">
                      💬
                    </span>

                    <div>
                      <strong>
                        Start a conversation
                      </strong>

                      <small>
                        Choose someone from your contacts.
                      </small>
                    </div>
                  </div>

                </div>
              </EmptyState>
            )}
          </main>
        </div>
      </Container>

      <ToastContainer />
    </>
  );
};

/* ============================================================
   MAIN CONTAINER
============================================================ */

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(89, 76, 180, 0.24),
      transparent 30%
    ),
    radial-gradient(
      circle at 90% 90%,
      rgba(172, 67, 195, 0.18),
      transparent 30%
    ),
    #070812;

  .ambient {
    position: absolute;
    width: 350px;
    height: 350px;

    border-radius: 50%;

    filter: blur(120px);

    pointer-events: none;

    opacity: 0.16;
  }

  .ambient-one {
    background: #7564ff;

    top: -180px;
    left: -100px;
  }

  .ambient-two {
    background: #c450e8;

    right: -150px;
    bottom: -180px;
  }

  .app-shell {
    width: min(1420px, 94vw);
    height: min(880px, 92vh);

    display: grid;

    grid-template-columns: 310px minmax(0, 1fr);

    overflow: hidden;

    position: relative;
    z-index: 1;

    border-radius: 26px;

    border: 1px solid rgba(255, 255, 255, 0.07);

    background: #0c0e18;

    box-shadow:
      0 40px 120px rgba(0, 0, 0, 0.55),
      0 0 0 1px rgba(255, 255, 255, 0.015);
  }

  .sidebar {
    min-width: 0;
    min-height: 0;

    overflow: hidden;

    background: #0d0f19;

    border-right: 1px solid rgba(255, 255, 255, 0.06);
  }

  .chat-area {
    min-width: 0;
    min-height: 0;

    overflow: hidden;

    background: #0b0d17;
  }

  @media (max-width: 1100px) {
    .app-shell {
      width: 96vw;
      height: 94vh;

      grid-template-columns: 285px minmax(0, 1fr);
    }
  }

  @media (max-width: 800px) {
    .app-shell {
      width: 100vw;
      height: 100vh;

      border-radius: 0;

      grid-template-columns: 280px minmax(0, 1fr);
    }
  }

  @media (max-width: 600px) {
    .app-shell {
      display: block;

      width: 100vw;
      height: 100vh;

      border-radius: 0;
    }

    .sidebar {
      width: 100%;
      height: 100%;
      border-right: none;

      display: block;
    }

    .sidebar-hidden-mobile {
      display: none;
    }

    .chat-area {
      width: 100%;
      height: 100%;
      display: none;
    }

    .chat-active-mobile {
      display: block;
    }
  }
`;

/* ============================================================
   EMPTY CHAT / WELCOME SCREEN
============================================================ */

const EmptyState = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 40%,
      rgba(103, 91, 255, 0.08),
      transparent 30%
    ),
    #0b0d17;

  .glow {
    position: absolute;

    width: 280px;
    height: 280px;

    border-radius: 50%;

    background: #7564ff;

    filter: blur(130px);

    opacity: 0.08;
  }

  .empty-content {
    position: relative;

    text-align: center;

    padding: 30px;
  }

  .logo-icon {
    width: 76px;
    height: 76px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0 auto 25px;

    border-radius: 24px;

    background:
      linear-gradient(
        135deg,
        #7564ff,
        #a450e8
      );

    box-shadow:
      0 20px 60px rgba(117, 100, 255, 0.24);

    transform: rotate(-3deg);
  }

  .logo-icon span {
    font-size: 30px;

    transform: rotate(3deg);
  }

  .eyebrow {
    color: #8076d8;

    font-size: 10px;

    font-weight: 700;

    letter-spacing: 2.5px;
  }

  h1 {
    margin: 14px 0;

    color: #f7f7fa;

    font-size: clamp(30px, 4vw, 48px);

    line-height: 1.08;

    letter-spacing: -2px;
  }

  h1 span {
    color: #9689ff;
  }

  .empty-content > p {
    max-width: 410px;

    margin: 0 auto;

    color: #686d82;

    font-size: 13px;

    line-height: 1.7;
  }

  .tip {
    width: fit-content;

    display: flex;

    align-items: center;

    gap: 12px;

    margin: 28px auto 0;

    padding: 12px 16px;

    border-radius: 14px;

    border: 1px solid rgba(255, 255, 255, 0.05);

    background: rgba(255, 255, 255, 0.025);

    text-align: left;
  }

  .tip-icon {
    width: 38px;
    height: 38px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 11px;

    background: rgba(117, 100, 255, 0.1);

    font-size: 16px;
  }

  .tip strong {
    display: block;

    color: #bfc2d0;

    font-size: 11px;

    margin-bottom: 3px;
  }

  .tip small {
    color: #5e6378;

    font-size: 9px;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 30px;

      letter-spacing: -1px;
    }

    .logo-icon {
      width: 65px;
      height: 65px;
    }

    .empty-content > p {
      max-width: 300px;
    }
  }
`;

/* ============================================================
   LOADING SCREEN
============================================================ */

const LoadingScreen = styled.div`
  min-height: 100vh;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    radial-gradient(
      circle at 30% 20%,
      rgba(91, 79, 190, 0.2),
      transparent 30%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(176, 70, 198, 0.15),
      transparent 30%
    ),
    #070812;

  color: white;

  .loader-card {
    display: flex;

    flex-direction: column;

    align-items: center;

    text-align: center;
  }

  .logo {
    width: 68px;
    height: 68px;

    display: flex;
    align-items: center;
    justify-content: center;

    margin-bottom: 24px;

    border-radius: 21px;

    background:
      linear-gradient(
        135deg,
        #7564ff,
        #a450e8
      );

    box-shadow:
      0 20px 50px rgba(117, 100, 255, 0.25);

    font-size: 28px;

    font-weight: 800;
  }

  .spinner {
    width: 26px;
    height: 26px;

    margin-bottom: 20px;

    border-radius: 50%;

    border: 2px solid rgba(255, 255, 255, 0.12);

    border-top-color: #897bff;

    animation: spin 0.8s linear infinite;
  }

  h2 {
    margin: 0 0 7px;

    font-size: 17px;

    letter-spacing: -0.3px;
  }

  p {
    margin: 0;

    color: #666b80;

    font-size: 11px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default Chat;