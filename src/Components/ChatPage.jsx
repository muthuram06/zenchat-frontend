import React from "react";
import styled from "styled-components";
import Welcome from "./Welcome";
import ChatContainer from "./ChatContainer";

const ChatPage = ({
  currentUser,
  currentChat,
  setCurrentChat,
  socket,
  headers,
}) => {
  return (
    <Container>
      {currentChat === undefined ? (
        <Welcome currentUser={currentUser} />
      ) : (
        <ChatContainer
          headers={headers}
          socket={socket}
          currentChat={currentChat}
          currentUser={currentUser}
          setCurrentChat={setCurrentChat}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  > * {
    width: 100%;
    height: 100%;

    min-width: 0;
    min-height: 0;
  }
`;

export default ChatPage;