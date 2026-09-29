import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FiMessageCircle, FiUsers } from "react-icons/fi";

const Welcome = ({ currentUser }) => {
  const [currentUsername, setCurrentUsername] =
    useState("");

  useEffect(() => {
    if (currentUser) {
      setCurrentUsername(currentUser.username);
    }
  }, [currentUser]);

  return (
    <Container>
      <div className="glow" />

      <div className="content">
        <div className="logo-icon">
          <FiMessageCircle />
        </div>

        <span className="badge">ZENCHAT MESSENGER</span>

        <h1>
          Welcome back,
          <span> {currentUsername}</span>
        </h1>

        <p>
          Choose someone from your conversations and
          start chatting.
        </p>

        <div className="hint">
          <FiUsers />
          <span>Your conversations appear on the left.</span>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background: #0b0d17;
  color: white;

  .glow {
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: #7161ff;
    filter: blur(120px);
    opacity: 0.09;
  }

  .content {
    position: relative;
    text-align: center;
    padding: 30px;
  }

  .logo-icon {
    width: 72px;
    height: 72px;
    display: grid;
    place-items: center;
    margin: 0 auto 22px;
    border-radius: 24px;
    background: linear-gradient(
      135deg,
      #7564ff,
      #a450e8
    );
    box-shadow: 0 20px 50px #7564ff22;
    font-size: 30px;
  }

  .badge {
    color: #85899f;
    font-size: 9px;
    letter-spacing: 2px;
    font-weight: 700;
  }

  h1 {
    margin: 13px 0;
    font-size: clamp(27px, 4vw, 40px);
    letter-spacing: -1px;
  }

  h1 span {
    color: #9b8cff;
  }

  p {
    max-width: 400px;
    margin: auto;
    color: #686d82;
    font-size: 13px;
    line-height: 1.6;
  }

  .hint {
    width: fit-content;
    margin: 25px auto 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 13px;
    border-radius: 10px;
    background: #ffffff05;
    color: #656a7e;
    font-size: 10px;
  }

  .hint svg {
    color: #8172ff;
  }
`;

export default Welcome;