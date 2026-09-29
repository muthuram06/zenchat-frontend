import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiMessageCircle,
  FiSearch,
  FiLogOut,
  FiUser,
  FiX,
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
    const value = search.trim().toLowerCase();

    if (!value) return contacts;

    return contacts.filter((item) =>
      item.username?.toLowerCase().includes(value)
    );
  }, [contacts, search]);

  const changeCurrentChat = (item) => {
    setCurrentSelected(item._id);
    changeChat(item);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const logout = () => {
    localStorage.removeItem("chat-app-user");
    window.location.href = "/login";
  };

  return (
    <Container>
      {/* BRAND + SEARCH */}
      <div className="top">
        <div className="brand">
          <div className="brand-logo">
            <img src={logo} alt="ZenChat" />
          </div>

          <div className="brand-text">
            <h3>ZenChat</h3>
            <span>Private conversations</span>
          </div>
        </div>

        <div className="search">
          <FiSearch />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people..."
          />

          {search && (
            <button
              className="clear-search"
              onClick={clearSearch}
              type="button"
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="section-title">
        <div>
          <span>CONVERSATIONS</span>

          <small>
            {filteredContacts.length}{" "}
            {filteredContacts.length === 1
              ? "person"
              : "people"}
          </small>
        </div>

        <div className="section-icon">
          <FiMessageCircle />
        </div>
      </div>

      {/* CONTACT LIST */}
      <div className="contacts">
        {filteredContacts.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">
              <FiUser />
            </div>

            <p>
              {search
                ? "No people found"
                : "No conversations yet"}
            </p>

            {search && (
              <small>Try another search</small>
            )}
          </div>
        ) : (
          filteredContacts.map((item) => (
            <div
              key={item._id}
              className={`contact ${
                currentSelected === item._id
                  ? "selected"
                  : ""
              }`}
              onClick={() => changeCurrentChat(item)}
            >
              <div className="avatar-wrap">
                {item.AvatarImage ? (
                  <img
                    src={item.AvatarImage}
                    alt={item.username}
                  />
                ) : (
                  <div className="avatar-fallback">
                    {item.username
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </div>
                )}

                <span className="online" />
              </div>

              <div className="contact-info">
                <h4>{item.username}</h4>

                <p>
                  <span className="mini-dot" />
                  Available to chat
                </p>
              </div>

              <span className="arrow">›</span>
            </div>
          ))
        )}
      </div>

      {/* PROFILE */}
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

              <div className="profile-details">
                <h4>{currentUsername}</h4>

                <p>
                  <span />
                  Online now
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              aria-label="Logout"
            >
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
  grid-template-rows: auto auto 1fr auto;

  color: white;

  background:
    radial-gradient(
      circle at 0% 0%,
      rgba(117, 100, 255, 0.07),
      transparent 32%
    ),
    #0d0f19;

  border-right: 1px solid rgba(255, 255, 255, 0.06);

  overflow: hidden;

  .top {
    padding: 22px 19px 15px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 11px;

    margin-bottom: 20px;
  }

  .brand-logo {
    width: 39px;
    height: 39px;

    display: grid;
    place-items: center;

    border-radius: 12px;

    background:
      linear-gradient(
        135deg,
        rgba(117, 100, 255, 0.16),
        rgba(164, 80, 232, 0.1)
      );

    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .brand-logo img {
    width: 27px;
    height: 27px;
  }

  .brand-text {
    min-width: 0;
  }

  .brand-text h3 {
    margin: 0 0 3px;

    font-size: 17px;
    font-weight: 700;

    letter-spacing: -0.4px;
  }

  .brand-text span {
    color: #666b80;

    font-size: 9px;
  }

  .search {
    height: 44px;

    display: flex;
    align-items: center;
    gap: 9px;

    padding: 0 12px;

    border-radius: 13px;

    background: #171a29;

    border: 1px solid rgba(255, 255, 255, 0.055);

    transition: 0.2s ease;
  }

  .search:focus-within {
    border-color: rgba(117, 100, 255, 0.35);

    box-shadow:
      0 0 0 3px rgba(117, 100, 255, 0.05);
  }

  .search > svg {
    flex-shrink: 0;

    color: #686e84;

    font-size: 15px;
  }

  .search input {
    width: 100%;

    min-width: 0;

    border: none;
    outline: none;

    background: transparent;

    color: white;

    font-size: 11px;
  }

  .search input::placeholder {
    color: #555b70;
  }

  .clear-search {
    width: 23px;
    height: 23px;

    flex-shrink: 0;

    display: grid;
    place-items: center;

    border: none;
    border-radius: 7px;

    background: rgba(255, 255, 255, 0.05);

    color: #70768b;

    cursor: pointer;
  }

  .clear-search:hover {
    color: white;
    background: rgba(255, 255, 255, 0.09);
  }

  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 10px 20px 8px;
  }

  .section-title > div:first-child {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .section-title span {
    color: #62677b;

    font-size: 9px;
    font-weight: 700;

    letter-spacing: 1.4px;
  }

  .section-title small {
    color: #454a5e;

    font-size: 8px;
  }

  .section-icon {
    width: 28px;
    height: 28px;

    display: grid;
    place-items: center;

    border-radius: 9px;

    color: #8175f4;

    background: rgba(117, 100, 255, 0.08);
  }

  .section-icon svg {
    font-size: 14px;
  }

  .contacts {
    overflow-y: auto;

    padding: 4px 10px 15px;
  }

  .contacts::-webkit-scrollbar {
    width: 4px;
  }

  .contacts::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
  }

  .contact {
    min-height: 70px;

    display: flex;
    align-items: center;

    gap: 12px;

    padding: 9px 10px;

    margin-bottom: 5px;

    border-radius: 14px;

    border: 1px solid transparent;

    cursor: pointer;

    transition:
      background 0.2s ease,
      border 0.2s ease,
      transform 0.2s ease;
  }

  .contact:hover {
    background: rgba(255, 255, 255, 0.035);

    transform: translateX(2px);
  }

  .contact.selected {
    background:
      linear-gradient(
        90deg,
        rgba(117, 100, 255, 0.13),
        rgba(117, 100, 255, 0.035)
      );

    border-color: rgba(117, 100, 255, 0.14);

    box-shadow:
      inset 3px 0 0 #7564ff;
  }

  .avatar-wrap {
    width: 43px;
    height: 43px;

    position: relative;

    flex-shrink: 0;
  }

  .avatar-wrap img,
  .avatar-fallback {
    width: 43px;
    height: 43px;

    display: grid;
    place-items: center;

    border-radius: 50%;

    object-fit: cover;

    background:
      linear-gradient(
        135deg,
        #7564ff,
        #a450e8
      );

    color: white;

    font-size: 14px;
    font-weight: 700;
  }

  .online {
    position: absolute;

    right: -1px;
    bottom: 0;

    width: 10px;
    height: 10px;

    border: 2px solid #0e101b;

    border-radius: 50%;

    background: #45d483;

    box-shadow:
      0 0 7px rgba(69, 212, 131, 0.45);
  }

  .contact-info {
    min-width: 0;
    flex: 1;
  }

  .contact-info h4 {
    margin: 0 0 5px;

    color: #e2e3e9;

    font-size: 12px;
    font-weight: 600;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contact-info p {
    margin: 0;

    display: flex;
    align-items: center;
    gap: 5px;

    color: #5e6479;

    font-size: 9px;
  }

  .mini-dot {
    width: 5px;
    height: 5px;

    border-radius: 50%;

    background: #45d483;
  }

  .arrow {
    color: #454a5e;

    font-size: 20px;

    transition: 0.2s;
  }

  .contact:hover .arrow,
  .contact.selected .arrow {
    color: #8378f4;
    transform: translateX(2px);
  }

  .empty {
    min-height: 200px;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    gap: 8px;

    text-align: center;

    color: #5d6277;
  }

  .empty-icon {
    width: 48px;
    height: 48px;

    display: grid;
    place-items: center;

    border-radius: 15px;

    background: rgba(117, 100, 255, 0.08);

    color: #6f66b7;

    font-size: 20px;
  }

  .empty p {
    margin: 0;

    font-size: 10px;
  }

  .empty small {
    color: #454a5e;

    font-size: 9px;
  }

  .profile {
    min-height: 78px;

    padding: 13px 17px;

    border-top: 1px solid rgba(255, 255, 255, 0.055);

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: #0b0d17;
  }

  .profile-info {
    min-width: 0;

    display: flex;
    align-items: center;

    gap: 10px;
  }

  .profile-avatar {
    width: 39px;
    height: 39px;

    position: relative;

    flex-shrink: 0;
  }

  .profile-avatar img,
  .profile-avatar svg {
    width: 39px;
    height: 39px;

    border-radius: 50%;
  }

  .profile-avatar img {
    object-fit: cover;
  }

  .profile-avatar svg {
    padding: 9px;

    background: #202337;

    color: #9297ad;
  }

  .profile-avatar > span {
    position: absolute;

    right: 0;
    bottom: 0;

    width: 9px;
    height: 9px;

    border-radius: 50%;

    background: #45d483;

    border: 2px solid #0b0d17;
  }

  .profile-details {
    min-width: 0;
  }

  .profile-details h4 {
    margin: 0 0 4px;

    color: #d9dbe3;

    font-size: 11px;
    font-weight: 600;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    max-width: 145px;
  }

  .profile-details p {
    margin: 0;

    display: flex;
    align-items: center;
    gap: 5px;

    color: #45d483;

    font-size: 8px;
  }

  .profile-details p span {
    width: 5px;
    height: 5px;

    border-radius: 50%;

    background: #45d483;
  }

  .profile button {
    width: 34px;
    height: 34px;

    flex-shrink: 0;

    border: none;
    border-radius: 10px;

    background: #171a29;

    color: #777c92;

    display: grid;
    place-items: center;

    cursor: pointer;

    transition: 0.2s ease;
  }

  .profile button:hover {
    color: #ff6b7a;

    background: rgba(255, 107, 122, 0.08);

    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    .top {
      padding-top: 18px;
    }

    .section-title {
      padding-left: 17px;
      padding-right: 17px;
    }

    .contact {
      min-height: 67px;
    }
  }
`;

export default Contacts;