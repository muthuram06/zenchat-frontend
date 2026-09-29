import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiMessageCircle,
  FiSearch,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import logo from "../assets/logo.svg";

const Contacts = ({
  contacts,
  currentUser,
  changeChat,
}) => {
  const [currentUsername, setCurrentUsername] =
    useState(undefined);
  const [currentUserImage, setCurrentUserImage] =
    useState(undefined);
  const [currentSelected, setCurrentSelected] =
    useState(undefined);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (currentUser) {
      setCurrentUsername(currentUser.username);
      setCurrentUserImage(currentUser.AvatarImage);
    }
  }, [currentUser]);

  const filteredContacts = useMemo(() => {
    return contacts.filter((item) =>
      item.username
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [contacts, search]);

  const changeCurrentChat = (item, index) => {
    setCurrentSelected(index);
    changeChat(item);
  };

  const logout = () => {
    localStorage.removeItem("chat-app-user");
    window.location.href = "/login";
  };

  return (
    <Container>
      <div className="top">
        <div className="brand">
          <img src={logo} alt="ZenChat" />
          <div>
            <h3>ZenChat</h3>
            <span>Messages</span>
          </div>
        </div>

        <div className="search">
          <FiSearch />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people..."
          />
        </div>
      </div>

      <div className="section-title">
        <span>CONVERSATIONS</span>
        <FiMessageCircle />
      </div>

      <div className="contacts">
        {filteredContacts.length === 0 ? (
          <div className="empty">
            <FiUser />
            <p>No conversations found</p>
          </div>
        ) : (
          filteredContacts.map((item, index) => (
            <div
              key={item._id || index}
              className={`contact ${
                currentSelected === index
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                changeCurrentChat(item, index)
              }
            >
              <div className="avatar-wrap">
                <img
                  src={item.AvatarImage}
                  alt={item.username}
                />
                <span className="online" />
              </div>

              <div className="contact-info">
                <h4>{item.username}</h4>
                <p>Available to chat</p>
              </div>

              <span className="arrow">›</span>
            </div>
          ))
        )}
      </div>

      <div className="profile">
        {currentUser && (
          <>
            <div className="profile-info">
              <div className="profile-avatar">
                {currentUserImage ? (
                  <img
                    src={currentUserImage}
                    alt={currentUsername}
                  />
                ) : (
                  <FiUser />
                )}
                <span />
              </div>

              <div>
                <h4>{currentUsername}</h4>
                <p>Online now</p>
              </div>
            </div>

            <button onClick={logout} title="Logout">
              <FiLogOut />
            </button>
          </>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: auto auto auto 1fr auto;
  color: white;
  background: #0e101b;
  border-right: 1px solid #ffffff0a;
  overflow: hidden;

  .top {
    padding: 24px 20px 16px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;

    img {
      width: 38px;
      height: 38px;
    }

    h3 {
      margin: 0;
      font-size: 18px;
    }

    span {
      color: #696d82;
      font-size: 11px;
    }
  }

  .search {
    height: 43px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 13px;
    border-radius: 12px;
    background: #171a29;
    border: 1px solid #ffffff08;

    svg {
      color: #686d83;
      flex-shrink: 0;
    }

    input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      color: white;
      font-size: 12px;
    }

    input::placeholder {
      color: #555a70;
    }
  }

  .section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;

    span {
      color: #62677b;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
    }

    svg {
      color: #6f64e8;
    }
  }

  .contacts {
    overflow-y: auto;
    padding: 4px 10px 15px;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #ffffff12;
      border-radius: 10px;
    }
  }

  .contact {
    min-height: 68px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 10px;
    margin-bottom: 5px;
    border-radius: 13px;
    cursor: pointer;
    transition: 0.2s;
  }

  .contact:hover {
    background: #171a29;
  }

  .contact.selected {
    background: linear-gradient(
      90deg,
      #7464ff18,
      #7464ff08
    );
    border: 1px solid #7868ff18;
  }

  .avatar-wrap {
    position: relative;
    flex-shrink: 0;

    img {
      width: 43px;
      height: 43px;
      display: block;
      border-radius: 50%;
      object-fit: cover;
      background: #202337;
    }

    .online {
      position: absolute;
      right: 0;
      bottom: 1px;
      width: 10px;
      height: 10px;
      border: 2px solid #0e101b;
      border-radius: 50%;
      background: #45d483;
    }
  }

  .contact-info {
    min-width: 0;
    flex: 1;

    h4 {
      margin: 0 0 4px;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    p {
      margin: 0;
      color: #656a7e;
      font-size: 10px;
    }
  }

  .arrow {
    color: #484d62;
    font-size: 20px;
  }

  .empty {
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #5d6277;

    svg {
      font-size: 25px;
    }

    p {
      font-size: 11px;
    }
  }

  .profile {
    min-height: 82px;
    padding: 14px 18px;
    border-top: 1px solid #ffffff0a;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0b0d17;
  }

  .profile-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .profile-avatar {
    position: relative;

    img {
      width: 39px;
      height: 39px;
      object-fit: cover;
      border-radius: 50%;
    }

    svg {
      width: 39px;
      height: 39px;
      padding: 9px;
      border-radius: 50%;
      background: #202337;
      color: #9297ad;
    }

    span {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #45d483;
      border: 2px solid #0b0d17;
    }
  }

  .profile-info h4 {
    margin: 0 0 3px;
    font-size: 12px;
  }

  .profile-info p {
    margin: 0;
    color: #45d483;
    font-size: 9px;
  }

  .profile button {
    width: 34px;
    height: 34px;
    border: none;
    border-radius: 10px;
    background: #171a29;
    color: #777c92;
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: 0.2s;
  }

  .profile button:hover {
    color: #ff6b7a;
    background: #ff6b7a12;
  }

  @media (max-width: 600px) {
    .top {
      padding-top: 18px;
    }
  }
`;

export default Contacts;